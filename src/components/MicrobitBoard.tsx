import { useEffect, useMemo, useRef, useState } from 'react'
import type { MicrobitPreview } from './MicrobitBlocklyWorkspace'
import styles from '../screens/MakerMicrobitLesson.module.css'

interface MicrobitBoardProps {
  moduleNumber: number
  codeLanguage: 'python' | 'javascript'
  restartKey: number
  onStateChange?: (state: MicrobitSimulationState) => void
  code: string
  language: 'en' | 'id'
}

const PATTERNS: Record<MicrobitPreview, number[]> = {
  heart: [
    0, 1, 0, 1, 0,
    1, 1, 1, 1, 1,
    1, 1, 1, 1, 1,
    0, 1, 1, 1, 0,
    0, 0, 1, 0, 0,
  ],
  smile: [
    0, 0, 0, 0, 0,
    0, 1, 0, 1, 0,
    0, 0, 0, 0, 0,
    1, 0, 0, 0, 1,
    0, 1, 1, 1, 0,
  ],
  blank: Array(25).fill(0),
}

export type MicrobitAction =
  | { kind: 'display'; preview: MicrobitPreview }
  | { kind: 'wait'; milliseconds: number }
  | { kind: 'pin'; pin: 0 | 1 | 2; active: boolean }
  | { kind: 'servo'; angle: number }

type MicrobitNode = MicrobitAction | { kind: 'event'; button: 'a' | 'b' | null; body: MicrobitNode[] }
export type MicrobitProgram = MicrobitNode[]
export interface MicrobitSimulationState {
  preview: MicrobitPreview
  pins: [boolean, boolean, boolean]
  servoAngle: number | null
}

export function initialMicrobitState(): MicrobitSimulationState {
  return { preview: 'blank', pins: [false, false, false], servoAngle: null }
}

function actionFromStatement(statement: string): MicrobitAction | null {
  let match = statement.match(/^(?:display\.show\(Image\.(HEART|HAPPY)\)|basic\.showIcon\(IconNames\.(Heart|Happy)\))$/)
  if (match) return { kind: 'display', preview: (match[1] ?? match[2]).toLowerCase() === 'heart' ? 'heart' : 'smile' }
  if (/^(?:display\.clear\(\)|basic\.clearScreen\(\))$/.test(statement)) return { kind: 'display', preview: 'blank' }
  match = statement.match(/^(?:sleep|basic\.pause)\(\s*(\d+)\s*\)$/)
  if (match) return { kind: 'wait', milliseconds: Math.min(Number(match[1]), 60000) }
  match = statement.match(/^pin([012])\.write_digital\(\s*([01])\s*\)$/) ?? statement.match(/^pins\.digitalWritePin\(\s*DigitalPin\.P([012]),\s*([01])\s*\)$/)
  if (match) return { kind: 'pin', pin: Number(match[1]) as 0 | 1 | 2, active: match[2] === '1' }
  match = statement.match(/^pins\.servoWritePin\(\s*AnalogPin\.P1,\s*(\d+)\s*\)$/)
  if (match) return { kind: 'servo', angle: Math.min(Number(match[1]), 180) }
  match = statement.match(/^pin1\.write_analog\(\s*(\d+)\s*\)$/)
  if (match) {
    const duty = Number(match[1])
    return { kind: 'servo', angle: duty <= 40 ? 0 : duty >= 110 ? 180 : 90 }
  }
  return null
}

// Tokenize only the supported simulator subset. Never evaluate user code.
function codeTokens(code: string, python: boolean): string[] {
  const tokens: string[] = []
  let text = '', quote = '', escaped = false, lineComment = false, blockComment = false
  for (let i = 0; i < code.length; i++) {
    const char = code[i], next = code[i + 1]
    if (lineComment) {
      if (char === '\n') { lineComment = false; tokens.push(text); text = '' }
      continue
    }
    if (blockComment) {
      if (char === '*' && next === '/') { blockComment = false; i++ }
      continue
    }
    if (quote) {
      text += char
      if (escaped) escaped = false
      else if (char === '\\') escaped = true
      else if (char === quote) quote = ''
      continue
    }
    if (char === '"' || char === "'" || char === '`') { quote = char; text += char; continue }
    if ((python && char === '#') || (!python && char === '/' && next === '/')) { lineComment = true; continue }
    if (!python && char === '/' && next === '*') { blockComment = true; i++; continue }
    if (char === '\n' || (!python && (char === ';' || char === '{' || char === '}'))) {
      tokens.push(text); text = ''
      if (char === '{' || char === '}') tokens.push(char)
    } else text += char
  }
  tokens.push(text)
  return tokens
}

