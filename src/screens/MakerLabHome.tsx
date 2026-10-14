import { useState } from 'react'
import { motion } from 'framer-motion'
import { Cpu, Lightbulb, ToggleLeft, Cable, Gauge, RotateCcw, ChevronRight, FlaskConical } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageProvider'

const MODULES = [
  {
    number: 1,
    icon: Cpu,
    titleEs: 'Conoce tu micro:bit',
    titleEn: 'Meet your micro:bit',
    descEs: 'Descubre qué es la micro:bit, sus botones, matriz LED, pines, sensores y cómo se alimenta.',
    descEn: 'Discover the micro:bit, its buttons, LED matrix, pins, sensors and power options.',
    goalEs: 'Identificar las partes principales de la placa.',
    goalEn: 'Identify the main parts of the board.',
  },
  {
    number: 2,
    icon: Lightbulb,
    titleEs: 'Matriz LED',
    titleEn: 'LED matrix',
    descEs: 'Aprende a mostrar iconos, letras y patrones en la pantalla de 5×5 LEDs.',
    descEn: 'Learn to display icons, letters and patterns on the 5×5 LED matrix.',
    goalEs: 'Crear tu primer mensaje visual.',
    goalEn: 'Create your first visual message.',
  },
  {
    number: 3,
    icon: ToggleLeft,
    titleEs: 'Botones A y B',
    titleEn: 'Buttons A and B',
    descEs: 'Haz que tu programa reaccione cuando presionas A, B o ambos botones.',
    descEn: 'Make your program react when A, B or both buttons are pressed.',
    goalEs: 'Entender eventos y entradas.',
    goalEn: 'Understand events and inputs.',
  },
  {
    number: 4,
    icon: Cable,
    titleEs: 'Pines y señales',
    titleEn: 'Pins and signals',
    descEs: 'Conoce P0, P1 y P2 y aprende la diferencia entre una entrada y una salida.',
    descEn: 'Meet P0, P1 and P2 and learn the difference between an input and an output.',
    goalEs: 'Controlar una salida desde un pin.',
    goalEn: 'Control an output from a pin.',
  },
  {
    number: 5,
    icon: Gauge,
    titleEs: 'Sensores',
    titleEn: 'Sensors',
    descEs: 'Experimenta con luz, temperatura, acelerómetro y movimiento.',
    descEn: 'Experiment with light, temperature, accelerometer and movement.',
    goalEs: 'Usar datos del mundo real en un programa.',
    goalEn: 'Use real-world data in a program.',
  },
  {
    number: 6,
    icon: RotateCcw,
    titleEs: 'Mueve un servo',
    titleEn: 'Move a servo',
    descEs: 'Conecta un servomotor correctamente y controla su posición desde la micro:bit.',
    descEn: 'Connect a servo correctly and control its position from the micro:bit.',
    goalEs: 'Construir tu primer mecanismo controlado.',
    goalEn: 'Build your first controlled mechanism.',
  },
]

