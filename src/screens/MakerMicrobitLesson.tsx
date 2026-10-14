import { useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Blocks,
  Check,
  Code2,
  Copy,
  Play,
  RotateCcw,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { useLanguage } from '../i18n/LanguageProvider'
import {
  MicrobitBlocklyWorkspace,
  type MicrobitBlocklyHandle,
  type MicrobitPreview,
} from '../components/MicrobitBlocklyWorkspace'
import { MicrobitBoard } from '../components/MicrobitBoard'

type CodeMode = 'python' | 'javascript'

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
    introEs: 'Conoce la placa, su matriz LED, botones, sensores y pines mientras construyes tu primer programa.',
    introEn: 'Meet the board, LED matrix, buttons, sensors and pins while building your first program.',
    missionEs: 'Muestra un mensaje de bienvenida en la matriz LED.',
    missionEn: 'Show a welcome message on the LED matrix.',
    tipEs: 'Abre Básico, arrastra “mostrar texto” y cambia el contenido.',
    tipEn: 'Open Basic, drag “show text”, and change its content.',
  },
  {
    number: 2,
    titleEs: 'Matriz LED',
    titleEn: 'LED matrix',
    introEs: 'Programa la matriz de 25 LEDs para mostrar iconos, texto y pequeñas secuencias.',
    introEn: 'Program the 25 LED matrix to show icons, text and small sequences.',
    missionEs: 'Crea: corazón → esperar 1000 ms → cara feliz.',
    missionEn: 'Create: heart → wait 1000 ms → smile.',
    tipEs: 'Encaja los bloques verticalmente. Ese orden será el orden del programa.',
    tipEn: 'Snap blocks vertically. That becomes the program order.',
  },
  {
    number: 3,
    titleEs: 'Botones A y B',
    titleEn: 'Buttons A and B',
    introEs: 'Convierte los botones físicos en eventos para que tu proyecto responda a una persona.',
    introEn: 'Turn the physical buttons into events so your project can respond to a person.',
    missionEs: 'Haz que al presionar A aparezca un corazón.',
    missionEn: 'Make a heart appear when A is pressed.',
    tipEs: 'Pon “mostrar corazón” dentro del bloque del botón A y después pulsa A en el simulador.',
    tipEn: 'Place “show heart” inside button A, then click A on the simulator.',
  },
  {
    number: 4,
    titleEs: 'Pines y señales',
    titleEn: 'Pins and signals',
    introEs: 'Usa P0, P1 y P2 para enviar señales y comenzar a controlar componentes externos.',
    introEn: 'Use P0, P1 and P2 to send signals and start controlling external components.',
    missionEs: 'Enciende P1, espera un segundo y apágalo.',
    missionEn: 'Turn P1 on, wait one second, then turn it off.',
    tipEs: 'Usa dos bloques de pin y deja un bloque de espera entre ambos.',
    tipEn: 'Use two pin blocks with a wait block between them.',
  },
  {
    number: 5,
    titleEs: 'Sensores',
    titleEn: 'Sensors',
    introEs: 'Usa temperatura, luz y movimiento para que tus programas entiendan lo que sucede alrededor.',
    introEn: 'Use temperature, light and movement so programs understand what is happening around them.',
    missionEs: 'Muestra la temperatura y después el nivel de luz.',
    missionEn: 'Show temperature and then light level.',
    tipEs: 'Conecta dos bloques de sensores. El código se actualiza automáticamente.',
    tipEn: 'Connect two sensor blocks. The code updates automatically.',
  },
  {
    number: 6,
    titleEs: 'Mueve un servo',
    titleEn: 'Move a servo',
    introEs: 'Controla un servomotor desde P1 y relaciona los bloques con el movimiento de hardware real.',
    introEn: 'Control a servo from P1 and connect visual blocks with real hardware movement.',
    missionEs: 'Lleva el servo a 0°, espera un segundo y después muévelo a 90°.',
    missionEn: 'Move the servo to 0°, wait one second, then move it to 90°.',
    tipEs: 'En hardware real, alimenta el servo aparte y comparte GND con la micro:bit.',
    tipEn: 'On real hardware, power the servo separately and share GND with the micro:bit.',
  },
]