export function parseMicrobitProgram(code: string, language: 'python' | 'javascript'): MicrobitProgram {
  const root: MicrobitProgram = []
  const stack: { indent: number; body: MicrobitNode[] }[] = [{ indent: -1, body: root }]
  let header = ''
  for (const token of codeTokens(code, language === 'python')) {
    const statement = token.trim()
    if (!statement) continue
    if (language === 'python') {
      const indent = token.match(/^\s*/)?.[0].replace(/\t/g, '    ').length ?? 0
      while (stack.length > 1 && indent <= stack[stack.length - 1].indent) stack.pop()
      if (statement.endsWith(':')) {
        const match = statement.match(/^if\s+button_([ab])\.is_pressed\(\)\s*:/)
        const node: MicrobitNode = { kind: 'event', button: match ? match[1] as 'a' | 'b' : null, body: [] }
        stack[stack.length - 1].body.push(node)
        stack.push({ indent, body: node.body })
      } else {
        const action = actionFromStatement(statement)
        if (action) stack[stack.length - 1].body.push(action)
      }
    } else if (statement === '{') {
      const match = header.match(/^if\s*\(\s*input\.buttonIsPressed\(Button\.([AB])\)\s*\)$/)
      const node: MicrobitNode = { kind: 'event', button: match ? match[1].toLowerCase() as 'a' | 'b' : null, body: [] }
      stack[stack.length - 1].body.push(node)
      stack.push({ indent: 0, body: node.body })
      header = ''
    } else if (statement === '}') {
      if (stack.length > 1) stack.pop()
      header = ''
    } else {
      header = statement
      const action = actionFromStatement(statement)
      if (action) stack[stack.length - 1].body.push(action)
    }
  }
  return root
}

export function microbitActions(program: MicrobitProgram, button?: 'a' | 'b'): MicrobitAction[] {
  const actions: MicrobitAction[] = []
  const append = (nodes: MicrobitNode[], insideEvent: boolean) => {
    for (const node of nodes) {
      if (actions.length >= 200) return
      if (node.kind === 'event') {
        if (button && node.button === button) append(node.body, true)
      } else if (button ? insideEvent : !insideEvent) actions.push(node)
    }
  }
  append(program, false)
  return actions
}

export function applyMicrobitAction(state: MicrobitSimulationState, action: MicrobitAction): MicrobitSimulationState {
  if (action.kind === 'display') return { ...state, preview: action.preview }
  if (action.kind === 'pin') {
    const pins = [...state.pins] as MicrobitSimulationState['pins']
    pins[action.pin] = action.active
    return { ...state, pins }
  }
  if (action.kind === 'servo') return { ...state, servoAngle: action.angle, pins: [state.pins[0], true, state.pins[2]] }
  return state
}

export function runMicrobitActions(actions: MicrobitAction[], apply: (action: MicrobitAction) => void): () => void {
  let timer: ReturnType<typeof setTimeout> | null = null
  let cancelled = false, index = 0
  const advance = () => {
    while (!cancelled && index < actions.length) {
      const action = actions[index++]
      if (action.kind === 'wait') { timer = setTimeout(advance, action.milliseconds); return }
      apply(action)
    }
  }
  advance()
  return () => { cancelled = true; if (timer !== null) clearTimeout(timer) }
}

