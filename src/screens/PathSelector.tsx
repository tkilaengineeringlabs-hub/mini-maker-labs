import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Play, Brain, Blocks, ShieldCheck, Sparkles } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageProvider'
import type { PlayerProgress } from '../types'
import styles from './PathSelector.module.css'

interface PathSelectorProps {
  progress: PlayerProgress
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
      title: t('hub.thinking'),
      description: t('path.thinking.desc'),
      hasProgress: hasThinkingProgress,
      accent: '#087D8B',
      soft: '#ECFAFC',
    },
    {
      key: 'blocks',
      route: '/app/blocks',
      icon: Blocks,
      title: t('path.blocks.name'),
      description: t('path.blocks.desc'),
      hasProgress: hasBlocksProgress,
      accent: '#087D8B',
      soft: '#ECFAFC',
    },
    {
      key: 'safety',
      route: '/app/safety',
      icon: ShieldCheck,
      title: t('hub.safety'),
      description: t('path.safety.desc'),
      hasProgress: hasSafetyProgress,
      accent: '#087D8B',
      soft: '#ECFAFC',
    },
  ]

  return (
    <div className={`${styles.hub} mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12`}>
      <section className="overflow-hidden">
        <div className="px-6 py-8 text-center sm:px-10 sm:py-10">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-xl text-[#087D8B] bg-[#ECFAFC] shadow-sm">
            <Sparkles size={24} aria-hidden="true" />
          </div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.24em] text-[#087D8B]">
            {t('hub.brand').split(' ').slice(0, -1).join(' ')}{' '}
            <span className={styles.signature}>{t('hub.brand').split(' ').slice(-1).join(' ')}</span>
          </p>
          <h1
            className="text-2xl tracking-tight text-[#087D8B] sm:text-4xl"
          >
            {t('path.choose')}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            {t('hub.subtitle')}
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
                className="group relative flex min-h-[300px] flex-col rounded-[24px] border border-[#CDEEF2] bg-white p-6 text-left shadow-[0_10px_30px_rgba(8,125,139,0.04)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#087D8B] transition hover:-translate-y-1 hover:border-[#10AEC2] hover:shadow-[0_18px_40px_rgba(8,125,139,0.08)]"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: index * 0.07 }}
                whileTap={{ scale: 0.99 }}
              >
                {path.hasProgress && (
                  <span className="absolute right-4 top-4 rounded-full border border-[#CDEEF2] bg-[#ECFAFC] px-2.5 py-1 text-[11px] font-black text-[#087D8B]">
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
                  className="mb-3 text-xl text-[#173644]"
                >
                  {path.title}
                </h2>

                <p className="mb-7 flex-1 text-sm leading-6 text-slate-600">
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

        <div className="px-6 py-5 text-center">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-xl px-3 focus-visible:outline-2 focus-visible:outline-[#087D8B] text-sm font-bold text-slate-600 transition hover:text-[#087D8B]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t('path.back')}
          </button>
        </div>
      </section>
    </div>
  )
}
