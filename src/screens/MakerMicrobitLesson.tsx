import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Blocks, Code2, Play, RotateCcw, Sparkles, Trash2 } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageProvider'

type MakerBlock = {
  id: string
  labelEs: string
  labelEn: string
  code: string
  kind: 'display' | 'event' | 'pin' | 'sensor' | 'servo' | 'utility'
}

type Module = {
  number: number
  titleEs: string
  titleEn: string
  introEs: string
  introEn: string
  missionEs: string
  missionEn: string
  blocks: MakerBlock[]
}

const HEART = `Image("09090:99999:99999:09990:00900")`
const SMILE = `Image("00000:09090:00000:90009:09990")`

const MODULES: Module[] = [
  {
    number: 1,
    titleEs: 'Conoce tu micro:bit',
    titleEn: 'Meet your micro:bit',
    introEs: 'La micro:bit es una pequeña computadora con una matriz de 25 LEDs, botones, sensores y pines para conectar componentes.',
    introEn: 'The micro:bit is a tiny computer with 25 LEDs, buttons, sensors and pins for external components.',
    missionEs: 'Arma un programa que muestre un mensaje de bienvenida.',
    missionEn: 'Build a program that shows a welcome message.',
    blocks: [
      { id: 'welcome', labelEs: 'mostrar "Hola Maker"', labelEn: 'show "Hello Maker"', code: `display.scroll("Hola Maker")`, kind: 'display' },
      { id: 'heart', labelEs: 'mostrar corazón', labelEn: 'show heart', code: `display.show(${HEART})`, kind: 'display' },
      { id: 'wait', labelEs: 'esperar 1 segundo', labelEn: 'wait 1 second', code: 'sleep(1000)', kind: 'utility' },
    ],
  },
  {
    number: 2,
    titleEs: 'Matriz LED',
    titleEn: 'LED matrix',
    introEs: 'La pantalla de la micro:bit tiene una matriz de 5 × 5 LEDs. Puedes mostrar iconos, letras y patrones sin conectar nada extra.',
    introEn: 'The micro:bit has a 5 × 5 LED matrix. You can show icons, letters and patterns without extra hardware.',
    missionEs: 'Crea una secuencia que muestre un corazón, espere y después muestre una cara feliz.',
    missionEn: 'Create a sequence that shows a heart, waits, then shows a smile.',
    blocks: [
      { id: 'heart', labelEs: 'mostrar corazón', labelEn: 'show heart', code: `display.show(${HEART})`, kind: 'display' },
      { id: 'smile', labelEs: 'mostrar cara feliz', labelEn: 'show smile', code: `display.show(${SMILE})`, kind: 'display' },
      { id: 'hello', labelEs: 'mostrar texto "HOLA"', labelEn: 'show text "HELLO"', code: `display.scroll("HOLA")`, kind: 'display' },
      { id: 'clear', labelEs: 'limpiar pantalla', labelEn: 'clear screen', code: 'display.clear()', kind: 'display' },
      { id: 'wait', labelEs: 'esperar 1 segundo', labelEn: 'wait 1 second', code: 'sleep(1000)', kind: 'utility' },
    ],
  },
  {
    number: 3,
    titleEs: 'Botones A y B',
    titleEn: 'Buttons A and B',
    introEs: 'Los botones son entradas. El programa puede reaccionar cuando una persona presiona A o B.',
    introEn: 'Buttons are inputs. Your program can react when someone presses A or B.',
    missionEs: 'Haz que el botón A muestre un corazón.',
    missionEn: 'Make button A show a heart.',
    blocks: [
      { id: 'buttonA', labelEs: 'si botón A está presionado', labelEn: 'if button A is pressed', code: 'if button_a.is_pressed():\n    display.show(Image.HEART)', kind: 'event' },
      { id: 'buttonB', labelEs: 'si botón B está presionado', labelEn: 'if button B is pressed', code: 'if button_b.is_pressed():\n    display.show(Image.HAPPY)', kind: 'event' },
      { id: 'wait', labelEs: 'esperar 100 ms', labelEn: 'wait 100 ms', code: 'sleep(100)', kind: 'utility' },
    ],
  },
  {
    number: 4,
    titleEs: 'Pines y señales',
    titleEn: 'Pins and signals',
    introEs: 'P0, P1 y P2 pueden enviar o recibir señales. Eso permite encender LEDs externos, leer sensores y controlar actuadores.',
    introEn: 'P0, P1 and P2 can send or receive signals for LEDs, sensors and actuators.',
    missionEs: 'Cambia el estado digital del pin P1.',
    missionEn: 'Change the digital state of pin P1.',
    blocks: [
      { id: 'p1on', labelEs: 'P1 encendido', labelEn: 'P1 on', code: 'pin1.write_digital(1)', kind: 'pin' },
      { id: 'p1off', labelEs: 'P1 apagado', labelEn: 'P1 off', code: 'pin1.write_digital(0)', kind: 'pin' },
      { id: 'wait', labelEs: 'esperar 1 segundo', labelEn: 'wait 1 second', code: 'sleep(1000)', kind: 'utility' },
    ],
  },
  {
    number: 5,
    titleEs: 'Sensores',
    titleEn: 'Sensors',
    introEs: 'La micro:bit puede medir temperatura, luz y movimiento. Esos datos pueden convertirse en decisiones.',
    introEn: 'The micro:bit can measure temperature, light and movement, then use those values in decisions.',
    missionEs: 'Muestra la temperatura actual en la pantalla.',
    missionEn: 'Show the current temperature on the display.',
    blocks: [
      { id: 'temp', labelEs: 'mostrar temperatura', labelEn: 'show temperature', code: 'display.scroll(str(temperature()))', kind: 'sensor' },
      { id: 'light', labelEs: 'mostrar nivel de luz', labelEn: 'show light level', code: 'display.scroll(str(display.read_light_level()))', kind: 'sensor' },
      { id: 'accel', labelEs: 'leer aceleración X', labelEn: 'read X acceleration', code: 'display.scroll(str(accelerometer.get_x()))', kind: 'sensor' },
    ],
  },
  {
    number: 6,
    titleEs: 'Mueve un servo',
    titleEn: 'Move a servo',
    introEs: 'Un servomotor necesita alimentación adecuada y una señal de control. En esta lección generamos pulsos desde P1.',
    introEn: 'A servo needs proper power and a control signal. In this lesson we generate pulses from P1.',
    missionEs: 'Mueve el servo a una posición aproximada, espera y regresa.',
    missionEn: 'Move the servo to a position, wait, then return.',
    blocks: [
      { id: 'servo0', labelEs: 'servo P1 → 0°', labelEn: 'servo P1 → 0°', code: 'pin1.write_analog(26)', kind: 'servo' },
      { id: 'servo90', labelEs: 'servo P1 → 90°', labelEn: 'servo P1 → 90°', code: 'pin1.write_analog(75)', kind: 'servo' },
      { id: 'servo180', labelEs: 'servo P1 → 180°', labelEn: 'servo P1 → 180°', code: 'pin1.write_analog(128)', kind: 'servo' },
      { id: 'wait', labelEs: 'esperar 1 segundo', labelEn: 'wait 1 second', code: 'sleep(1000)', kind: 'utility' },
    ],
  },
]

