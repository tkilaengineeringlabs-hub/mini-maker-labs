import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import * as Blockly from 'blockly'

export type MicrobitPreview = 'heart' | 'smile' | 'blank'

export interface MicrobitBlocklyHandle {
  clear: () => void
  resize: () => void
}

interface MicrobitBlocklyWorkspaceProps {
  moduleNumber: number
  language: 'en' | 'id'
  onChange: (pythonCode: string, javascriptCode: string, blockCount: number, preview: MicrobitPreview) => void
}

const THEME = Blockly.Theme.defineTheme('miniMakerMicrobit', {
  name: 'miniMakerMicrobit',
  base: Blockly.Themes.Zelos,
  componentStyles: {
    workspaceBackgroundColour: '#f8fbff',
    toolboxBackgroundColour: '#ffffff',
    toolboxForegroundColour: '#17305f',
    flyoutBackgroundColour: '#f5f8ff',
    flyoutForegroundColour: '#17305f',
    flyoutOpacity: 1,
    scrollbarColour: '#b9c9e8',
    insertionMarkerColour: '#2563eb',
    insertionMarkerOpacity: 0.45,
    cursorColour: '#2563eb',
  },
})

function registerBlocks(spanish: boolean) {
  Blockly.Blocks.maker_show_icon = {
    init() {
      this.appendDummyInput()
        .appendField(spanish ? 'mostrar' : 'show')
        .appendField(new Blockly.FieldDropdown([
          [spanish ? 'corazón' : 'heart', 'HEART'],
          [spanish ? 'cara feliz' : 'smile', 'HAPPY'],
        ]), 'ICON')
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.setColour('#7c3aed')
    },
  }

  Blockly.Blocks.maker_scroll_text = {
    init() {
      this.appendDummyInput()
        .appendField(spanish ? 'mostrar texto' : 'show text')
        .appendField(new Blockly.FieldTextInput(spanish ? 'HOLA' : 'HELLO'), 'TEXT')
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.setColour('#7c3aed')
    },
  }

  Blockly.Blocks.maker_clear_display = {
    init() {
      this.appendDummyInput().appendField(spanish ? 'limpiar pantalla' : 'clear display')
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.setColour('#7c3aed')
    },
  }

  Blockly.Blocks.maker_wait = {
    init() {
      this.appendDummyInput()
        .appendField(spanish ? 'esperar' : 'wait')
        .appendField(new Blockly.FieldNumber(1000, 0, 60000, 100), 'MS')
        .appendField('ms')
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.setColour('#64748b')
    },
  }

  Blockly.Blocks.maker_if_button = {
    init() {
      this.appendDummyInput()
        .appendField(spanish ? 'si botón' : 'if button')
        .appendField(new Blockly.FieldDropdown([['A', 'A'], ['B', 'B']]), 'BUTTON')
        .appendField(spanish ? 'está presionado' : 'is pressed')
      this.appendStatementInput('DO').appendField(spanish ? 'hacer' : 'do')
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.setColour('#d946ef')
    },
  }

  Blockly.Blocks.maker_pin_write = {
    init() {
      this.appendDummyInput()
        .appendField(spanish ? 'poner pin' : 'set pin')
        .appendField(new Blockly.FieldDropdown([['P0', '0'], ['P1', '1'], ['P2', '2']]), 'PIN')
        .appendField(spanish ? 'en' : 'to')
        .appendField(new Blockly.FieldDropdown([['1', '1'], ['0', '0']]), 'VALUE')
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.setColour('#ef4444')
    },
  }

  Blockly.Blocks.maker_show_temperature = {
    init() {
      this.appendDummyInput().appendField(spanish ? 'mostrar temperatura' : 'show temperature')
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.setColour('#14b8a6')
    },
  }

  Blockly.Blocks.maker_show_light = {
    init() {
      this.appendDummyInput().appendField(spanish ? 'mostrar nivel de luz' : 'show light level')
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.setColour('#14b8a6')
    },
  }

  Blockly.Blocks.maker_show_accel_x = {
    init() {
      this.appendDummyInput().appendField(spanish ? 'mostrar aceleración X' : 'show X acceleration')
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.setColour('#14b8a6')
    },
  }

  Blockly.Blocks.maker_servo = {
    init() {
      this.appendDummyInput()
        .appendField(spanish ? 'servo en P1 a' : 'servo on P1 to')
        .appendField(new Blockly.FieldDropdown([['0°', '0'], ['90°', '90'], ['180°', '180']]), 'ANGLE')
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.setColour('#16a34a')
    },
  }
}

