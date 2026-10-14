import { useMemo, useState } from 'react'
import { Cpu, Radio, Thermometer, Waves } from 'lucide-react'
import type { MicrobitPreview } from './MicrobitBlocklyWorkspace'

interface MicrobitBoardProps {
  preview: MicrobitPreview
  code: string
  running: boolean
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

function buttonPreview(code: string, button: 'a' | 'b'): MicrobitPreview | null {
  const marker = `button_${button}.is_pressed()`
  const index = code.indexOf(marker)
  if (index === -1) return null
  const section = code.slice(index, index + 260)
  if (section.includes('Image.HEART')) return 'heart'
  if (section.includes('Image.HAPPY')) return 'smile'
  return null
}

function getPinState(code: string, pin: number) {
  const matches = [...code.matchAll(new RegExp(`pin${pin}\\.write_digital\\((0|1)\\)`, 'g'))]
  if (!matches.length) return false
  return matches[matches.length - 1][1] === '1'
}

function getServoAngle(code: string) {
  const matches = [...code.matchAll(/pin1\.write_analog\((\d+)\)/g)]
  if (!matches.length) return null
  const duty = Number(matches[matches.length - 1][1])
  if (duty <= 40) return 0
  if (duty >= 110) return 180
  return 90
}

export function MicrobitBoard({ preview, code, running, language }: MicrobitBoardProps) {
  const spanish = language === 'id'
  const [buttonOverride, setButtonOverride] = useState<MicrobitPreview | null>(null)
  const shownPreview = running ? (buttonOverride ?? preview) : 'blank'
  const pin0 = running && getPinState(code, 0)
  const pin1 = running && getPinState(code, 1)
  const pin2 = running && getPinState(code, 2)
  const servoAngle = running ? getServoAngle(code) : null

  const ledPattern = useMemo(() => PATTERNS[shownPreview], [shownPreview])

  const pressButton = (button: 'a' | 'b') => {
    if (!running) return
    const next = buttonPreview(code, button)
    if (next) setButtonOverride(next)
    window.setTimeout(() => setButtonOverride(null), 900)
  }

  const pinInfo = [
    { label: '0', active: pin0 },
    { label: '1', active: pin1 },
    { label: '2', active: pin2 },
    { label: '3V', active: false },
    { label: 'GND', active: false },
  ]

  return (
    <div className="w-full">
      <div className="relative mx-auto w-full max-w-[520px] aspect-[1.23/1] rounded-[44px] border border-white/15 bg-[#0b1020] shadow-[0_30px_80px_rgba(0,0,0,.45)] overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/[0.06] to-transparent pointer-events-none" />

        <div className="absolute top-5 left-6 flex items-center gap-2 text-white/80 font-black tracking-tight">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
          </div>
          <span>micro:bit</span>
        </div>

        <div className="absolute top-5 right-6 text-[10px] uppercase tracking-[.18em] text-white/30 font-black">Mini Maker Labs</div>

        <div className="absolute top-[21%] left-1/2 -translate-x-1/2 grid grid-cols-5 gap-[9px] rounded-2xl bg-black/30 border border-white/5 p-4">
          {ledPattern.map((on, index) => (
            <div
              key={index}
              className={`w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-[5px] border transition-all duration-200 ${
                on
                  ? 'bg-[#ff4157] border-[#ff8291] shadow-[0_0_14px_rgba(255,65,87,.9)]'
                  : 'bg-[#32151d] border-[#4b2029]'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => pressButton('a')}
          className="absolute left-[12%] top-[39%] group"
          title={spanish ? 'Botón A' : 'Button A'}
        >
          <div className="w-14 h-14 rounded-full border-4 border-[#8e98a8] bg-[#232a37] shadow-[inset_0_0_0_5px_#111827,0_8px_20px_rgba(0,0,0,.35)] group-active:scale-95 transition-transform flex items-center justify-center font-black text-xl text-white/80">A</div>
        </button>

        <button
          type="button"
          onClick={() => pressButton('b')}
          className="absolute right-[12%] top-[39%] group"
          title={spanish ? 'Botón B' : 'Button B'}
        >
          <div className="w-14 h-14 rounded-full border-4 border-[#8e98a8] bg-[#232a37] shadow-[inset_0_0_0_5px_#111827,0_8px_20px_rgba(0,0,0,.35)] group-active:scale-95 transition-transform flex items-center justify-center font-black text-xl text-white/80">B</div>
        </button>

        <div className="absolute left-[10%] bottom-[25%] flex items-center gap-2 text-white/35 text-[10px] font-bold">
          <Radio size={15} /> radio / BLE
        </div>
        <div className="absolute right-[10%] bottom-[25%] flex items-center gap-2 text-white/35 text-[10px] font-bold">
          <Waves size={15} /> accelerometer
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[27%] flex items-center gap-1.5 text-white/28 text-[9px] font-bold">
          <Thermometer size={13} /> temp
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 bottom-[17%] flex items-center gap-2 text-white/25 text-[10px]">
          <Cpu size={15} /> nRF52
        </div>

        <div className="absolute inset-x-[6%] bottom-0 h-[20%] flex items-end justify-center gap-3 sm:gap-5 pb-3">
          {pinInfo.map(pin => (
            <div key={pin.label} className="flex flex-col items-center gap-1.5">
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full border-[6px] flex items-center justify-center font-black text-xs transition-all ${
                  pin.active
                    ? 'border-yellow-300 bg-yellow-300/20 text-yellow-100 shadow-[0_0_22px_rgba(253,224,71,.55)]'
                    : 'border-[#d7b44b] bg-[#473b16] text-[#f6dc86]'
                }`}
              >
                {pin.label}
              </div>
              <span className="text-[9px] text-white/25 font-black">{pin.label === '3V' || pin.label === 'GND' ? pin.label : `P${pin.label}`}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-left">
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
          <div className="text-[10px] uppercase tracking-[.16em] text-white/30 font-black mb-1">{spanish ? 'Entradas' : 'Inputs'}</div>
          <div className="text-sm text-white/65">A / B · {spanish ? 'luz · movimiento · temperatura' : 'light · motion · temperature'}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
          <div className="text-[10px] uppercase tracking-[.16em] text-white/30 font-black mb-1">{spanish ? 'Salida' : 'Output'}</div>
          <div className="text-sm text-white/65">LED 5×5 · P0 / P1 / P2{servoAngle !== null ? ` · Servo ${servoAngle}°` : ''}</div>
        </div>
      </div>

      {running && servoAngle !== null && (
        <div className="mt-3 rounded-2xl border border-violet-400/20 bg-violet-400/[0.06] p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-violet-200 font-bold">Servo P1</span>
            <span className="font-black text-white">{servoAngle}°</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-violet-400 transition-all duration-500" style={{ width: `${Math.max(4, servoAngle / 1.8)}%` }} />
          </div>
        </div>
      )}

      <p className="text-center text-xs text-white/35 mt-4">
        {running
          ? (spanish ? 'Simulación activa. Los botones A y B se pueden pulsar.' : 'Simulation active. Buttons A and B are clickable.')
          : (spanish ? 'Presiona Ejecutar para activar la placa.' : 'Press Run to activate the board.')}
      </p>
    </div>
  )
}