export function MicrobitBoard({ moduleNumber, code, codeLanguage, restartKey, onStateChange, language }: MicrobitBoardProps) {
  const spanish = language === 'id'
  const [simulation, setSimulation] = useState(initialMicrobitState)
  const program = useMemo(() => parseMicrobitProgram(code, codeLanguage), [code, codeLanguage])
  const cancelEvents = useRef<Partial<Record<'a' | 'b', () => void>>>({})
  const apply = (action: MicrobitAction) => setSimulation(state => applyMicrobitAction(state, action))

  useEffect(() => {
    Object.values(cancelEvents.current).forEach(cancel => cancel?.())
    cancelEvents.current = {}
    setSimulation(initialMicrobitState())
    const cancelBoot = runMicrobitActions(microbitActions(program), apply)
    return () => {
      cancelBoot()
      Object.values(cancelEvents.current).forEach(cancel => cancel?.())
      cancelEvents.current = {}
    }
  }, [program, moduleNumber, restartKey])

  useEffect(() => { onStateChange?.(simulation) }, [simulation, onStateChange])

  const ledPattern = PATTERNS[simulation.preview]
  const servoAngle = simulation.servoAngle
  const [pin0, pin1, pin2] = simulation.pins
  const pressButton = (button: 'a' | 'b') => {
    const actions = microbitActions(program, button)
    if (!actions.length) return
    cancelEvents.current[button]?.()
    cancelEvents.current[button] = runMicrobitActions(actions, apply)
  }

  const pins = [
    { label: '0', active: pin0 },
    { label: '1', active: pin1 },
    { label: '2', active: pin2 },
    { label: '3V', active: false },
    { label: 'GND', active: false },
  ]

  const armRotation = servoAngle === null ? -25 : servoAngle - 90

  return (
    <div className={`${styles.hardware} w-full`}>
      <div className={`${styles.hardwareScene} relative mx-auto w-full max-w-[390px] select-none ${moduleNumber === 6 ? 'h-[470px]' : 'h-[290px]'}`}>
        <div className="absolute left-1/2 top-2 h-[253px] w-[310px] -translate-x-1/2 overflow-hidden rounded-[19px] bg-[#111111] shadow-[0_8px_20px_rgba(17,17,17,.12)]">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 558 456" aria-hidden="true">
            <rect width="558" height="456" rx="34" fill="#111111" />
            <path d="M0 0H129L0 127ZM129 0H194L129 64ZM194 0H228L194 33Z" fill="#FF3454" />

            <rect x="236" y="62" width="89" height="44" rx="22" fill="none" stroke="#FF3454" strokeWidth="11" />
            <circle cx="259" cy="84" r="6" fill="#FF3454" />
            <circle cx="303" cy="84" r="6" fill="#FF3454" />

            {ledPattern.map((on, index) => (
              <rect
                key={index}
                x={174 + (index % 5) * 52}
                y={127 + Math.floor(index / 5) * 49}
                width="11"
                height="23"
                rx="2"
                fill={on ? '#FF3454' : '#222222'}
                style={{ filter: on ? 'drop-shadow(0 0 5px #FF3454)' : 'none', transition: 'fill 150ms, filter 150ms' }}
              />
            ))}

            <circle cx="16" cy="227" r="5" fill="#FFFFFF" />
            <circle cx="544" cy="227" r="5" fill="#FFFFFF" />
            <path d="M25 308H61V272ZM500 149H536L500 185Z" fill="#FF3454" />
            <text x="44" y="304" fontFamily="Arial, sans-serif" fontSize="22" fontWeight="700" fill="#111111">A</text>
            <text x="502" y="170" fontFamily="Arial, sans-serif" fontSize="22" fontWeight="700" fill="#111111">B</text>

            {/* Reference marking only: combined input behavior is unchanged. */}
            <rect x="469" y="282" width="62" height="62" rx="3" fill="#332C2C" />
            <circle cx="479" cy="292" r="7" fill="#764B4B" />
            <circle cx="521" cy="292" r="7" fill="#764B4B" />
            <circle cx="479" cy="334" r="7" fill="#764B4B" />
            <circle cx="521" cy="334" r="7" fill="#764B4B" />
            <circle cx="500" cy="313" r="19" fill="#FFFFFF" />
            <text x="434" y="309" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="700" fill="#FFFFFF">A+B</text>

            <rect x="0" y="402" width="558" height="54" fill="#D4AE2D" />
            {Array.from({ length: 40 }, (_, index) => (
              <rect key={index} x={index * 14 + 2} y="402" width="3" height="54" fill="#28251A" />
            ))}
            {pins.map((pin, index) => (
              <g key={pin.label} transform={`translate(${[45, 157, 280, 403, 514][index]}, 0)`}>
                <rect x="-26" y="383" width="52" height="73" fill={pin.active ? '#FFE574' : '#D4AE2D'} />
                <circle cy="383" r="26" fill={pin.active ? '#FFE574' : '#D4AE2D'} style={{ filter: pin.active ? 'drop-shadow(0 0 5px #FFD53D)' : 'none' }} />
                <circle cy="383" r="21" fill={pin.active ? '#6A5410' : '#111111'} />
                <text y="437" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize={pin.label === 'GND' ? 23 : 25} fontWeight="700" fill="#111111">{pin.label}</text>
                <rect x="-11" y="449" width="22" height="7" fill="#AAA9A3" />
              </g>
            ))}
          </svg>

          <button
            type="button"
            onClick={() => pressButton('a')}
            className="absolute left-[6px] top-[99px] h-14 w-14 rounded-md bg-transparent active:scale-95"
            title={spanish ? 'Botón A' : 'Button A'}
            aria-label={spanish ? 'Botón A' : 'Button A'}
          >
            <span className="absolute inset-[11px] rounded-[2px] bg-[#92938E]" />
            <span className="absolute left-[14px] top-[14px] h-[7px] w-[7px] rounded-full bg-[#764B4B]" />
            <span className="absolute right-[14px] top-[14px] h-[7px] w-[7px] rounded-full bg-[#764B4B]" />
            <span className="absolute left-[14px] bottom-[14px] h-[7px] w-[7px] rounded-full bg-[#764B4B]" />
            <span className="absolute right-[14px] bottom-[14px] h-[7px] w-[7px] rounded-full bg-[#764B4B]" />
            <span className="absolute left-1/2 top-1/2 h-[19px] w-[19px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#111111]" />
          </button>

          <button
            type="button"
            onClick={() => pressButton('b')}
            className="absolute right-[4px] top-[99px] h-14 w-14 rounded-md bg-transparent active:scale-95"
            title={spanish ? 'Botón B' : 'Button B'}
            aria-label={spanish ? 'Botón B' : 'Button B'}
          >
            <span className="absolute inset-[11px] rounded-[2px] bg-[#92938E]" />
            <span className="absolute left-[14px] top-[14px] h-[7px] w-[7px] rounded-full bg-[#764B4B]" />
            <span className="absolute right-[14px] top-[14px] h-[7px] w-[7px] rounded-full bg-[#764B4B]" />
            <span className="absolute left-[14px] bottom-[14px] h-[7px] w-[7px] rounded-full bg-[#764B4B]" />
            <span className="absolute right-[14px] bottom-[14px] h-[7px] w-[7px] rounded-full bg-[#764B4B]" />
            <span className="absolute left-1/2 top-1/2 h-[19px] w-[19px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#111111]" />
          </button>
        </div>

        {moduleNumber === 6 && (<>
          <svg className="absolute left-1/2 top-[254px] h-[168px] w-[280px] -translate-x-1/2 overflow-visible" viewBox="0 0 280 168" aria-hidden="true">
            <path d="M88 0 C88 42 106 48 118 82" fill="none" stroke="#087D8B" strokeWidth="5" strokeLinecap="round" />
            <path d="M151 0 C151 40 133 49 131 82" fill="none" stroke="#ff5b43" strokeWidth="5" strokeLinecap="round" />
            <path d="M207 0 C207 38 163 46 143 82" fill="none" stroke="#10AEC2" strokeWidth="5" strokeLinecap="round" />
            <rect x="113" y="68" width="38" height="17" rx="4" fill="#24262a" />
            <rect x="119" y="82" width="26" height="17" rx="3" fill="#141518" />
          </svg>

          <div className="absolute left-1/2 top-[337px] h-[112px] w-[96px] -translate-x-1/2 rounded-t-[4px] rounded-b-[10px] bg-[#10AEC2] shadow-[0_16px_24px_rgba(8,125,139,.12)]">
            <div className="absolute left-1/2 top-2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#087D8B]" />
            <div className="absolute left-1/2 top-[33px] h-[70px] w-[60px] -translate-x-1/2 rounded-[50%] bg-[#087D8B]" />
            <div className="absolute left-1/2 top-[43px] h-7 w-7 -translate-x-1/2 rounded-full bg-[#173644]" />
            <div
              className="absolute left-1/2 top-[54px] h-4 w-[86px] origin-[12px_50%] rounded-full border border-[#aeb4bc] bg-[#eef0f3] shadow-sm transition-transform duration-500"
              style={{ transform: `translateX(-12px) rotate(${armRotation}deg)` }}
            >
              <span className="absolute left-2 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-[#88909a]" />
            </div>
          </div>
        </>)}
      </div>

      {moduleNumber === 6 && servoAngle !== null && (
        <div className="mx-auto -mt-1 flex max-w-[260px] items-center justify-between rounded-full bg-[#ECFAFC] px-4 py-2 text-xs font-black text-[#173644]">
          <span>Servo P1</span>
          <span>{servoAngle}°</span>
        </div>
      )}
    </div>
  )
}