function toolboxForModule(moduleNumber: number, spanish: boolean) {
  const display = [
    { kind: 'block', type: 'maker_show_icon' },
    { kind: 'block', type: 'maker_scroll_text' },
    { kind: 'block', type: 'maker_clear_display' },
  ]
  const utility = [{ kind: 'block', type: 'maker_wait' }]
  const events = [{ kind: 'block', type: 'maker_if_button' }]
  const pins = [{ kind: 'block', type: 'maker_pin_write' }]
  const sensors = [
    { kind: 'block', type: 'maker_show_temperature' },
    { kind: 'block', type: 'maker_show_light' },
    { kind: 'block', type: 'maker_show_accel_x' },
  ]
  const servo = [{ kind: 'block', type: 'maker_servo' }]

  const contents: object[] = []
  if (moduleNumber <= 2) {
    contents.push({ kind: 'category', name: spanish ? 'Básico' : 'Basic', colour: '#2563eb', contents: display })
    contents.push({ kind: 'category', name: spanish ? 'Tiempo' : 'Time', colour: '#64748b', contents: utility })
  } else if (moduleNumber === 3) {
    contents.push({ kind: 'category', name: spanish ? 'Entrada' : 'Input', colour: '#d946ef', contents: events })
    contents.push({ kind: 'category', name: 'LED', colour: '#7c3aed', contents: display })
    contents.push({ kind: 'category', name: spanish ? 'Tiempo' : 'Time', colour: '#64748b', contents: utility })
  } else if (moduleNumber === 4) {
    contents.push({ kind: 'category', name: spanish ? 'Pines' : 'Pins', colour: '#ef4444', contents: pins })
    contents.push({ kind: 'category', name: spanish ? 'Tiempo' : 'Time', colour: '#64748b', contents: utility })
  } else if (moduleNumber === 5) {
    contents.push({ kind: 'category', name: spanish ? 'Sensores' : 'Sensors', colour: '#14b8a6', contents: sensors })
    contents.push({ kind: 'category', name: 'LED', colour: '#7c3aed', contents: display })
  } else {
    contents.push({ kind: 'category', name: 'Servo', colour: '#16a34a', contents: servo })
    contents.push({ kind: 'category', name: spanish ? 'Tiempo' : 'Time', colour: '#64748b', contents: utility })
  }

  return { kind: 'categoryToolbox', contents }
}

function indent(text: string, spaces = 4) {
  const prefix = ' '.repeat(spaces)
  return text.split('\n').filter(Boolean).map(line => `${prefix}${line}`).join('\n')
}

