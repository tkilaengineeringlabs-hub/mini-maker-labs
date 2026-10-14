import { useState } from 'react'
import { motion } from 'framer-motion'
import { Cpu, Lightbulb, ToggleLeft, Cable, Gauge, RotateCcw, ChevronRight, FlaskConical, Play } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageProvider'

const MODULES = [
  { number: 1, icon: Cpu, titleEs: 'Conoce tu micro:bit', titleEn: 'Meet your micro:bit', descEs: 'Descubre qué es la micro:bit, sus botones, matriz LED, pines, sensores y cómo se alimenta.', descEn: 'Discover the micro:bit, its buttons, LED matrix, pins, sensors and power options.', goalEs: 'Identificar las partes principales de la placa.', goalEn: 'Identify the main parts of the board.' },
  { number: 2, icon: Lightbulb, titleEs: 'Matriz LED', titleEn: 'LED matrix', descEs: 'Aprende a mostrar iconos, letras y patrones en la pantalla de 5×5 LEDs.', descEn: 'Learn to display icons, letters and patterns on the 5×5 LED matrix.', goalEs: 'Crear tu primer mensaje visual.', goalEn: 'Create your first visual message.' },
  { number: 3, icon: ToggleLeft, titleEs: 'Botones A y B', titleEn: 'Buttons A and B', descEs: 'Haz que tu programa reaccione cuando presionas A, B o ambos botones.', descEn: 'Make your program react when A, B or both buttons are pressed.', goalEs: 'Entender eventos y entradas.', goalEn: 'Understand events and inputs.' },
  { number: 4, icon: Cable, titleEs: 'Pines y señales', titleEn: 'Pins and signals', descEs: 'Conoce P0, P1 y P2 y aprende la diferencia entre una entrada y una salida.', descEn: 'Meet P0, P1 and P2 and learn the difference between an input and an output.', goalEs: 'Controlar una salida desde un pin.', goalEn: 'Control an output from a pin.' },
  { number: 5, icon: Gauge, titleEs: 'Sensores', titleEn: 'Sensors', descEs: 'Experimenta con luz, temperatura, acelerómetro y movimiento.', descEn: 'Experiment with light, temperature, accelerometer and movement.', goalEs: 'Usar datos del mundo real en un programa.', goalEn: 'Use real-world data in a program.' },
  { number: 6, icon: RotateCcw, titleEs: 'Mueve un servo', titleEn: 'Move a servo', descEs: 'Conecta un servomotor correctamente y controla su posición desde la micro:bit.', descEn: 'Connect a servo correctly and control its position from the micro:bit.', goalEs: 'Construir tu primer mecanismo controlado.', goalEn: 'Build your first controlled mechanism.' },
]

