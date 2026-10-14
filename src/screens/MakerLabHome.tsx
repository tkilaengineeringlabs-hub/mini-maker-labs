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
    <div className="mx-auto max-w-6xl px-4 py-8 text-[#17345f] sm:px-6 sm:py-12">
      <section className="relative mb-8 overflow-hidden rounded-[28px] border border-[#cfe0f6] bg-gradient-to-br from-[#0c2443] via-[#123c70] to-[#2f73df] p-7 text-white shadow-[0_24px_70px_rgba(28,78,144,.18)] sm:p-10">
        <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative z-10 max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-black tracking-[.12em] text-white">
            <FlaskConical size={14} /> MAKER LAB
          </div>
          <h1 className="mb-4 text-4xl font-black tracking-tight text-white sm:text-6xl">
            {spanish ? 'Construye. Programa. Hazlo real.' : 'Build. Code. Make it real.'}
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-blue-100">
            {spanish
              ? 'Aquí la programación sale de la pantalla. Empezamos con micro:bit y después avanzaremos a Arduino, robótica, Raspberry Pi, drones e IA.'
              : 'Here programming leaves the screen. We start with micro:bit and later move into Arduino, robotics, Raspberry Pi, drones and AI.'}
          </p>
        </div>
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[.18em] text-[#2f73df]">{spanish ? 'Ruta 01' : 'Path 01'}</p>
              <h2 className="text-3xl font-black text-[#102a4f]">micro:bit</h2>
              <p className="mt-1 text-[#7287a7]">{spanish ? '6 módulos · De cero a tu primer mecanismo' : '6 modules · From zero to your first mechanism'}</p>
            </div>
            <span className="rounded-xl border border-[#cfe0f6] bg-[#edf5ff] px-3 py-2 text-xs font-black text-[#315784]">{spanish ? 'DISPONIBLE' : 'AVAILABLE'}</span>
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
                  whileHover={{ x: 3 }}
                  className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${active ? 'border-[#9fc4ff] bg-[#edf5ff] shadow-sm' : 'border-[#d8e5f7] bg-white hover:border-[#b9cfee] hover:bg-[#f9fbff]'}`}
                >
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${active ? 'bg-[#153d73] text-white' : 'bg-[#eef4fb] text-[#55769e]'}`}>
                    <Icon size={21} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 text-xs font-black text-[#8a9cb6]">{spanish ? 'MÓDULO' : 'MODULE'} {module.number}</div>
                    <div className="text-lg font-extrabold text-[#17345f]">{spanish ? module.titleEs : module.titleEn}</div>
                  </div>
                  <ChevronRight size={18} className={active ? 'text-[#2f73df]' : 'text-[#a6b6cb]'} />
                </motion.button>
              )
            })}
          </div>
        </section>

        <aside className="rounded-3xl border border-[#d8e5f7] bg-white p-6 shadow-[0_18px_50px_rgba(28,77,137,.08)] sm:p-7 lg:sticky lg:top-24">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#cfe0f6] bg-[#edf5ff] text-[#2f73df]">
            <LessonIcon size={28} />
          </div>
          <div className="mb-2 text-xs font-black tracking-[.16em] text-[#2f73df]">{spanish ? 'MÓDULO' : 'MODULE'} {lesson.number}</div>
          <h3 className="mb-3 text-2xl font-black text-[#102a4f]">{spanish ? lesson.titleEs : lesson.titleEn}</h3>
          <p className="mb-6 leading-relaxed text-[#6f84a5]">{spanish ? lesson.descEs : lesson.descEn}</p>

          <div className="mb-5 rounded-2xl border border-[#d8e5f7] bg-[#f7faff] p-4">
            <div className="mb-2 text-xs font-black uppercase tracking-wider text-[#8093ae]">{spanish ? 'Objetivo' : 'Goal'}</div>
            <div className="font-bold text-[#294a75]">{spanish ? lesson.goalEs : lesson.goalEn}</div>
          </div>

          <button
            onClick={() => navigate(`/app/blocks/microbit/${lesson.number}`)}
            className="mb-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#153d73] px-5 py-4 font-black text-white transition hover:bg-[#1f5fbf]"
          >
            <Play size={18} fill="currentColor" />
            {spanish ? 'Abrir módulo' : 'Open module'}
          </button>

          <div className="rounded-2xl border border-[#cfe0f6] bg-[#edf5ff] p-4 text-sm leading-6 text-[#4f6e97]">
            {spanish
              ? 'Ya incluye editor visual, Python, JavaScript y simulador. La siguiente fase es guardar progreso propio de Maker Lab y preparar conexión con hardware real.'
              : 'It already includes the visual editor, Python, JavaScript and simulator. Next we add Maker Lab progress and prepare real hardware connection.'}
          </div>
        </aside>
      </div>

      <section className="mt-10 flex flex-col items-start justify-between gap-5 rounded-3xl border border-[#d8e5f7] bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:p-8">
        <div>
          <div className="mb-1 text-xl font-black text-[#17345f]">{spanish ? 'Retos de lógica con bloques' : 'Block logic challenges'}</div>
          <p className="max-w-2xl text-[#7488a7]">{spanish ? 'El simulador original sigue disponible como zona de práctica mientras construimos las rutas de hardware.' : 'The original simulator remains available as a practice zone while we build the hardware paths.'}</p>
        </div>
        <button onClick={() => navigate('/app/blocks/world/jungle')} className="shrink-0 rounded-xl bg-[#eaf3ff] px-5 py-3 font-extrabold text-[#214f86] transition hover:bg-[#dcecff]">
          {spanish ? 'Practicar lógica' : 'Practice logic'}
        </button>
      </section>
    </div>
  )
}