function escapeText(value: unknown) {
  return String(value ?? '').replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

function pythonBlockCode(block: Blockly.Block): string {
  switch (block.type) {
    case 'maker_show_icon':
      return `display.show(Image.${block.getFieldValue('ICON')})`
    case 'maker_scroll_text':
      return `display.scroll("${escapeText(block.getFieldValue('TEXT'))}")`
    case 'maker_clear_display':
      return 'display.clear()'
    case 'maker_wait':
      return `sleep(${Number(block.getFieldValue('MS') ?? 1000)})`
    case 'maker_pin_write':
      return `pin${block.getFieldValue('PIN')}.write_digital(${block.getFieldValue('VALUE')})`
    case 'maker_show_temperature':
      return 'display.scroll(str(temperature()))'
    case 'maker_show_light':
      return 'display.scroll(str(display.read_light_level()))'
    case 'maker_show_accel_x':
      return 'display.scroll(str(accelerometer.get_x()))'
    case 'maker_servo': {
      const angle = Number(block.getFieldValue('ANGLE') ?? 90)
      const duty = angle === 0 ? 26 : angle === 180 ? 128 : 75
      return `pin1.set_analog_period(20)\npin1.write_analog(${duty})`
    }
    case 'maker_if_button': {
      const button = String(block.getFieldValue('BUTTON') ?? 'A').toLowerCase()
      const child = block.getInputTargetBlock('DO')
      const body = child ? pythonChainCode(child) : 'pass'
      return `if button_${button}.is_pressed():\n${indent(body)}`
    }
    default:
      return ''
  }
}

function javascriptBlockCode(block: Blockly.Block): string {
  switch (block.type) {
    case 'maker_show_icon':
      return `basic.showIcon(IconNames.${block.getFieldValue('ICON') === 'HEART' ? 'Heart' : 'Happy'})`
    case 'maker_scroll_text':
      return `basic.showString("${escapeText(block.getFieldValue('TEXT'))}")`
    case 'maker_clear_display':
      return 'basic.clearScreen()'
    case 'maker_wait':
      return `basic.pause(${Number(block.getFieldValue('MS') ?? 1000)})`
    case 'maker_pin_write':
      return `pins.digitalWritePin(DigitalPin.P${block.getFieldValue('PIN')}, ${block.getFieldValue('VALUE')})`
    case 'maker_show_temperature':
      return 'basic.showNumber(input.temperature())'
    case 'maker_show_light':
      return 'basic.showNumber(input.lightLevel())'
    case 'maker_show_accel_x':
      return 'basic.showNumber(input.acceleration(Dimension.X))'
    case 'maker_servo':
      return `pins.servoWritePin(AnalogPin.P1, ${Number(block.getFieldValue('ANGLE') ?? 90)})`
    case 'maker_if_button': {
      const button = String(block.getFieldValue('BUTTON') ?? 'A')
      const child = block.getInputTargetBlock('DO')
      const body = child ? javascriptChainCode(child) : '// sin bloques'
      return `if (input.buttonIsPressed(Button.${button})) {\n${indent(body, 2)}\n}`
    }
    default:
      return ''
  }
}

function pythonChainCode(first: Blockly.Block | null): string {
  const chunks: string[] = []
  let current = first
  while (current) {
    const code = pythonBlockCode(current)
    if (code) chunks.push(code)
    current = current.getNextBlock()
  }
  return chunks.join('\n')
}

function javascriptChainCode(first: Blockly.Block | null): string {
  const chunks: string[] = []
  let current = first
  while (current) {
    const code = javascriptBlockCode(current)
    if (code) chunks.push(code)
    current = current.getNextBlock()
  }
  return chunks.join('\n')
}

function workspacePythonCode(workspace: Blockly.WorkspaceSvg): string {
  const tops = workspace.getTopBlocks(true)
  const body = tops.map(block => pythonChainCode(block)).filter(Boolean).join('\n\n')
  return `from microbit import *\n\n${body || '# Arrastra bloques al área de trabajo'}\n`
}

function workspaceJavascriptCode(workspace: Blockly.WorkspaceSvg): string {
  const tops = workspace.getTopBlocks(true)
  const body = tops.map(block => javascriptChainCode(block)).filter(Boolean).join('\n\n')
  return `${body || '// Arrastra bloques al área de trabajo'}\n`
}

function previewFromWorkspace(workspace: Blockly.WorkspaceSvg): MicrobitPreview {
  const blocks = workspace.getAllBlocks(false)
  let preview: MicrobitPreview = 'blank'
  for (const block of blocks) {
    if (block.type === 'maker_show_icon') {
      preview = block.getFieldValue('ICON') === 'HEART' ? 'heart' : 'smile'
    } else if (block.type === 'maker_clear_display') {
      preview = 'blank'
    }
  }
  return preview
}

export const MicrobitBlocklyWorkspace = forwardRef<MicrobitBlocklyHandle, MicrobitBlocklyWorkspaceProps>(
  function MicrobitBlocklyWorkspace({ moduleNumber, language, onChange }, ref) {
    const hostRef = useRef<HTMLDivElement>(null)
    const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null)
    const onChangeRef = useRef(onChange)

    useEffect(() => {
      onChangeRef.current = onChange
    }, [onChange])

    useImperativeHandle(ref, () => ({
      clear() {
        workspaceRef.current?.clear()
      },
      resize() {
        if (workspaceRef.current) Blockly.svgResize(workspaceRef.current)
      },
    }))

    useEffect(() => {
      if (!hostRef.current) return
      const spanish = language === 'id'
      registerBlocks(spanish)

      const workspace = Blockly.inject(hostRef.current, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        toolbox: toolboxForModule(moduleNumber, spanish) as any,
        theme: THEME,
        renderer: 'zelos',
        trashcan: true,
        scrollbars: true,
        grid: { spacing: 24, length: 3, colour: '#d8e3f5', snap: true },
        zoom: { controls: true, wheel: true, startScale: 0.9, minScale: 0.45, maxScale: 1.6, scaleSpeed: 1.15 },
        move: { scrollbars: true, drag: true, wheel: false },
      })

      workspaceRef.current = workspace

      const emit = () => {
        onChangeRef.current(
          workspacePythonCode(workspace),
          workspaceJavascriptCode(workspace),
          workspace.getAllBlocks(false).length,
          previewFromWorkspace(workspace),
        )
      }
      workspace.addChangeListener(emit)
      emit()

      const onResize = () => Blockly.svgResize(workspace)
      window.addEventListener('resize', onResize)

      return () => {
        window.removeEventListener('resize', onResize)
        workspace.removeChangeListener(emit)
        workspace.dispose()
        workspaceRef.current = null
      }
    }, [moduleNumber, language])

    return <div ref={hostRef} className="w-full h-[560px] overflow-hidden" />
  },
)