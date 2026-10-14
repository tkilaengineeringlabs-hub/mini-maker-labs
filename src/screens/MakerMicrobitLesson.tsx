import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Blocks, Code2, Play, RotateCcw, Sparkles, Trash2 } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageProvider'
import {
  MicrobitBlocklyWorkspace,
  type MicrobitBlocklyHandle,
  type MicrobitPreview,
} from '../components/MicrobitBlocklyWorkspace'

type Module = {
  number: number
  titleEs: string
  titleEn: string
  introEs: string
  introEn: string
  missionEs: string
  missionEn: string
  tipEs: string
  tipEn: string
}

const MODULES: Module[] = [
  {
    number: 1,
    titleEs: 'Conoce tu micro:bit',
    titleEn: 'Meet your micro:bit',
    introEs: 'La micro:bit es una pequeña computadora con 25 LEDs, botones, sensores y pines para conectar componentes.',
    introEn: 'The micro:bit is a tiny computer with 25 LEDs, buttons, sensors and pins for external components.',
    missionEs: 'Arrastra un bloque para mostrar un mensaje de bienvenida y ejecútalo.',
    missionEn: 'Drag a block that shows a welcome message and run it.',
    tipEs: 'Abre la categoría Pantalla, arrastra “mostrar texto” y cambia el texto por lo que quieras.',
    tipEn: 'Open Display, drag “show text”, then change the text to anything you like.',
  },
  {
    number: 2,
    titleEs: 'Matriz LED',
    titleEn: 'LED matrix',
    introEs: 'La pantalla tiene una matriz de 5 × 5 LEDs. Puedes mostrar iconos, texto y secuencias sin conectar nada extra.',
    introEn: 'The display has a 5 × 5 LED matrix. You can show icons, text and sequences without extra hardware.',
    missionEs: 'Crea una secuencia: corazón → esperar 1000 ms → cara feliz.',
    missionEn: 'Create a sequence: heart → wait 1000 ms → smile.',
    tipEs: 'Encaja los bloques uno debajo de otro. El orden de arriba hacia abajo será el orden del programa.',
    tipEn: 'Snap blocks together vertically. Top-to-bottom order becomes program order.',
  },
  {
    number: 3,
    titleEs: 'Botones A y B',
    titleEn: 'Buttons A and B',
    introEs: 'Los botones son entradas. Ahora tu programa puede reaccionar a lo que hace una persona.',
    introEn: 'Buttons are inputs. Your program can now react to what a person does.',
    missionEs: 'Haz que al presionar A se muestre un corazón.',
    missionEn: 'Make button A show a heart.',
    tipEs: 'Arrastra “si botón A está presionado” y mete dentro el bloque “mostrar corazón”.',
    tipEn: 'Drag “if button A is pressed” and place “show heart” inside it.',
  },
  {
    number: 4,
    titleEs: 'Pines y señales',
    titleEn: 'Pins and signals',
    introEs: 'P0, P1 y P2 pueden enviar o recibir señales. Así puedes controlar LEDs externos, sensores y actuadores.',
    introEn: 'P0, P1 and P2 can send or receive signals for external LEDs, sensors and actuators.',
    missionEs: 'Enciende P1, espera un segundo y apágalo.',
    missionEn: 'Turn P1 on, wait one second, then turn it off.',
    tipEs: 'Usa dos bloques “poner pin P1” con un bloque de espera entre ellos.',
    tipEn: 'Use two “set pin P1” blocks with a wait block between them.',
  },
  {
    number: 5,
    titleEs: 'Sensores',
    titleEn: 'Sensors',
    introEs: 'La micro:bit puede medir temperatura, luz y movimiento. Esos datos permiten que tus proyectos reaccionen al mundo real.',
    introEn: 'The micro:bit can measure temperature, light and movement, allowing projects to react to the real world.',
    missionEs: 'Muestra la temperatura y después el nivel de luz.',
    missionEn: 'Show temperature and then light level.',
    tipEs: 'Abre Sensores y conecta dos bloques. El MicroPython se genera automáticamente.',
    tipEn: 'Open Sensors and connect two blocks. MicroPython is generated automatically.',
  },
  {
    number: 6,
    titleEs: 'Mueve un servo',
    titleEn: 'Move a servo',
    introEs: 'Un servomotor necesita alimentación adecuada y una señal de control. Aquí generamos esa señal desde P1.',
    introEn: 'A servo needs proper power and a control signal. Here we generate that signal from P1.',
    missionEs: 'Mueve el servo a 0°, espera un segundo y llévalo a 90°.',
    missionEn: 'Move the servo to 0°, wait one second, then move it to 90°.',
    tipEs: 'La señal sale por P1. Para hardware real, alimenta el servo aparte y comparte GND con la micro:bit.',
    tipEn: 'The signal comes from P1. For real hardware, power the servo separately and share GND with the micro:bit.',
  },
]