export function MakerLabHome() {
  const { language } = useLanguage()
  const navigate = useNavigate()
  const [selected, setSelected] = useState(2)
  const spanish = language === 'id'
  const lesson = MODULES.find(m => m.number === selected) ?? MODULES[0]
  const LessonIcon = lesson.icon

  return (
    <div className="min-h-[calc(100vh-70px)] bg-[#f6faff] text-[#17345f]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <section className="mb-8 rounded-[28px] border border-[#d8e5f7] bg-white p-7 shadow-[0_12px_34px_rgba(21,61,115,.06)] sm:p-9">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#eef5ff] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[.14em] text-[#315784]">
            <FlaskConical size={14} /> Maker Lab
          </div>
          <h1 className="font-fun max-w-3xl text-4xl font-semibold leading-tight text-[#102a4f] sm:text-6xl">
            {spanish ? 'Construye. Programa. Hazlo real.' : 'Build. Code. Make it real.'}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#7185a3] sm:text-lg">
            {spanish
              ? 'Empieza con micro:bit y aprende creando proyectos que después podrás llevar al mundo real.'
              : 'Start with micro:bit and learn by building projects you can later take into the real world.'}
          </p>
        </section>

        <div className="grid items-start gap-6 lg:grid-cols-[1.05fr_.95fr]">
          <section>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="mb-1 text-[11px] font-extrabold uppercase tracking-[.14em] text-[#6f84a5]">{spanish ? 'Ruta 01' : 'Path 01'}</p>
                <h2 className="font-fun text-3xl font-semibold text-[#102a4f]">micro:bit</h2>
                <p className="mt-1 text-sm text-[#8192ab]">{spanish ? '6 módulos · De cero a tu primer mecanismo' : '6 modules · From zero to your first mechanism'}</p>
              </div>
              <span className="rounded-full bg-[#eef5ff] px-3 py-1.5 text-[11px] font-extrabold text-[#315784]">{spanish ? 'DISPONIBLE' : 'AVAILABLE'}</span>
            </div>

            <div className="space-y-3">
              {MODULES.map(module => {
                const Icon = module.icon
                const active = selected === module.number
                return (
                  <motion.button
                    key={module.number}
                    type="button"
                    onClick={() => setSelected(module.number)}
                    whileHover={{ x: 2 }}
                    className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${active ? 'border-[#9fc4ff] bg-white shadow-[0_8px_24px_rgba(21,61,115,.07)]' : 'border-[#d8e5f7] bg-white/80 hover:bg-white'}`}
                  >
                    <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${active ? 'bg-[#153d73] text-white' : 'bg-[#eef5ff] text-[#4f75a3]'}`}>
                      <Icon size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-0.5 text-[11px] font-extrabold uppercase tracking-[.1em] text-[#8b9cb5]">{spanish ? 'Módulo' : 'Module'} {module.number}</div>
                      <div className="font-fun text-lg font-semibold text-[#17345f]">{spanish ? module.titleEs : module.titleEn}</div>
                    </div>
                    <ChevronRight size={18} className={active ? 'text-[#2f73df]' : 'text-[#a5b5c9]'} />
                  </motion.button>
                )
              })}
            </div>
          </section>

          <aside className="rounded-[24px] border border-[#d8e5f7] bg-white p-6 shadow-[0_12px_34px_rgba(21,61,115,.06)] sm:p-7 lg:sticky lg:top-24">
            <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-[#eef5ff] text-[#2f73df]">
              <LessonIcon size={27} />
            </div>
            <div className="mb-1 text-[11px] font-extrabold uppercase tracking-[.14em] text-[#6f84a5]">{spanish ? 'Módulo' : 'Module'} {lesson.number}</div>
            <h3 className="font-fun mb-3 text-3xl font-semibold text-[#102a4f]">{spanish ? lesson.titleEs : lesson.titleEn}</h3>
            <p className="mb-6 leading-7 text-[#7185a3]">{spanish ? lesson.descEs : lesson.descEn}</p>

            <div className="mb-5 rounded-2xl bg-[#f7faff] p-4 ring-1 ring-[#d8e5f7]">
              <div className="mb-1 text-[11px] font-extrabold uppercase tracking-[.12em] text-[#8192ab]">{spanish ? 'Objetivo' : 'Goal'}</div>
              <div className="font-bold text-[#294a75]">{spanish ? lesson.goalEs : lesson.goalEn}</div>
            </div>

            <button
              onClick={() => navigate(`/app/blocks/microbit/${lesson.number}`)}
              className="mb-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#153d73] px-5 py-4 font-extrabold text-white transition hover:bg-[#1f5fbf]"
            >
              <Play size={18} fill="currentColor" />
              {spanish ? 'Abrir módulo' : 'Open module'}
            </button>

            <div className="rounded-2xl bg-[#eef5ff] p-4 text-sm leading-6 text-[#58759a]">
              {spanish
                ? 'Editor visual, Python, JavaScript y simulador en una sola experiencia.'
                : 'Visual editor, Python, JavaScript and simulator in one experience.'}
            </div>
          </aside>
        </div>

        <section className="mt-8 flex flex-col items-start justify-between gap-5 rounded-[24px] border border-[#d8e5f7] bg-white p-6 sm:flex-row sm:items-center">
          <div>
            <div className="font-fun mb-1 text-xl font-semibold text-[#17345f]">{spanish ? 'Retos de lógica con bloques' : 'Block logic challenges'}</div>
            <p className="max-w-2xl text-sm leading-6 text-[#7488a7]">
              {spanish ? 'Practica lógica mientras seguimos construyendo las rutas de hardware.' : 'Practice logic while we continue building the hardware paths.'}
            </p>
          </div>
          <button
            onClick={() => navigate('/app/blocks/world/jungle')}
            className="shrink-0 rounded-xl bg-[#eef5ff] px-5 py-3 font-extrabold text-[#214f86] transition hover:bg-[#dcecff]"
          >
            {spanish ? 'Practicar lógica' : 'Practice logic'}
          </button>
        </section>
      </div>
    </div>
  )
}