export function MakerLabHome() {
  const { language } = useLanguage()
  const navigate = useNavigate()
  const [selected, setSelected] = useState(1)
  const spanish = language === 'id'
  const lesson = MODULES.find(m => m.number === selected) ?? MODULES[0]
  const LessonIcon = lesson.icon

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 text-white">
      <section className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-950/50 via-slate-950/70 to-violet-950/50 p-6 sm:p-10 mb-8">
        <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-200 mb-5">
            <FlaskConical size={14} /> MAKER LAB
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-4">
            {spanish ? 'Construye. Programa. Hazlo real.' : 'Build. Code. Make it real.'}
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl">
            {spanish
              ? 'Aquí la programación sale de la pantalla. Empezamos con micro:bit y después avanzaremos a Arduino, robótica, Raspberry Pi, drones e IA.'
              : 'Here programming leaves the screen. We start with micro:bit and later move into Arduino, robotics, Raspberry Pi, drones and AI.'}
          </p>
        </div>
      </section>

      <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-6 items-start">
        <section>
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <p className="text-cyan-300 text-xs font-black uppercase tracking-[.18em] mb-2">
                {spanish ? 'Ruta 01' : 'Path 01'}
              </p>
              <h2 className="text-3xl font-black">micro:bit</h2>
              <p className="text-white/45 mt-1">
                {spanish ? '6 módulos · De cero a tu primer mecanismo' : '6 modules · From zero to your first mechanism'}
              </p>
            </div>
            <span className="rounded-xl bg-emerald-400/10 border border-emerald-400/20 px-3 py-2 text-emerald-300 text-xs font-bold">
              {spanish ? 'DISPONIBLE' : 'AVAILABLE'}
            </span>
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
                  className={`w-full text-left rounded-2xl border p-4 transition-colors flex items-center gap-4 ${active ? 'border-cyan-400/40 bg-cyan-400/10' : 'border-white/8 bg-white/[0.025] hover:bg-white/[0.05]'}`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${active ? 'bg-cyan-400/15 text-cyan-300' : 'bg-white/5 text-white/55'}`}>
                    <Icon size={21} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-white/35 font-bold mb-1">{spanish ? 'MÓDULO' : 'MODULE'} {module.number}</div>
                    <div className="font-extrabold text-lg">{spanish ? module.titleEs : module.titleEn}</div>
                  </div>
                  <ChevronRight size={18} className={active ? 'text-cyan-300' : 'text-white/20'} />
                </motion.button>
              )
            })}
          </div>
        </section>

        <aside className="lg:sticky lg:top-24 rounded-3xl border border-white/10 bg-[#120d27]/90 p-6 sm:p-7">
          <div className="w-14 h-14 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-300 mb-5">
            <LessonIcon size={28} />
          </div>
          <div className="text-xs text-cyan-300 font-black tracking-[.16em] mb-2">
            {spanish ? 'MÓDULO' : 'MODULE'} {lesson.number}
          </div>
          <h3 className="text-2xl font-black mb-3">{spanish ? lesson.titleEs : lesson.titleEn}</h3>
          <p className="text-white/55 leading-relaxed mb-6">{spanish ? lesson.descEs : lesson.descEn}</p>

          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 mb-6">
            <div className="text-xs uppercase tracking-wider text-white/35 font-bold mb-2">
              {spanish ? 'Objetivo' : 'Goal'}
            </div>
            <div className="font-bold text-white/85">{spanish ? lesson.goalEs : lesson.goalEn}</div>
          </div>

          <div className="rounded-2xl border border-amber-400/15 bg-amber-400/[0.06] p-4 text-sm text-amber-100/75">
            {spanish
              ? 'Estamos construyendo ahora el editor de bloques + MicroPython para que estos módulos puedan controlar una micro:bit real.'
              : 'We are now building the Blocks + MicroPython editor so these modules can control a real micro:bit.'}
          </div>
        </aside>
      </div>

      <section className="mt-10 rounded-3xl border border-violet-400/15 bg-violet-400/[0.04] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 justify-between">
        <div>
          <div className="font-black text-xl mb-1">{spanish ? 'Retos de lógica con bloques' : 'Block logic challenges'}</div>
          <p className="text-white/45 max-w-2xl">
            {spanish
              ? 'El simulador original sigue disponible como zona de práctica mientras construimos los bloques de hardware.'
              : 'The original simulator remains available as a practice zone while we build the hardware blocks.'}
          </p>
        </div>
        <button
          onClick={() => navigate('/app/blocks/world/jungle')}
          className="shrink-0 rounded-xl bg-violet-600 hover:bg-violet-500 transition-colors px-5 py-3 font-extrabold"
        >
          {spanish ? 'Practicar lógica' : 'Practice logic'}
        </button>
      </section>
    </div>
  )
}
