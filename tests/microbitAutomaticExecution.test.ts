import { afterEach, describe, expect, jest, test } from 'bun:test'
import {
  applyMicrobitAction, initialMicrobitState, microbitActions,
  parseMicrobitProgram, runMicrobitActions,
} from '../src/components/MicrobitBoard'

const python = `from microbit import *
if button_a.is_pressed():
    display.show(Image.HAPPY)
if button_b.is_pressed():
    display.show(Image.HEART)
`
const javascript = `if (input.buttonIsPressed(Button.A)) {
  basic.showIcon(IconNames.Happy)
}
if (input.buttonIsPressed(Button.B)) {
  basic.showIcon(IconNames.Heart)
}`

afterEach(() => jest.useRealTimers())

for (const [language, code] of [['python', python], ['javascript', javascript]] as const) {
  describe(language, () => {
    test('event-only program is blank at boot; A and B run only their own body', () => {
      const program = parseMicrobitProgram(code, language)
      expect(microbitActions(program)).toEqual([])
      expect(microbitActions(program, 'a')).toEqual([{ kind: 'display', preview: 'smile' }])
      expect(microbitActions(program, 'b')).toEqual([{ kind: 'display', preview: 'heart' }])
    })
    test('top-level actions run without replaying them on a button press', () => {
      const initial = language === 'python' ? 'display.show(Image.HEART)\n' : 'basic.showIcon(IconNames.Heart);\n'
      const program = parseMicrobitProgram(initial + code, language)
      expect(microbitActions(program)).toEqual([{ kind: 'display', preview: 'heart' }])
      expect(microbitActions(program, 'a')).toEqual([{ kind: 'display', preview: 'smile' }])
    })
    test('nested other-button conditions do not leak into an event', () => {
      const nested = language === 'python'
        ? 'if button_a.is_pressed():\n    if button_b.is_pressed():\n        display.show(Image.HAPPY)\n    display.clear()\n'
        : 'if (input.buttonIsPressed(Button.A)) { if (input.buttonIsPressed(Button.B)) { basic.showIcon(IconNames.Happy); } basic.clearScreen(); }'
      const program = parseMicrobitProgram(nested, language)
      expect(microbitActions(program, 'a')).toEqual([{ kind: 'display', preview: 'blank' }])
      expect(microbitActions(program, 'b')).toEqual([])
    })
    test('comments and strings cannot masquerade as executable instructions', () => {
      const text = language === 'python'
        ? '# display.show(Image.HEART)\ndisplay.scroll("display.show(Image.HAPPY) #")\n'
        : '// basic.showIcon(IconNames.Heart)\nbasic.showString("} basic.showIcon(IconNames.Happy); {"); /* basic.clearScreen(); */'
      expect(microbitActions(parseMicrobitProgram(text, language))).toEqual([])
    })
    test('pins and servo inside button handlers remain inactive until the event', () => {
      const text = language === 'python'
        ? 'if button_a.is_pressed():\n    pin0.write_digital(1)\n    pin1.set_analog_period(20)\n    pin1.write_analog(75)\n'
        : 'if (input.buttonIsPressed(Button.A)) { pins.digitalWritePin(DigitalPin.P0, 1); pins.servoWritePin(AnalogPin.P1, 90); }'
      const program = parseMicrobitProgram(text, language)
      expect(microbitActions(program)).toEqual([])
      const state = microbitActions(program, 'a').reduce(applyMicrobitAction, initialMicrobitState())
      expect(state.pins).toEqual([true, true, false])
      expect(state.servoAngle).toBe(90)
      expect(microbitActions(program, 'b')).toEqual([])
    })
  })
}

test('sequential LEDs and servo change in order after real waits', () => {
  jest.useFakeTimers()
  const program = parseMicrobitProgram('display.show(Image.HEART)\nsleep(1000)\ndisplay.show(Image.HAPPY)\npin1.write_analog(26)\nsleep(1000)\npin1.write_analog(75)', 'python')
  let state = initialMicrobitState()
  const cancel = runMicrobitActions(microbitActions(program), action => { state = applyMicrobitAction(state, action) })
  expect(state.preview).toBe('heart')
  expect(state.servoAngle).toBeNull()
  jest.advanceTimersByTime(999)
  expect(state.preview).toBe('heart')
  jest.advanceTimersByTime(1)
  expect(state.preview).toBe('smile')
  expect(state.servoAngle).toBe(0)
  jest.advanceTimersByTime(1000)
  expect(state.servoAngle).toBe(90)
  cancel()
})

test('reset cancels pending actions, clears hardware and replays boot only', () => {
  jest.useFakeTimers()
  let state = initialMicrobitState()
  const program = parseMicrobitProgram('pin0.write_digital(1)\nsleep(1000)\ndisplay.show(Image.HEART)', 'python')
  const cancel = runMicrobitActions(microbitActions(program), action => { state = applyMicrobitAction(state, action) })
  expect(state.pins[0]).toBe(true)
  cancel()
  state = initialMicrobitState()
  jest.advanceTimersByTime(2000)
  expect(state).toEqual({ preview: 'blank', pins: [false, false, false], servoAngle: null })
  const eventOnly = parseMicrobitProgram(python, 'python')
  runMicrobitActions(microbitActions(eventOnly), action => { state = applyMicrobitAction(state, action) })
  expect(state.preview).toBe('blank')
})

test('clear and digital-off are executed in sequence, not inferred from text', () => {
  const actions = microbitActions(parseMicrobitProgram('basic.showIcon(IconNames.Heart); pins.digitalWritePin(DigitalPin.P2, 1); basic.clearScreen(); pins.digitalWritePin(DigitalPin.P2, 0);', 'javascript'))
  expect(actions.reduce(applyMicrobitAction, initialMicrobitState())).toEqual(initialMicrobitState())
})

test('restart with unchanged source cancels delayed button output and leaves events ready', () => {
  jest.useFakeTimers()
  const program = parseMicrobitProgram('if button_a.is_pressed():\n    sleep(1000)\n    display.show(Image.HAPPY)', 'python')
  let state = initialMicrobitState()
  const apply = (action: Parameters<typeof applyMicrobitAction>[1]) => { state = applyMicrobitAction(state, action) }
  const cancelBoot = runMicrobitActions(microbitActions(program), apply)
  const cancelEvent = runMicrobitActions(microbitActions(program, 'a'), apply)
  jest.advanceTimersByTime(500)
  // Blocks -> Python uses the same source; restart must still discard old jobs.
  cancelBoot()
  cancelEvent()
  state = initialMicrobitState()
  const nextBoot = runMicrobitActions(microbitActions(program), apply)
  jest.advanceTimersByTime(1000)
  expect(state.preview).toBe('blank')
  const nextEvent = runMicrobitActions(microbitActions(program, 'a'), apply)
  jest.advanceTimersByTime(1000)
  expect(state.preview).toBe('smile')
  nextBoot()
  nextEvent()
})