const KIND_CLASS: Record<MakerBlock['kind'], string> = {
  display: 'border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-100',
  event: 'border-amber-400/30 bg-amber-400/10 text-amber-100',
  pin: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-100',
  sensor: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100',
  servo: 'border-violet-400/30 bg-violet-400/10 text-violet-100',
  utility: 'border-white/15 bg-white/[0.05] text-white/80',
}

function LedMatrix({ mode }: { mode: 'heart' | 'smile' | 'blank' }) {
  const patterns = {
    heart: [0,1,0,1,0, 1,1,1,1,1, 1,1,1,1,1, 0,1,1,1,0, 0,0,1,0,0],
    smile: [0,0,0,0,0, 0,1,0,1,0, 0,0,0,0,0, 1,0,0,0,1, 0,1,1,1,0],
    blank: Array(25).fill(0),
  }
  return (
    <div className="grid grid-cols-5 gap-2 w-fit mx-auto rounded-3xl bg-[#111827] border border-white/10 p-5 shadow-2xl">
      {patterns[mode].map((on, index) => (
        <div
          key={index}
          className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full border transition-all ${on ? 'bg-red-400 border-red-300 shadow-[0_0_18px_rgba(248,113,113,.65)]' : 'bg-red-950/40 border-red-900/50'}`}
        />
      ))}
    </div>
  )
}

export function MakerMicrobitLesson() {
  const { moduleNumber } = useParams<{ moduleNumber: string }>()
  const navigate = useNavigate()
  const { language } = useLanguage()
  const spanish = language === 'id'
  const module = MODULES.find(item => item.number === Number(moduleNumber)) ?? MODULES[1]
  const [program, setProgram] = useState<MakerBlock[]>([])
  const [ran, setRan] = useState(false)

  const code = useMemo(() => {
    const lines = program.length ? program.map(block => block.code).join('\n') : '# Arrastra o agrega bloques para generar código'
    return `from microbit import *\n\n${lines}\n`
  }, [program])

  const matrixMode = useMemo<'heart' | 'smile' | 'blank'>(() => {
    if (!ran) return 'blank'
    const lastVisual = [...program].reverse().find(block => block.id === 'heart' || block.id === 'smile' || block.id === 'clear')
    if (lastVisual?.id === 'heart') return 'heart'
    if (lastVisual?.id === 'smile') return 'smile'
    return 'blank'
  }, [program, ran])

  const addBlock = (block: MakerBlock) => {
    setProgram(current => [...current, block])
    setRan(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7 text-white">
      <button onClick={() => navigate('/app/blocks')} className="inline-flex items-center gap-2 text-white/55 hover:text-white mb-5 font-bold">
        <ArrowLeft size={18} /> {spanish ? 'Volver a Maker Lab' : 'Back to Maker Lab'}
      </button>

      <div className="rounded-3xl border border-cyan-400/20 bg-gradient-to-r from-cyan-950/40 to-violet-950/40 p-6 sm:p-8 mb-6">
        <div className="text-xs font-black tracking-[.16em] text-cyan-300 mb-2">MICRO:BIT · {spanish ? 'MÓDULO' : 'MODULE'} {module.number}</div>
        <h1 className="text-3xl sm:text-5xl font-black mb-3">{spanish ? module.titleEs : module.titleEn}</h1>
        <p className="text-white/60 max-w-3xl leading-relaxed mb-4">{spanish ? module.introEs : module.introEn}</p>
        <div className="inline-flex items-start gap-2 rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] px-4 py-3 text-amber-100/85">
          <Sparkles size={18} className="mt-0.5 shrink-0" />
          <span><strong>{spanish ? 'Misión:' : 'Mission:'}</strong> {spanish ? module.missionEs : module.missionEn}</span>
        </div>
      </div>

      <div className="grid xl:grid-cols-[280px_1fr_390px] gap-5 items-stretch">
        <section className="rounded-3xl border border-white/10 bg-[#120d27]/85 p-5">
          <div className="flex items-center gap-2 font-black mb-4"><Blocks size={19} className="text-cyan-300" /> {spanish ? 'Bloques' : 'Blocks'}</div>
          <div className="space-y-3">
            {module.blocks.map(block => (
              <button key={block.id} onClick={() => addBlock(block)} className={`w-full text-left rounded-xl border p-3 font-bold text-sm hover:scale-[1.02] active:scale-[.98] transition-transform ${KIND_CLASS[block.kind]}`}>
                {spanish ? block.labelEs : block.labelEn}
              </button>
            ))}
          </div>
          <p className="text-xs text-white/30 mt-5 leading-relaxed">
            {spanish ? 'Toca un bloque para agregarlo al programa. Después podrás arrastrarlos como en Scratch; esta primera versión ya genera MicroPython real.' : 'Tap a block to add it. Drag-and-drop comes next; this version already generates real MicroPython.'}
          </p>
        </section>

        <section className="rounded-3xl border border-white/10 bg-[#0c0918]/90 p-5 flex flex-col min-h-[520px]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="font-black">{spanish ? 'Tu programa' : 'Your program'}</div>
            <div className="flex gap-2">
              <button onClick={() => { setProgram([]); setRan(false) }} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-sm font-bold text-white/60 hover:text-white"><Trash2 size={15} /> {spanish ? 'Limpiar' : 'Clear'}</button>
              <button onClick={() => setRan(true)} disabled={!program.length} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 disabled:opacity-30 text-sm font-black text-slate-950"><Play size={15} fill="currentColor" /> {spanish ? 'Ejecutar' : 'Run'}</button>
            </div>
          </div>

          <div className="flex-1 rounded-2xl border border-dashed border-white/15 bg-white/[0.025] p-4 space-y-3">
            {!program.length ? (
              <div className="h-full min-h-[250px] flex flex-col items-center justify-center text-center text-white/30">
                <Blocks size={42} className="mb-3" />
                <p className="font-bold">{spanish ? 'Agrega bloques desde la izquierda' : 'Add blocks from the left'}</p>
              </div>
            ) : program.map((block, index) => (
              <div key={`${block.id}-${index}`} className={`rounded-xl border px-4 py-3 font-bold ${KIND_CLASS[block.kind]}`}>
                <span className="text-white/30 mr-2">{index + 1}.</span>{spanish ? block.labelEs : block.labelEn}
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <div className="rounded-3xl border border-white/10 bg-[#120d27]/85 p-5">
            <div className="flex items-center gap-2 font-black mb-4"><Code2 size={19} className="text-violet-300" /> MicroPython</div>
            <pre className="rounded-2xl bg-black/50 border border-white/10 p-4 text-xs sm:text-sm text-emerald-200 overflow-x-auto whitespace-pre-wrap min-h-[210px]"><code>{code}</code></pre>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#120d27]/85 p-5 text-center">
            <div className="flex items-center justify-between gap-3 mb-5 text-left">
              <div>
                <div className="font-black">{spanish ? 'Simulador' : 'Simulator'}</div>
                <div className="text-xs text-white/35">micro:bit 5×5 LED</div>
              </div>
              <button onClick={() => setRan(false)} className="p-2 rounded-xl border border-white/10 bg-white/5 text-white/50 hover:text-white" title={spanish ? 'Reiniciar simulador' : 'Reset simulator'}><RotateCcw size={17} /></button>
            </div>
            <LedMatrix mode={matrixMode} />
            <p className="text-xs text-white/35 mt-4">
              {ran ? (spanish ? 'Programa ejecutado en el simulador.' : 'Program executed in simulator.') : (spanish ? 'Presiona Ejecutar para ver el resultado.' : 'Press Run to preview the result.')}
            </p>
          </div>
        </section>
      </div>

      <div className="mt-6 flex justify-between gap-3">
        <button disabled={module.number <= 1} onClick={() => navigate(`/app/blocks/microbit/${module.number - 1}`)} className="px-5 py-3 rounded-xl border border-white/10 bg-white/5 font-bold disabled:opacity-25">← {spanish ? 'Anterior' : 'Previous'}</button>
        <button disabled={module.number >= 6} onClick={() => navigate(`/app/blocks/microbit/${module.number + 1}`)} className="px-5 py-3 rounded-xl bg-cyan-500 text-slate-950 font-black disabled:opacity-25">{spanish ? 'Siguiente módulo' : 'Next module'} →</button>
      </div>
    </div>
  )
}
