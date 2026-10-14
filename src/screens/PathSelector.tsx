import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Play, Brain, Blocks3, ShieldCheck } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageProvider'
import type { PlayerProgress } from '../types'

interface PathSelectorProps {
  progress: PlayerProgress
}

const funFont = {
  fontFamily: "'Trebuchet MS', 'Arial Rounded MT Bold', 'Nunito', sans-serif",
}

export function PathSelector({ progress }: PathSelectorProps) {
  const navigate = useNavigate()
  const { t } = useLanguage()

  const hasBlocksProgress = progress.xp > 0 || progress.totalStars > 0
  const hasThinkingProgress = Object.keys(progress.lessons).some(id =>
    id.startsWith('patterns-') || id.startsWith('logic-') || id.startsWith('counting-')
  )
  const hasSafetyProgress = Object.keys(progress.lessons).some(id =>
    id.startsWith('passwords-') || id.startsWith('privacy-') || id.startsWith('kindness-') || id.startsWith('scams-')
  )

  const paths = [
    {
      key: 'thinking',
      route: '/app/thinking',
      icon: Brain,
      title: t('path.thinking.name'),
      description: t('path.thinking.desc'),
      hasProgress: hasThinkingProgress,
      accent: '#2563EB',
      soft: '#EFF6FF',
    },
    {
      key: 'blocks',
      route: '/app/blocks',
      icon: Blocks3,
      title: t('path.blocks.name'),
      description: t('path.blocks.desc'),
      hasProgress: hasBlocksProgress,
      accent: '#1D4ED8',
      soft: '#EEF4FF',
    },
    {
      key: 'safety',
      route: '/app/safety',
      icon: ShieldCheck,
      title: t('path.safety.name'),
      description: t('path.safety.desc'),
      hasProgress: hasSafetyProgress,
      accent: '#0F4C81',
      soft: '#F0F7FC',
    },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <section className="overflow-hidden rounded-[32px] border border-blue-100 bg-[#F8FBFF] shadow-[0_24px_80px_rgba(15,76,129,0.12)]">
        <div className="border-b border-blue-100 bg-white px-6 py-8 text-center sm:px-10 sm:py-10">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F2F57] text-xl text-white shadow-sm">
            ✦
          </div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.24em] text-blue-500">
            MINI MAKER LABS
          </p>
          <h1
            className="text-3xl font-black tracking-tight text-[#0F2F57] sm:text-5xl"
            style={funFont}
          >
            {t('path.choose')}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Elige una ruta y aprende construyendo, programando y resolviendo retos paso a paso.
          </p>
        </div>

        <div className="grid gap-4 p-5 sm:p-7 md:grid-cols-3">
          {paths.map((path, index) => {
            const Icon = path.icon
            return (
              <motion.button
                key={path.key}
                type="button"
                onClick={() => navigate(path.route)}
                className="group relative flex min-h-[300px] flex-col rounded-[24px] border border-blue-100 bg-white p-6 text-left shadow-[0_10px_30px_rgba(15,76,129,0.06)] transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_40px_rgba(15,76,129,0.10)]"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: index * 0.07 }}
                whileTap={{ scale: 0.99 }}
              >
                {path.hasProgress && (
                  <span className="absolute right-4 top-4 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-black text-blue-700">
                    {t('path.continue')}
                  </span>
                )}

                <div
                  className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: path.soft, color: path.accent }}
                >
                  <Icon size={28} strokeWidth={2.2} />
                </div>

                <h2
                  className="mb-3 text-2xl font-black text-[#12385F]"
                  style={funFont}
                >
                  {path.title}
                </h2>

                <p className="mb-7 flex-1 text-sm leading-6 text-slate-500">
                  {path.description}
                </p>

                <div
                  className="inline-flex w-fit items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black text-white transition group-hover:translate-x-0.5"
                  style={{ backgroundColor: path.accent }}
                >
                  {path.hasProgress ? <Play className="h-3.5 w-3.5 fill-current" /> : null}
                  <span>{path.hasProgress ? t('path.continue') : t('path.start')}</span>
                  {!path.hasProgress ? <ArrowRight className="h-3.5 w-3.5" /> : null}
                </div>
              </motion.button>
            )
          })}
        </div>

        <div className="border-t border-blue-100 bg-white px-6 py-5 text-center">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 transition hover:text-[#0F2F57]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t('path.back')}
          </button>
        </div>
      </section>
    </div>
  )
}
