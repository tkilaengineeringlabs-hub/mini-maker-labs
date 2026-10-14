import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Code2, Lightbulb, Gift, ShieldCheck, GraduationCap } from 'lucide-react'
import { WORLDS } from '../data/worlds'
import { THINKING_WORLDS } from '../data/thinkingWorlds'
import { SAFETY_WORLDS } from '../data/safetyWorlds'
import { useLanguage } from '../i18n/LanguageProvider'
import { localize } from '../i18n/localize'
import { Footer } from '../components/Footer'
import logo from '../assets/landing/mini-maker-labs-logo.png'
import styles from './LandingScreen.module.css'

interface LandingScreenProps {
  onStart: () => void
  hasProgress: boolean
}

const THINKING_COLOR_MAP: Record<string, { accent: string; bg: string }> = {
  purple: { accent: '#087D8B', bg: '#FFFFFF' },
  blue:   { accent: '#087D8B', bg: '#FFFFFF' },
  emerald:{ accent: '#087D8B', bg: '#FFFFFF' },
  rose:   { accent: '#087D8B', bg: '#FFFFFF' },
  green:  { accent: '#087D8B', bg: '#FFFFFF' },
  indigo: { accent: '#087D8B', bg: '#FFFFFF' },
  orange: { accent: '#087D8B', bg: '#FFFFFF' },
  teal:   { accent: '#087D8B', bg: '#FFFFFF' },
  amber:  { accent: '#087D8B', bg: '#FFFFFF' },
  cyan:   { accent: '#087D8B', bg: '#FFFFFF' },
  violet: { accent: '#087D8B', bg: '#FFFFFF' },
  sky:    { accent: '#087D8B', bg: '#FFFFFF' },
  lime:   { accent: '#087D8B', bg: '#FFFFFF' },
  fuchsia:{ accent: '#087D8B', bg: '#FFFFFF' },
  yellow: { accent: '#087D8B', bg: '#FFFFFF' },
  slate:  { accent: '#087D8B', bg: '#FFFFFF' },
  pink:   { accent: '#087D8B', bg: '#FFFFFF' },
  red:    { accent: '#087D8B', bg: '#FFFFFF' },
}

function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}

function SectionLabel({ text }: { text: string }) {
  return (
    <p className="text-[#087D8B] text-xs font-semibold uppercase tracking-[0.15em] mb-3">
      {text}
    </p>
  )
}

const titleFont = {
  fontFamily: "'MiniMakerLandingPixel', monospace",
}

