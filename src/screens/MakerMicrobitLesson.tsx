import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Blocks,
  Camera,
  Check,
  Code2,
  Copy,
  Folder,
  HelpCircle,
  Home,
  Info,
  Maximize2,
  Play,
  RotateCcw,
  Search,
  Settings,
  Sparkles,
  Trash2,
  Volume2,
} from 'lucide-react'
import { useLanguage } from '../i18n/LanguageProvider'
import {
  MicrobitBlocklyWorkspace,
  type MicrobitBlocklyHandle,
} from '../components/MicrobitBlocklyWorkspace'
import { MicrobitBoard, initialMicrobitState } from '../components/MicrobitBoard'
import logo from '../assets/landing/mini-maker-labs-logo.png'
import styles from './MakerMicrobitLesson.module.css'

const titleFont = {
  fontFamily: "'MiniMakerIdePixel', monospace",
  fontWeight: 400,
  lineHeight: 1.4,
  overflowWrap: 'anywhere' as const,
}

type EditorMode = 'blocks' | 'python' | 'javascript'
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

function CodeEditor({ value, onChange, language }: { value: string; onChange: (value: string) => void; language: CodeMode }) {
  return (
    <div className="relative h-full min-h-[220px] overflow-hidden bg-white">
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-11 border-r border-[#CDEEF2] bg-[#ECFAFC]" />
      <textarea
        value={value}
        onChange={event => onChange(event.target.value)}
        spellCheck={false}
        aria-label={language === 'python' ? 'Editor Python' : 'Editor JavaScript'}
        className="relative z-10 h-full min-h-[220px] w-full resize-none bg-transparent py-3 pl-14 pr-4 font-mono text-[13px] leading-6 text-[#173644] outline-none"
      />
    </div>
  )
}

export function MakerMicrobitLesson() {
  const { moduleNumber } = useParams<{ moduleNumber: string }>()
  const navigate = useNavigate()
  const { language, t } = useLanguage()
  const spanish = language === 'id'
  const module = MODULES.find(item => item.number === Number(moduleNumber)) ?? MODULES[0]
  const workspaceRef = useRef<MicrobitBlocklyHandle>(null)

  const [pythonCode, setPythonCode] = useState('from microbit import *\n\n# Escribe código o usa bloques\n')
  const [javascriptCode, setJavascriptCode] = useState('// Escribe código o usa bloques\n')
  const [editorMode, setEditorMode] = useState<EditorMode>('blocks')
  const [codeMode, setCodeMode] = useState<CodeMode>('python')
  const [blockCount, setBlockCount] = useState(0)
  const [restartKey, setRestartKey] = useState(0)
  const [simulation, setSimulation] = useState(initialMicrobitState)
  const [copied, setCopied] = useState(false)

  const activeCode = codeMode === 'python' ? pythonCode : javascriptCode
  const simulatorCode = editorMode === 'javascript' ? javascriptCode : pythonCode

  const status = spanish ? 'Ejecutando' : 'Running'

  const handleWorkspaceChange = (
    nextPython: string,
    nextJavascript: string,
    count: number,
  ) => {
    setPythonCode(nextPython)
    setJavascriptCode(nextJavascript)
    setBlockCount(count)
  }

  const clear = () => {
    if (editorMode === 'blocks') {
      workspaceRef.current?.clear()
    } else if (editorMode === 'python') {
      setPythonCode('from microbit import *\n\n')
    } else {
      setJavascriptCode('')
    }
    setRestartKey(key => key + 1)
  }

  const run = () => setRestartKey(key => key + 1)

  const copyCode = async () => {
    await navigator.clipboard?.writeText(activeCode)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  const switchMode = (mode: EditorMode) => {
    if (editorMode !== mode) setRestartKey(key => key + 1)
    setEditorMode(mode)
    if (mode === 'python') setCodeMode('python')
    if (mode === 'javascript') setCodeMode('javascript')
    window.setTimeout(() => workspaceRef.current?.resize(), 30)
  }

  const canRun = editorMode === 'blocks' ? blockCount > 0 : simulatorCode.trim().length > 0

  return (
    <div className={`${styles.ide} min-h-screen bg-[#F7FCFD] text-[#173644]`}>
      <header className="sticky top-0 z-50 border-b border-[#CDEEF2] bg-white/95 px-4 py-3 shadow-[0_4px_20px_rgba(8,125,139,.05)] backdrop-blur md:px-6">
        <div className="mx-auto flex max-w-[1880px] flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <img src={logo} width={704} height={303} alt={t('hub.brand')} className="h-auto w-28 shrink-0 sm:w-36" />
            <div className="min-w-0 text-xs text-[#526873]">
              {t('path.blocks.name').split(' ').slice(0, -1).join(' ')}{' '}
              <span className={styles.signature}>{t('path.blocks.name').split(' ').slice(-1).join(' ')}</span>
              <div style={titleFont}>micro:bit</div>
            </div>
          </div>

          <div className="order-last flex w-full flex-wrap gap-1 rounded-2xl bg-[#ECFAFC] p-1.5 md:order-none md:w-auto">
            <button
              type="button"
              onClick={() => switchMode('blocks')}
              className={`inline-flex items-center gap-2 rounded-2xl px-6 py-2.5 text-sm font-black transition ${editorMode === 'blocks' ? 'bg-[#087D8B] text-white shadow-[0_8px_18px_rgba(8,125,139,.05)]' : 'text-[#173644]'}`}
            >
              <Blocks size={18} /> {spanish ? 'Bloques' : 'Blocks'}
            </button>
            <button
              type="button"
              onClick={() => switchMode('python')}
              className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-black transition ${editorMode === 'python' ? 'bg-white text-[#173644] shadow-sm' : 'text-[#173644]'}`}
            >
              <Code2 size={18} /> Python
            </button>
            <button
              type="button"
              onClick={() => switchMode('javascript')}
              className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-black transition ${editorMode === 'javascript' ? 'bg-white text-[#173644] shadow-sm' : 'text-[#173644]'}`}
            >
              JS
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button className="hidden h-10 w-10 place-items-center rounded-full bg-[#ECFAFC] text-[#526873] lg:grid" type="button"><Home size={19} /></button>
            <button className="hidden h-10 w-10 place-items-center rounded-full bg-[#ECFAFC] text-[#526873] lg:grid" type="button"><Folder size={19} /></button>
            <button className="hidden h-10 w-10 place-items-center rounded-full bg-[#ECFAFC] text-[#526873] lg:grid" type="button"><HelpCircle size={19} /></button>
            <button className="hidden h-10 w-10 place-items-center rounded-full bg-[#ECFAFC] text-[#526873] lg:grid" type="button"><Settings size={19} /></button>
            <button
              type="button"
              onClick={run}
              disabled={!canRun}
              className="inline-flex items-center gap-2 rounded-xl bg-[#087D8B] px-5 py-3 text-sm font-black text-white shadow-[0_8px_18px_rgba(8,125,139,.05)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Play size={17} fill="currentColor" /> {spanish ? 'Probar' : 'Run'}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1880px] p-3 md:p-4">
        <div className="grid gap-3 xl:grid-cols-[430px_minmax(0,1fr)]">
          <aside className="space-y-3">
            <section className="rounded-[22px] border border-[#CDEEF2] bg-white p-4 shadow-[0_6px_20px_rgba(8,125,139,.05)]">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div style={titleFont} className="text-lg font-black text-[#173644]">{spanish ? 'Simulador' : 'Simulator'}</div>
                  <div className="text-xs font-bold text-[#526873]">micro:bit + hardware</div>
                </div>
                <span className="rounded-full bg-[#ECFAFC] px-3 py-1 text-[11px] font-black text-[#526873]">{status}</span>
              </div>

              <MicrobitBoard
                moduleNumber={module.number}
                code={simulatorCode}
                codeLanguage={editorMode === 'javascript' ? 'javascript' : 'python'}
                restartKey={restartKey}
                onStateChange={setSimulation}
                language={language}
              />

              <div className="mt-1 grid grid-cols-3 gap-2 sm:grid-cols-5">
                <button type="button" onClick={run} disabled={!canRun} className="flex flex-col items-center gap-1 rounded-xl bg-[#ECFAFC] px-2 py-2.5 text-[11px] font-bold text-[#087D8B] disabled:opacity-40"><Play size={18} />{spanish ? 'Iniciar' : 'Start'}</button>
                <button type="button" onClick={run} className="flex flex-col items-center gap-1 rounded-xl bg-[#ECFAFC] px-2 py-2.5 text-[11px] font-bold text-[#526873]"><RotateCcw size={18} />{spanish ? 'Reiniciar' : 'Reset'}</button>
                <button type="button" className="flex flex-col items-center gap-1 rounded-xl bg-[#ECFAFC] px-2 py-2.5 text-[11px] font-bold text-[#526873]"><Volume2 size={18} />{spanish ? 'Sonido' : 'Sound'}</button>
                <button type="button" className="flex flex-col items-center gap-1 rounded-xl bg-[#ECFAFC] px-2 py-2.5 text-[11px] font-bold text-[#526873]"><Camera size={18} />{spanish ? 'Captura' : 'Capture'}</button>
                <button type="button" className="flex flex-col items-center gap-1 rounded-xl bg-[#ECFAFC] px-2 py-2.5 text-[11px] font-bold text-[#526873]"><Maximize2 size={18} />{spanish ? 'Pantalla' : 'Full'}</button>
              </div>

              <div className="mt-3 rounded-xl border border-[#CDEEF2] bg-[#F7FCFD] p-3">
                <div style={titleFont} className="mb-2 text-xs font-black text-[#173644]">{spanish ? 'Estado de pines' : 'Pin status'}</div>
                <div className="grid grid-cols-2 gap-2 text-center sm:grid-cols-4 xl:grid-cols-2">
                  {[
                    ['P0', spanish ? 'Libre' : 'Free'],
                    ['P1', module.number === 6 ? 'Servo' : (spanish ? 'Libre' : 'Free')],
                    ['Botón A', spanish ? 'Sin presionar' : 'Released'],
                    ['Botón B', spanish ? 'Sin presionar' : 'Released'],
                  ].map(([name, value], index) => (
                    <div key={name} className="rounded-lg border border-[#CDEEF2] bg-white px-2 py-2">
                      <div className="flex items-center justify-center gap-1.5 text-[11px] font-black text-[#173644]"><span className={`h-2 w-2 rounded-full ${index < 2 && simulation.pins[index] ? 'bg-[#087D8B]' : 'bg-[#B8CDD1]'}`} />{name}</div>
                      <div className="mt-0.5 text-[10px] text-[#526873]">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 rounded-xl border border-[#CDEEF2] bg-[#ECFAFC] p-3">
                <div className="mb-1 flex items-center gap-2 text-sm font-black text-[#173644]"><Info size={17} className="text-[#087D8B]" />{spanish ? '¿Qué hace este proyecto?' : 'What does this project do?'}</div>
                <p className="text-xs leading-5 text-[#526873]">{spanish ? module.introEs : module.introEn}</p>
              </div>
            </section>

            <section className="rounded-[22px] border border-[#CDEEF2] bg-white p-4 shadow-[0_6px_20px_rgba(8,125,139,.05)]">
              <div style={titleFont} className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-[.14em] text-[#526873]"><Sparkles size={15} className="text-[#087D8B]" />{spanish ? 'Misión' : 'Mission'}</div>
              <div className="text-sm font-bold leading-6 text-[#526873]">{spanish ? module.missionEs : module.missionEn}</div>
              <div className="mt-3 rounded-xl bg-[#ECFAFC] p-3 text-xs leading-5 text-[#526873]"><strong className="text-[#526873]">{spanish ? 'Pista:' : 'Tip:'}</strong> {spanish ? module.tipEs : module.tipEn}</div>
            </section>
          </aside>

          <section className="min-w-0 space-y-3">
            <div className="overflow-hidden rounded-[22px] border border-[#CDEEF2] bg-white shadow-[0_6px_20px_rgba(8,125,139,.05)]">
              <div className="grid grid-cols-1 sm:grid-cols-[180px_minmax(0,1fr)] lg:grid-cols-[245px_minmax(0,1fr)] border-b border-[#CDEEF2] bg-white">
                <div className="border-r border-[#CDEEF2] p-3">
                  <div style={titleFont} className="mb-2 flex items-center gap-2 text-base font-black text-[#173644]"><Blocks size={18} className="text-[#087D8B]" />{spanish ? 'Bloques' : 'Blocks'}</div>
                  <div className="flex items-center gap-2 rounded-xl border border-[#CDEEF2] bg-white px-3 py-2 text-[#526873]"><Search size={16} /><span className="text-xs font-medium">{spanish ? 'Buscar bloques...' : 'Search blocks...'}</span></div>
                </div>
                <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 px-4 py-3">
                  <div>
                    <div style={titleFont} className="flex items-center gap-2 text-base font-black text-[#173644]"><Blocks size={18} className="text-[#087D8B]" />{spanish ? 'Programa' : 'Program'}</div>
                    <div className="text-[11px] font-bold text-[#526873]">{blockCount} {spanish ? (blockCount === 1 ? 'bloque' : 'bloques') : (blockCount === 1 ? 'block' : 'blocks')}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => workspaceRef.current?.clear()} className="grid h-9 w-9 place-items-center rounded-lg bg-[#ECFAFC] text-[#526873]" title={spanish ? 'Limpiar bloques' : 'Clear blocks'}><Trash2 size={17} /></button>
                    <button type="button" className="grid h-9 w-9 place-items-center rounded-lg bg-[#ECFAFC] text-[#526873]"><Maximize2 size={17} /></button>
                  </div>
                </div>
              </div>

              <div className="h-[590px] bg-[#F7FCFD]">
                {editorMode === 'blocks' ? (
                  <MicrobitBlocklyWorkspace
                    ref={workspaceRef}
                    moduleNumber={module.number}
                    language={language}
                    onChange={handleWorkspaceChange}
                  />
                ) : (
                  <div className="h-full">
                    <div className="flex h-11 items-center border-b border-[#CDEEF2] bg-[#F7FCFD] px-4 text-xs font-black text-[#526873]">{editorMode === 'python' ? 'Python' : 'JavaScript'} · {spanish ? 'modo edición manual' : 'manual editing mode'}</div>
                    <CodeEditor
                      value={editorMode === 'python' ? pythonCode : javascriptCode}
                      onChange={editorMode === 'python' ? setPythonCode : setJavascriptCode}
                      language={editorMode === 'python' ? 'python' : 'javascript'}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="overflow-hidden rounded-[22px] border border-[#CDEEF2] bg-white shadow-[0_6px_20px_rgba(8,125,139,.05)]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#CDEEF2] px-4 py-3">
                <div style={titleFont} className="flex items-center gap-2 text-base font-black text-[#173644]"><Code2 size={18} className="text-[#087D8B]" />{codeMode === 'python' ? 'MicroPython' : 'JavaScript'}</div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex rounded-xl bg-[#ECFAFC] p-1">
                    <button type="button" onClick={() => setCodeMode('python')} className={`rounded-lg px-3 py-1.5 text-xs font-black ${codeMode === 'python' ? 'bg-white text-[#087D8B] shadow-sm' : 'text-[#526873]'}`}>Python</button>
                    <button type="button" onClick={() => setCodeMode('javascript')} className={`rounded-lg px-3 py-1.5 text-xs font-black ${codeMode === 'javascript' ? 'bg-white text-[#087D8B] shadow-sm' : 'text-[#526873]'}`}>JavaScript</button>
                  </div>
                  <button type="button" onClick={copyCode} className="inline-flex items-center gap-2 rounded-xl border border-[#CDEEF2] px-3 py-2 text-xs font-bold text-[#526873]">{copied ? <Check size={15} className="text-[#087D8B]" /> : <Copy size={15} />}{copied ? (spanish ? 'Copiado' : 'Copied') : (spanish ? 'Copiar código' : 'Copy code')}</button>
                </div>
              </div>
              <CodeEditor
                value={activeCode}
                onChange={codeMode === 'python' ? setPythonCode : setJavascriptCode}
                language={codeMode}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 py-1">
              <button type="button" onClick={() => navigate('/app/blocks')} className="inline-flex items-center gap-2 rounded-xl border border-[#CDEEF2] bg-white px-4 py-2.5 text-sm font-black text-[#526873]"><ArrowLeft size={16} />{spanish ? 'Maker Lab' : 'Maker Lab'}</button>
              <div className="flex gap-2">
                <button type="button" disabled={module.number <= 1} onClick={() => navigate(`/app/blocks/microbit/${module.number - 1}`)} className="rounded-xl border border-[#CDEEF2] bg-white px-4 py-2.5 text-sm font-black text-[#526873] disabled:opacity-35">← {spanish ? 'Anterior' : 'Previous'}</button>
                <button type="button" disabled={module.number >= 6} onClick={() => navigate(`/app/blocks/microbit/${module.number + 1}`)} className="rounded-xl bg-[#087D8B] px-4 py-2.5 text-sm font-black text-white disabled:opacity-35">{spanish ? 'Siguiente' : 'Next'} →</button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
