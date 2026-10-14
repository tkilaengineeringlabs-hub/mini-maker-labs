import { useMemo, useState } from 'react'
import type { MicrobitPreview } from './MicrobitBlocklyWorkspace'
import styles from '../screens/MakerMicrobitLesson.module.css'

interface MicrobitBoardProps {
  moduleNumber: number
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
  const pythonMarker = `button_${button}.is_pressed()`
  const jsMarker = `Button.${button.toUpperCase()}`
  const index = Math.max(code.indexOf(pythonMarker), code.indexOf(jsMarker))
  if (index === -1) return null
  const section = code.slice(index, index + 360)
  if (section.includes('HEART') || section.includes('Heart')) return 'heart'
  if (section.includes('HAPPY') || section.includes('Happy')) return 'smile'
  return null
}

function getPinState(code: string, pin: number) {
  const python = [...code.matchAll(new RegExp(`pin${pin}\\.write_digital\\((0|1)\\)`, 'g'))]
  const js = [...code.matchAll(new RegExp(`DigitalPin\\.P${pin},\\s*(0|1)`, 'g'))]
  const matches = [...python, ...js]
  if (!matches.length) return false
  return matches[matches.length - 1][1] === '1'
}

function getServoAngle(code: string) {
  const js = [...code.matchAll(/servoWritePin\([^,]+,\s*(\d+)\)/g)]
  if (js.length) return Number(js[js.length - 1][1])
  const python = [...code.matchAll(/pin1\.write_analog\((\d+)\)/g)]
  if (!python.length) return null
  const duty = Number(python[python.length - 1][1])
  if (duty <= 40) return 0
  if (duty >= 110) return 180
  return 90
}

export function MicrobitBoard({ moduleNumber, preview, code, running, language }: MicrobitBoardProps) {
  const spanish = language === 'id'
  const [buttonOverride, setButtonOverride] = useState<MicrobitPreview | null>(null)
  const shownPreview = running ? (buttonOverride ?? preview) : 'blank'
  const ledPattern = useMemo(() => PATTERNS[shownPreview], [shownPreview])
  const servoAngle = running ? getServoAngle(code) : null
  const pin0 = running && getPinState(code, 0)
  const pin1 = running && (getPinState(code, 1) || servoAngle !== null)
  const pin2 = running && getPinState(code, 2)

  const pressButton = (button: 'a' | 'b') => {
    if (!running) return
    const next = buttonPreview(code, button)
    if (next) setButtonOverride(next)
    window.setTimeout(() => setButtonOverride(null), 900)
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
        <div className="absolute left-1/2 top-2 h-[265px] w-[310px] -translate-x-1/2 overflow-hidden rounded-[28px] bg-[#111214] shadow-[0_22px_45px_rgba(26,45,83,.22)]">
          <div className="absolute left-0 top-0 h-20 w-20 bg-[#ffd63d] [clip-path:polygon(0_0,100%_0,0_100%)]" />
          <div className="absolute left-[54px] top-0 h-14 w-14 bg-[#ffd63d] [clip-path:polygon(0_0,55%_0,0_55%)]" />
          <div className="absolute left-[102px] top-0 h-10 w-10 bg-[#ffd63d] [clip-path:polygon(0_0,55%_0,0_55%)]" />

          <div className="absolute left-1/2 top-5 h-7 w-14 -translate-x-1/2 rounded-full border-[6px] border-[#ffd63d] bg-[#0d0e10]">
            <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ffd63d]" />
          </div>

          <button
            type="button"
            onClick={() => pressButton('a')}
            className="absolute left-6 top-[83px] h-14 w-14 rounded-2xl border border-white/10 bg-transparent active:scale-95"
            title={spanish ? 'Botón A' : 'Button A'}
          >
            <span className="absolute inset-[7px] rounded-lg border-4 border-[#b4b7bd] bg-[#27282b] shadow-[inset_0_0_0_5px_#111214]" />
            <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6f7378]" />
            <span className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#c9ccd0]" />
            <span className="absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#c9ccd0]" />
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-black text-white">A</span>
          </button>

          <button
            type="button"
            onClick={() => pressButton('b')}
            className="absolute right-6 top-[83px] h-14 w-14 rounded-2xl border border-white/10 bg-transparent active:scale-95"
            title={spanish ? 'Botón B' : 'Button B'}
          >
            <span className="absolute inset-[7px] rounded-lg border-4 border-[#b4b7bd] bg-[#27282b] shadow-[inset_0_0_0_5px_#111214]" />
            <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6f7378]" />
            <span className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#c9ccd0]" />
            <span className="absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#c9ccd0]" />
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-black text-white">B</span>
          </button>

          <div className="absolute left-1/2 top-[72px] grid -translate-x-1/2 grid-cols-5 gap-[8px]">
            {ledPattern.map((on, index) => (
              <div
                key={index}
                className={`h-4 w-4 rounded-[3px] transition-all ${on ? 'bg-[#ff4051] shadow-[0_0_11px_rgba(255,64,81,.95)]' : 'bg-[#2a191b]'}`}
              />
            ))}
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-[76px] bg-[#0d0e10]">
            <div className="absolute inset-x-0 top-0 flex justify-center gap-[7px]">
              {Array.from({ length: 31 }, (_, index) => (
                <span key={index} className="h-8 w-[4px] bg-[#d6ad24]" />
              ))}
            </div>
            <div className="absolute inset-x-3 bottom-1 flex items-end justify-between">
              {pins.map(pin => (
                <div key={pin.label} className="relative flex h-[62px] w-[54px] items-end justify-center">
                  <div className={`absolute bottom-0 h-[48px] w-[48px] rounded-full border-[7px] ${pin.active ? 'border-[#ffe574] bg-[#6a5410] shadow-[0_0_18px_rgba(255,213,61,.55)]' : 'border-[#d6ad24] bg-[#111214]'}`} />
                  <span className="relative z-10 mb-[15px] text-[12px] font-black text-[#ffe36a]">{pin.label}</span>
                </div>
              ))}
            </div>
          </div>
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

      {moduleNumber === 6 && servoAngle !== null && running && (
        <div className="mx-auto -mt-1 flex max-w-[260px] items-center justify-between rounded-full bg-[#ECFAFC] px-4 py-2 text-xs font-black text-[#173644]">
          <span>Servo P1</span>
          <span>{servoAngle}°</span>
        </div>
      )}
    </div>
  )
}