export function LandingScreen({ onStart, hasProgress }: LandingScreenProps) {
  const { t, language, setLanguage } = useLanguage()

  const totalCodingLessons = WORLDS.filter(w => !w.isBonus).reduce((sum, w) => sum + w.lessonCount, 0)
  const totalThinkingLessons = THINKING_WORLDS.reduce((sum, w) => sum + w.lessonCount, 0)
  const totalSafetyLessons = SAFETY_WORLDS.reduce((sum, w) => sum + w.lessonCount, 0)

  const gradientHeadline = (text: string) => {
    const words = text.split(' ')
    const pivot = Math.max(1, words.length - 2)
    return (
      <>
        {words.slice(0, pivot).join(' ')}{' '}
        <span className="text-[#087D8B]">
          {words.slice(pivot).join(' ')}
        </span>
      </>
    )
  }

  return (
    <div
      className={`${styles.landing} min-h-screen bg-[#F7FCFD] text-[#173644] overflow-x-hidden`}
      style={{ fontFamily: "'Nunito', system-ui, sans-serif" }}
    >
      {/* ── NAV ──────────────────────────────────── */}
      <nav className="sticky top-0 z-40 border-b border-[#CDEEF2] bg-[#FFFFFF]/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex flex-wrap gap-3 items-center justify-between">
          <motion.div
            className="flex items-center gap-3 select-none"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <div className="flex flex-col gap-1">
              <img src={logo} width={704} height={303} alt={t('hub.brand')} className="h-auto w-36 sm:w-44" />
              <div className="hidden text-xs text-slate-500 sm:block">{t('landing.nav.tagline')}</div>
            </div>
          </motion.div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white rounded-xl border border-[#CDEEF2] overflow-hidden">
              {(['en', 'id'] as const).map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  aria-pressed={language === lang}
                  className={`min-h-11 min-w-11 px-3 py-1.5 text-xs font-bold uppercase tracking-widest focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#087D8B] transition-colors ${
                    language === lang
                      ? 'bg-[#087D8B] text-white'
                      : 'text-slate-600 hover:bg-[#ECFAFC]'
                  }`}
                >
                  {lang === 'id' ? 'ES' : 'EN'}
                </button>
              ))}
            </div>

            <motion.button
              onClick={onStart}
              className="min-h-11 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#087D8B] hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white"
              style={{ background: '#087D8B' }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              {hasProgress ? t('landing.returning') : t('landing.cta')}
            </motion.button>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────── */}
      <section className="relative pt-16 sm:pt-24 pb-16 px-5 sm:px-8 text-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#ECFAFC] rounded-full blur-[100px]" />
          <div className="absolute top-40 right-1/4 w-72 h-72 bg-[#ECFAFC] rounded-full blur-3xl" />
          <div className="absolute top-24 left-1/4 w-56 h-56 bg-[#ECFAFC] rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            className="inline-flex items-center gap-2.5 mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="inline-flex items-center gap-2 bg-[#ECFAFC] border border-[#CDEEF2] text-[#087D8B] px-4 py-1.5 rounded-full text-sm font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10AEC2] animate-pulse flex-shrink-0" />
              {t('landing.badge')}
            </span>
          </motion.div>

          <motion.h1
            style={titleFont}
            className="text-[clamp(1.5rem,5vw,3.75rem)] font-extrabold mb-6 leading-[1.05] tracking-tight"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            {gradientHeadline(t('landing.headline'))}
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-slate-600 max-w-xl mx-auto mb-10 leading-relaxed font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {t('landing.sub')}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={onStart}
              className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#087D8B] group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-lg text-white"
              style={{
                background: '#087D8B',
                boxShadow: '0 8px 32px rgba(8,125,139,0.10)',
              }}
              whileHover={{ scale: 1.04, boxShadow: '0 12px 48px rgba(8,125,139,0.10)' }}
              whileTap={{ scale: 0.97 }}
            >
              {t('landing.cta')}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </motion.button>

            {hasProgress && (
              <motion.button
                onClick={onStart}
                className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#087D8B] flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base text-[#087D8B] border border-[#CDEEF2] hover:bg-[#ECFAFC] transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <ArrowRight className="w-4 h-4" />
                {t('landing.returning')}
              </motion.button>
            )}
          </motion.div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {[
              { value: '3', label: t('landing.stats.paths') },
              { value: String(WORLDS.length + THINKING_WORLDS.length + SAFETY_WORLDS.length), label: t('landing.stats.worlds') },
              { value: `${totalThinkingLessons + totalSafetyLessons}+`, label: t('landing.stats.puzzles') },
              { value: '5–14', label: t('landing.stats.ages') },
            ].map(({ value, label }) => (
              <div
                key={value}
                className="rounded-2xl p-4 text-center shadow-sm border border-[#CDEEF2] bg-white"
              >
                <div className="text-2xl font-extrabold text-[#173644] mb-0.5">{value}</div>
                <div className="text-xs text-slate-600 font-medium leading-tight">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-5 sm:px-8 bg-white border-y border-[#CDEEF2]">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-14">
            <SectionLabel text={t('landing.paths.label')} />
            <h2 style={titleFont} className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-4">
              {gradientHeadline(t('landing.paths.title'))}
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
              {t('landing.paths.sub')}
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <FadeIn delay={0.05}>
              <div className="relative rounded-3xl p-7 sm:p-8 border border-[#CDEEF2] shadow-[0_8px_24px_rgba(8,125,139,0.04)] overflow-hidden h-full flex flex-col" style={{ background: '#FFFFFF' }}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#ECFAFC] rounded-full blur-[60px] pointer-events-none" />
                <div className="relative z-10 flex flex-col flex-1">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: '#ECFAFC', border: '1px solid #CDEEF2' }}>
                    <Code2 size={24} color="#087D8B" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-[#173644] mb-3">{t('landing.paths.blocks.title')}</h3>
                  <p className="text-[#087D8B] text-base leading-relaxed mb-5">{t('landing.paths.blocks.desc')}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {t('landing.paths.blocks.concepts').split(' · ').map(concept => (
                      <span key={concept} className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: '#ECFAFC', color: '#087D8B' }}>{concept}</span>
                    ))}
                  </div>
                  <div className="mt-auto grid grid-cols-3 gap-3 pt-5 border-t border-[#CDEEF2]">
                    <div className="text-center"><div className="text-xl font-extrabold text-[#173644]">{WORLDS.length}</div><div className="text-xs text-[#087D8B] mt-0.5">{t('landing.paths.stat.worlds')}</div></div>
                    <div className="text-center"><div className="text-xl font-extrabold text-[#173644]">{totalCodingLessons}</div><div className="text-xs text-[#087D8B] mt-0.5">{t('landing.paths.stat.lessons')}</div></div>
                    <div className="text-center"><div className="text-xl font-extrabold text-[#173644]">5–14</div><div className="text-xs text-[#087D8B] mt-0.5">{t('landing.paths.stat.ages')}</div></div>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="relative rounded-3xl p-7 sm:p-8 border border-[#CDEEF2] shadow-[0_8px_24px_rgba(8,125,139,0.04)] overflow-hidden h-full flex flex-col" style={{ background: '#FFFFFF' }}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#ECFAFC] rounded-full blur-[60px] pointer-events-none" />
                <div className="relative z-10 flex flex-col flex-1">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: '#ECFAFC', border: '1px solid #CDEEF2' }}><Lightbulb size={24} color="#087D8B" /></div>
                  <h3 className="text-2xl font-extrabold text-[#173644] mb-3">{t('landing.paths.thinking.title')}</h3>
                  <p className="text-[#087D8B] text-base leading-relaxed mb-5">{t('landing.paths.thinking.desc')}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {t('landing.paths.thinking.topics').split(' · ').map(topic => (
                      <span key={topic} className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: '#ECFAFC', color: '#087D8B' }}>{topic}</span>
                    ))}
                  </div>
                  <div className="mt-auto grid grid-cols-3 gap-3 pt-5 border-t border-[#CDEEF2]">
                    <div className="text-center"><div className="text-xl font-extrabold text-[#173644]">{THINKING_WORLDS.length}</div><div className="text-xs text-[#087D8B] mt-0.5">{t('landing.paths.stat.worlds')}</div></div>
                    <div className="text-center"><div className="text-xl font-extrabold text-[#173644]">{totalThinkingLessons}</div><div className="text-xs text-[#087D8B] mt-0.5">{t('landing.paths.stat.puzzles')}</div></div>
                    <div className="text-center"><div className="text-xl font-extrabold text-[#173644]">5–13</div><div className="text-xs text-[#087D8B] mt-0.5">{t('landing.paths.stat.ages')}</div></div>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="relative rounded-3xl p-7 sm:p-8 border border-[#CDEEF2] shadow-[0_8px_24px_rgba(8,125,139,0.04)] overflow-hidden h-full flex flex-col" style={{ background: '#FFFFFF' }}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#ECFAFC] rounded-full blur-[60px] pointer-events-none" />
                <div className="relative z-10 flex flex-col flex-1">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: '#ECFAFC', border: '1px solid #CDEEF2' }}><ShieldCheck size={24} color="#087D8B" /></div>
                  <h3 className="text-2xl font-extrabold text-[#173644] mb-3">{t('landing.paths.safety.title')}</h3>
                  <p className="text-[#087D8B] text-base leading-relaxed mb-5">{t('landing.paths.safety.desc')}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {t('landing.paths.safety.topics').split(' · ').map(topic => (
                      <span key={topic} className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: '#ECFAFC', color: '#087D8B' }}>{topic}</span>
                    ))}
                  </div>
                  <div className="mt-auto grid grid-cols-3 gap-3 pt-5 border-t border-[#CDEEF2]">
                    <div className="text-center"><div className="text-xl font-extrabold text-[#173644]">{SAFETY_WORLDS.length}</div><div className="text-xs text-[#087D8B] mt-0.5">{t('landing.paths.stat.worlds')}</div></div>
                    <div className="text-center"><div className="text-xl font-extrabold text-[#173644]">{totalSafetyLessons}</div><div className="text-xs text-[#087D8B] mt-0.5">{t('landing.paths.stat.puzzles')}</div></div>
                    <div className="text-center"><div className="text-xl font-extrabold text-[#173644]">5–14</div><div className="text-xs text-[#087D8B] mt-0.5">{t('landing.paths.stat.ages')}</div></div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-4">
            <SectionLabel text={t('landing.worlds.label')} />
            <h2 style={titleFont} className="text-2xl sm:text-4xl font-extrabold tracking-tight">{t('landing.worlds.title')}</h2>
          </FadeIn>
          <FadeIn delay={0.08} className="text-center mb-14">
            <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">{t('landing.worlds.sub')}</p>
          </FadeIn>

          <FadeIn className="mb-4">
            <div className="flex items-center gap-3"><div className="flex items-center gap-2 bg-[#ECFAFC] border border-[#CDEEF2] px-3 py-1.5 rounded-full"><span className="text-sm">🎮</span><span className="text-[#087D8B] text-sm font-bold">{t('landing.worlds.blocks.label')}</span></div><div className="flex-1 h-px bg-white" /></div>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-10">
            {WORLDS.filter(w => !w.isBonus).map((world, i) => (
              <FadeIn key={world.id} delay={i * 0.04}>
                <div className="h-full rounded-2xl p-4 border shadow-sm hover:scale-[1.03] transition-transform duration-200 cursor-default" style={{ background: '#FFFFFF', borderColor: '#CDEEF2' }}>
                  <div className="text-2xl mb-2">{world.emoji}</div>
                  <h3 className="font-bold text-sm text-[#173644] mb-1 leading-snug">{localize(world.name, language)}</h3>
                  <div className="text-xs font-semibold mb-2" style={{ color: '#087D8B' }}>{localize(world.concept, language)}</div>
                  <div className="text-xs text-slate-600">{world.lessonCount} {t('landing.worlds.lessons')}</div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="mb-4">
            <div className="flex items-center gap-3"><div className="flex items-center gap-2 bg-[#ECFAFC] border border-[#CDEEF2] px-3 py-1.5 rounded-full"><span className="text-sm">🧠</span><span className="text-[#087D8B] text-sm font-bold">{t('landing.worlds.thinking.label')}</span></div><div className="flex-1 h-px bg-white" /></div>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {THINKING_WORLDS.map((world, i) => {
              const c = THINKING_COLOR_MAP[world.color] ?? { accent: '#087D8B', bg: '#FFFFFF' }
              return (
                <FadeIn key={world.id} delay={i * 0.04}>
                  <div className="h-full rounded-2xl p-4 border shadow-sm hover:scale-[1.03] transition-transform duration-200 cursor-default" style={{ background: c.bg, borderColor: '#CDEEF2' }}>
                    <div className="text-2xl mb-2">{world.emoji}</div>
                    <h3 className="font-bold text-sm text-[#173644] mb-1 leading-snug">{localize(world.name, language)}</h3>
                    <div className="text-xs font-semibold mb-2" style={{ color: c.accent }}>{localize(world.concept, language)}</div>
                    <div className="text-xs text-slate-600">{world.lessonCount} {t('landing.worlds.lessons')}</div>
                  </div>
                </FadeIn>
              )
            })}
          </div>

          <FadeIn className="mb-4 mt-10">
            <div className="flex items-center gap-3"><div className="flex items-center gap-2 bg-[#ECFAFC] border border-[#CDEEF2] px-3 py-1.5 rounded-full"><span className="text-sm">🛡️</span><span className="text-[#087D8B] text-sm font-bold">{t('landing.worlds.safety.label')}</span></div><div className="flex-1 h-px bg-white" /></div>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {SAFETY_WORLDS.map((world, i) => {
              const c = THINKING_COLOR_MAP[world.color] ?? { accent: '#087D8B', bg: '#FFFFFF' }
              return (
                <FadeIn key={world.id} delay={i * 0.04}>
                  <div className="h-full rounded-2xl p-4 border shadow-sm hover:scale-[1.03] transition-transform duration-200 cursor-default" style={{ background: c.bg, borderColor: '#CDEEF2' }}>
                    <div className="text-2xl mb-2">{world.emoji}</div>
                    <h3 className="font-bold text-sm text-[#173644] mb-1 leading-snug">{localize(world.name, language)}</h3>
                    <div className="text-xs font-semibold mb-2" style={{ color: c.accent }}>{localize(world.concept, language)}</div>
                    <div className="text-xs text-slate-600">{world.lessonCount} {t('landing.worlds.lessons')}</div>
                  </div>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-5 sm:px-8 bg-white border-y border-[#CDEEF2]">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-14">
            <SectionLabel text={t('landing.trust.label')} />
            <h2 style={titleFont} className="text-2xl sm:text-4xl font-extrabold tracking-tight">{gradientHeadline(t('landing.trust.title'))}</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { Icon: Gift,          color: '#087D8B', titleKey: 'landing.trust.free.title',    descKey: 'landing.trust.free.desc' },
              { Icon: ShieldCheck,   color: '#087D8B', titleKey: 'landing.trust.private.title', descKey: 'landing.trust.private.desc' },
              { Icon: GraduationCap, color: '#087D8B', titleKey: 'landing.trust.edu.title',     descKey: 'landing.trust.edu.desc' },
            ].map(({ Icon, color, titleKey, descKey }, i) => (
              <FadeIn key={titleKey} delay={i * 0.08}>
                <div className="rounded-2xl p-6 shadow-sm border border-[#CDEEF2] bg-white hover:border-[#CDEEF2] transition-all duration-200 h-full flex flex-col gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}18`, border: `1px solid ${color}30` }}><Icon size={22} color={color} /></div>
                  <div><h3 className="font-bold text-base text-[#173644] mb-2">{t(titleKey)}</h3><p className="text-slate-600 text-sm leading-relaxed">{t(descKey)}</p></div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <div className="relative rounded-3xl p-8 sm:p-10 border border-[#CDEEF2] overflow-hidden text-center" style={{ background: '#FFFFFF' }}>
              <div className="pointer-events-none absolute inset-0"><div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-[#ECFAFC] rounded-full blur-[60px]" /></div>
              <div className="relative z-10">
                <p className="text-[#087D8B] text-xs font-semibold uppercase tracking-[0.15em] mb-4">{t('landing.origin.label')}</p>
                <div className="text-4xl mb-5">🛠️</div>
                <h2 style={titleFont} className="text-2xl sm:text-3xl text-[#087D8B] mb-4 tracking-tight">
                  {t('hub.brand').split(' ').slice(0, -1).join(' ')}{' '}
                  <span className={styles.signature}>{t('hub.brand').split(' ').slice(-1).join(' ')}</span>
                </h2>
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-7">{t('landing.origin.desc').replace('CodeKids', t('hub.brand'))}</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <span className="inline-flex items-center gap-2 bg-[#ECFAFC] border border-[#CDEEF2] text-[#087D8B] px-4 py-2 rounded-full text-sm font-semibold">{t('landing.origin.tag.built')}</span>
                  <span className="inline-flex items-center gap-2 bg-[#ECFAFC] border border-[#CDEEF2] text-[#087D8B] px-4 py-2 rounded-full text-sm font-semibold">{t('landing.origin.tag.tested')}</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-20 sm:py-28 px-5 sm:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <FadeIn><h2 style={titleFont} className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-5 leading-[1.05]">{gradientHeadline(t('landing.final.title'))}</h2></FadeIn>
          <FadeIn delay={0.08}><p className="text-slate-600 text-lg mb-10 leading-relaxed">{t('landing.final.sub')}</p></FadeIn>
          <FadeIn delay={0.15}>
            <motion.button onClick={onStart} className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#087D8B] w-full sm:w-auto px-10 py-5 rounded-2xl font-bold text-xl text-white block mx-auto" style={{ background: '#087D8B', boxShadow: '0 8px 48px rgba(8,125,139,0.10)' }} whileHover={{ scale: 1.04, boxShadow: '0 16px 64px rgba(8,125,139,0.10)' }} whileTap={{ scale: 0.97 }}>
              {t('landing.final.cta')}
            </motion.button>
          </FadeIn>
        </div>
      </section>

      <div className="bg-[#173644]"><Footer /></div>
    </div>
  )
}