function LedMatrix({ mode }: { mode: MicrobitPreview }) {
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
  const workspaceRef = useRef<MicrobitBlocklyHandle>(null)

  const [code, setCode] = useState('from microbit import *\n\n# Arrastra bloques al área de trabajo\n')
  const [blockCount, setBlockCount] = useState(0)
  const [preview, setPreview] = useState<MicrobitPreview>('blank')
  const [simulatedPreview, setSimulatedPreview] = useState<MicrobitPreview>('blank')
  const [ran, setRan] = useState(false)

  const handleWorkspaceChange = (nextCode: string, count: number, nextPreview: MicrobitPreview) => {
    setCode(nextCode)
    setBlockCount(count)
    setPreview(nextPreview)
    setRan(false)
  }

  const clear = () => {
    workspaceRef.current?.clear()
    setRan(false)
    setSimulatedPreview('blank')
  }

  const run = () => {
    setSimulatedPreview(preview)
    setRan(true)
  }

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 py-7 text-white">
      <button
        onClick={() => navigate('/app/blocks')}
        className="inline-flex items-center gap-2 text-white/55 hover:text-white mb-5 font-bold"
      >
        <ArrowLeft size={18} /> {spanish ? 'Volver a Maker Lab' : 'Back to Maker Lab'}
      </button>

      <div className="rounded-3xl border border-cyan-400/20 bg-gradient-to-r from-cyan-950/40 to-violet-950/40 p-6 sm:p-8 mb-6">
        <div className="text-xs font-black tracking-[.16em] text-cyan-300 mb-2">
          MICRO:BIT · {spanish ? 'MÓDULO' : 'MODULE'} {module.number}
        </div>
        <h1 className="text-3xl sm:text-5xl font-black mb-3">{spanish ? module.titleEs : module.titleEn}</h1>
        <p className="text-white/60 max-w-3xl leading-relaxed mb-4">{spanish ? module.introEs : module.introEn}</p>
        <div className="inline-flex items-start gap-2 rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] px-4 py-3 text-amber-100/85">
          <Sparkles size={18} className="mt-0.5 shrink-0" />
          <span><strong>{spanish ? 'Misión:' : 'Mission:'}</strong> {spanish ? module.missionEs : module.missionEn}</span>
        </div>
      </div>

      <div className="grid xl:grid-cols-[minmax(0,1fr)_420px] gap-5 items-start">
        <section className="rounded-3xl border border-white/10 bg-[#0c0918]/90 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-white/10 bg-[#120d27]/85">
            <div>
              <div className="flex items-center gap-2 font-black">
                <Blocks size={19} className="text-cyan-300" />
                {spanish ? 'Editor de bloques' : 'Block editor'}
              </div>
              <div className="text-xs text-white/35 mt-1">
                {blockCount} {spanish ? (blockCount === 1 ? 'bloque' : 'bloques') : (blockCount === 1 ? 'block' : 'blocks')}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={clear}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-sm font-bold text-white/60 hover:text-white"
              >
                <Trash2 size={15} /> {spanish ? 'Limpiar' : 'Clear'}
              </button>
              <button
                onClick={run}
                disabled={!blockCount}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 disabled:opacity-30 text-sm font-black text-slate-950"
              >
                <Play size={15} fill="currentColor" /> {spanish ? 'Ejecutar' : 'Run'}
              </button>
            </div>
          </div>

          <MicrobitBlocklyWorkspace
            ref={workspaceRef}
            moduleNumber={module.number}
            language={language}
            onChange={handleWorkspaceChange}
          />

          <div className="px-5 py-4 border-t border-white/10 bg-cyan-400/[0.035] text-sm text-white/55">
            <strong className="text-cyan-200">{spanish ? 'Pista:' : 'Tip:'}</strong>{' '}
            {spanish ? module.tipEs : module.tipEn}
          </div>
        </section>

        <section className="space-y-5 xl:sticky xl:top-24">
          <div className="rounded-3xl border border-white/10 bg-[#120d27]/85 p-5">
            <div className="flex items-center gap-2 font-black mb-4">
              <Code2 size={19} className="text-violet-300" /> MicroPython
            </div>
            <pre className="rounded-2xl bg-black/50 border border-white/10 p-4 text-xs sm:text-sm text-emerald-200 overflow-x-auto whitespace-pre-wrap min-h-[250px] max-h-[360px] overflow-y-auto">
              <code>{code}</code>
            </pre>
            <p className="text-xs text-white/30 mt-3">
              {spanish
                ? 'El código cambia en tiempo real mientras mueves, conectas o editas bloques.'
                : 'The code updates live while you move, connect or edit blocks.'}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#120d27]/85 p-5 text-center">
            <div className="flex items-center justify-between gap-3 mb-5 text-left">
              <div>
                <div className="font-black">{spanish ? 'Simulador' : 'Simulator'}</div>
                <div className="text-xs text-white/35">micro:bit 5×5 LED</div>
              </div>
              <button
                onClick={() => { setRan(false); setSimulatedPreview('blank') }}
                className="p-2 rounded-xl border border-white/10 bg-white/5 text-white/50 hover:text-white"
                title={spanish ? 'Reiniciar simulador' : 'Reset simulator'}
              >
                <RotateCcw size={17} />
              </button>
            </div>
            <LedMatrix mode={ran ? simulatedPreview : 'blank'} />
            <p className="text-xs text-white/35 mt-4">
              {ran
                ? (spanish ? 'Programa ejecutado en el simulador.' : 'Program executed in simulator.')
                : (spanish ? 'Presiona Ejecutar para ver el resultado.' : 'Press Run to preview the result.')}
            </p>
          </div>
        </section>
      </div>

      <div className="mt-6 flex justify-between gap-3">
        <button
          disabled={module.number <= 1}
          onClick={() => navigate(`/app/blocks/microbit/${module.number - 1}`)}
          className="px-5 py-3 rounded-xl border border-white/10 bg-white/5 font-bold disabled:opacity-25"
        >
          ← {spanish ? 'Anterior' : 'Previous'}
        </button>
        <button
          disabled={module.number >= 6}
          onClick={() => navigate(`/app/blocks/microbit/${module.number + 1}`)}
          className="px-5 py-3 rounded-xl bg-cyan-500 text-slate-950 font-black disabled:opacity-25"
        >
          {spanish ? 'Siguiente módulo' : 'Next module'} →
        </button>
      </div>
    </div>
  )
}