function CodePanel({
  mode,
  setMode,
  pythonCode,
  javascriptCode,
  spanish,
}: {
  mode: CodeMode
  setMode: (mode: CodeMode) => void
  pythonCode: string
  javascriptCode: string
  spanish: boolean
}) {
  const [copied, setCopied] = useState(false)
  const activeCode = mode === 'python' ? pythonCode : javascriptCode

  const copy = async () => {
    await navigator.clipboard?.writeText(activeCode)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-[#d8e4f5] bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5edf8] px-4 py-3">
        <div className="flex items-center gap-2 font-black text-[#163567]">
          <Code2 size={18} className="text-[#2563eb]" />
          {spanish ? 'Código generado' : 'Generated code'}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-[#eef4ff] p-1">
            <button
              type="button"
              onClick={() => setMode('python')}
              className={`rounded-lg px-3 py-1.5 text-xs font-black transition ${mode === 'python' ? 'bg-white text-[#2563eb] shadow-sm' : 'text-[#6d7f9e]'}`}
            >
              Python
            </button>
            <button
              type="button"
              onClick={() => setMode('javascript')}
              className={`rounded-lg px-3 py-1.5 text-xs font-black transition ${mode === 'javascript' ? 'bg-white text-[#2563eb] shadow-sm' : 'text-[#6d7f9e]'}`}
            >
              JavaScript
            </button>
          </div>
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-2 rounded-xl border border-[#d8e4f5] bg-white px-3 py-2 text-xs font-bold text-[#35527d] hover:bg-[#f7faff]"
          >
            {copied ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
            {copied ? (spanish ? 'Copiado' : 'Copied') : (spanish ? 'Copiar' : 'Copy')}
          </button>
        </div>
      </div>
      <pre className="max-h-[260px] min-h-[190px] overflow-auto bg-[#fbfdff] p-4 text-[12px] leading-6 text-[#27436e]">
        <code>{activeCode}</code>
      </pre>
    </section>
  )
}

export function MakerMicrobitLesson() {
  const { moduleNumber } = useParams<{ moduleNumber: string }>()
  const navigate = useNavigate()
  const { language } = useLanguage()
  const spanish = language === 'id'
  const module = MODULES.find(item => item.number === Number(moduleNumber)) ?? MODULES[1]
  const workspaceRef = useRef<MicrobitBlocklyHandle>(null)

  const [pythonCode, setPythonCode] = useState('from microbit import *\n\n# Arrastra bloques al área de trabajo\n')
  const [javascriptCode, setJavascriptCode] = useState('// Arrastra bloques al área de trabajo\n')
  const [codeMode, setCodeMode] = useState<CodeMode>('python')
  const [blockCount, setBlockCount] = useState(0)
  const [preview, setPreview] = useState<MicrobitPreview>('blank')
  const [simulatedPreview, setSimulatedPreview] = useState<MicrobitPreview>('blank')
  const [ran, setRan] = useState(false)

  const projectStatus = useMemo(() => {
    if (!ran) return spanish ? 'Listo para probar' : 'Ready to test'
    return spanish ? 'Simulación activa' : 'Simulation running'
  }, [ran, spanish])

  const handleWorkspaceChange = (
    nextPython: string,
    nextJavascript: string,
    count: number,
    nextPreview: MicrobitPreview,
  ) => {
    setPythonCode(nextPython)
    setJavascriptCode(nextJavascript)
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
    <div className="min-h-screen bg-[#eef5ff] px-3 py-4 text-[#17305f] sm:px-5 lg:px-6">
      <div className="mx-auto max-w-[1780px]">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#d6e3f7] bg-white px-4 py-3 shadow-sm">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/app/blocks')}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#edf4ff] text-[#2b5fb8] hover:bg-[#e4eeff]"
              title={spanish ? 'Volver a Maker Lab' : 'Back to Maker Lab'}
            >
              <ArrowLeft size={19} />
            </button>
            <div className="min-w-0">
              <div className="truncate text-lg font-black text-[#12346b]">Mini Maker Labs</div>
              <div className="truncate text-xs font-bold text-[#7386a7]">
                Maker Lab · micro:bit · {spanish ? 'Módulo' : 'Module'} {module.number}: {spanish ? module.titleEs : module.titleEn}
              </div>
            </div>
          </div>

          <div className="hidden rounded-2xl bg-[#eef3ff] p-1 md:flex">
            <div className="inline-flex items-center gap-2 rounded-xl bg-[#5b46f6] px-5 py-2 text-sm font-black text-white shadow-sm">
              <Blocks size={17} /> {spanish ? 'Bloques' : 'Blocks'}
            </div>
            <button
              type="button"
              onClick={() => setCodeMode('python')}
              className="px-4 py-2 text-sm font-black text-[#254878]"
            >
              Python
            </button>
            <button
              type="button"
              onClick={() => setCodeMode('javascript')}
              className="px-4 py-2 text-sm font-black text-[#254878]"
            >
              JS
            </button>
          </div>

          <button
            type="button"
            onClick={run}
            disabled={!blockCount}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1475ee] px-5 py-2.5 text-sm font-black text-white shadow-[0_8px_20px_rgba(37,99,235,.18)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Play size={17} fill="currentColor" /> {spanish ? 'Probar' : 'Run'}
          </button>
        </div>

        <div className="grid gap-3 xl:grid-cols-[420px_minmax(0,1fr)]">
          <aside className="space-y-3">
            <section className="rounded-2xl border border-[#d8e4f5] bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="text-lg font-black text-[#163567]">{spanish ? 'Simulador' : 'Simulator'}</div>
                  <div className="text-xs font-bold text-[#8191ac]">micro:bit + hardware</div>
                </div>
                <span className={`rounded-full px-3 py-1 text-[11px] font-black ${ran ? 'bg-emerald-50 text-emerald-700' : 'bg-[#eef4ff] text-[#50709e]'}`}>
                  {projectStatus}
                </span>
              </div>

              <div className="rounded-2xl bg-[#f8fbff] p-2">
                <MicrobitBoard
                  preview={ran ? simulatedPreview : 'blank'}
                  code={pythonCode}
                  running={ran}
                  language={language}
                />
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={run}
                  disabled={!blockCount}
                  className="inline-flex flex-col items-center justify-center gap-1 rounded-xl bg-emerald-50 px-2 py-3 text-xs font-black text-emerald-700 disabled:opacity-40"
                >
                  <Play size={18} /> {spanish ? 'Iniciar' : 'Start'}
                </button>
                <button
                  type="button"
                  onClick={() => { setRan(false); setSimulatedPreview('blank') }}
                  className="inline-flex flex-col items-center justify-center gap-1 rounded-xl bg-[#f2f6fc] px-2 py-3 text-xs font-black text-[#506b91]"
                >
                  <RotateCcw size={18} /> {spanish ? 'Reiniciar' : 'Reset'}
                </button>
                <button
                  type="button"
                  onClick={clear}
                  className="inline-flex flex-col items-center justify-center gap-1 rounded-xl bg-rose-50 px-2 py-3 text-xs font-black text-rose-600"
                >
                  <Trash2 size={18} /> {spanish ? 'Limpiar' : 'Clear'}
                </button>
              </div>
            </section>

            <section className="rounded-2xl border border-[#d8e4f5] bg-white p-4 shadow-sm">
              <div className="mb-2 text-xs font-black uppercase tracking-[.14em] text-[#7f91ad]">
                {spanish ? 'Misión' : 'Mission'}
              </div>
              <div className="mb-3 flex items-start gap-2 text-sm font-bold leading-6 text-[#27466f]">
                <Sparkles size={17} className="mt-1 shrink-0 text-amber-500" />
                <span>{spanish ? module.missionEs : module.missionEn}</span>
              </div>
              <div className="rounded-xl bg-[#eef5ff] p-3 text-xs leading-5 text-[#557197]">
                <strong className="text-[#2f5fa1]">{spanish ? 'Pista:' : 'Tip:'}</strong>{' '}
                {spanish ? module.tipEs : module.tipEn}
              </div>
            </section>
          </aside>

          <main className="min-w-0 space-y-3">
            <section className="overflow-hidden rounded-2xl border border-[#d8e4f5] bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5edf8] px-4 py-3">
                <div>
                  <div className="flex items-center gap-2 font-black text-[#163567]">
                    <Blocks size={18} className="text-[#2563eb]" /> {spanish ? 'Programa' : 'Program'}
                  </div>
                  <div className="mt-0.5 text-xs font-bold text-[#8a9ab4]">
                    {blockCount} {spanish ? (blockCount === 1 ? 'bloque' : 'bloques') : (blockCount === 1 ? 'block' : 'blocks')}
                  </div>
                </div>
                <div className="max-w-[680px] text-right text-xs font-semibold text-[#8191ac]">
                  {spanish ? module.introEs : module.introEn}
                </div>
              </div>

              <MicrobitBlocklyWorkspace
                ref={workspaceRef}
                moduleNumber={module.number}
                language={language}
                onChange={handleWorkspaceChange}
              />
            </section>

            <CodePanel
              mode={codeMode}
              setMode={setCodeMode}
              pythonCode={pythonCode}
              javascriptCode={javascriptCode}
              spanish={spanish}
            />
          </main>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-[#d8e4f5] bg-white px-4 py-3 shadow-sm">
          <button
            type="button"
            disabled={module.number <= 1}
            onClick={() => navigate(`/app/blocks/microbit/${module.number - 1}`)}
            className="rounded-xl border border-[#d8e4f5] px-4 py-2 text-sm font-black text-[#48678f] disabled:opacity-30"
          >
            ← {spanish ? 'Anterior' : 'Previous'}
          </button>
          <div className="hidden text-xs font-bold text-[#91a0b8] sm:block">
            {spanish ? 'Bloques visuales → código → hardware' : 'Visual blocks → code → hardware'}
          </div>
          <button
            type="button"
            disabled={module.number >= 6}
            onClick={() => navigate(`/app/blocks/microbit/${module.number + 1}`)}
            className="rounded-xl bg-[#2563eb] px-4 py-2 text-sm font-black text-white disabled:opacity-30"
          >
            {spanish ? 'Siguiente módulo' : 'Next module'} →
          </button>
        </div>
      </div>
    </div>
  )
}