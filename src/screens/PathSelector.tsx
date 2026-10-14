import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Brain, Blocks3, ShieldCheck, Play } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageProvider'
import type { PlayerProgress } from '../types'

interface PathSelectorProps {
  progress: PlayerProgress
}

const CARD = 'group relative rounded-3xl border border-[#d8e5f7] bg-white p-7 text-left shadow-[0_16px_45px_rgba(26,75,135,.07)] transition-all duration-300 hover:-translate-y-1 hover:border-[#a9c6ec] hover:shadow-[0_20px_55px_rgba(26,75,135,.12)]'

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

  const cards = [
    {
      key: 'thinking',
      icon: Brain,
      hasProgress: hasThinkingProgress,
      name: t('path.thinking.name'),
      desc: t('path.thinking.desc'),
      route: '/app/thinking',
      tone: 'bg-[#e9f4ff] text-[#2b6fb9]',
    },
    {
      key: 'blocks',
      icon: Blocks3,
      hasProgress: hasBlocksProgress,
      name: t('path.blocks.name'),
      desc: t('path.blocks.desc'),
      route: '/app/blocks',
      tone: 'bg-[#eaf1ff] text-[#315fc8]',
    },
    {
      key: 'safety',
      icon: ShieldCheck,
      hasProgress: hasSafetyProgress,
      name: t('path.safety.name'),
      desc: t('path.safety.desc'),
      route: '/app/safety',
      tone: 'bg-[#edf6ff] text-[#1f5f9f]',
    },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <motion.div
        className="mb-10 text-center"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="mx-auto mb-4 inline-flex rounded-full border border-[#cfe0f6] bg-white px-4 py-2 text-xs font-black uppercase tracking-[.16em] text-[#426996] shadow-sm">
          Mini Maker Labs
        </div>
        <h1 className="text-3xl font-black text-[#102a4f] sm:text-5xl">{t('path.choose')}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#7185a3] sm:text-base">
          Elige una ruta corta, aprende haciendo y conserva tu progreso mientras avanzas.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {cards.map((card, index) => {
          const Icon = card.icon
          return (
            <motion.button
              key={card.key}
              onClick={() => navigate(card.route)}
              className={CARD}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.08 * index }}
              whileTap={{ scale: 0.99 }}
            >
              {card.hasProgress && (
                <div className="absolute right-4 top-4 rounded-full border border-[#cfe0f6] bg-[#f4f8ff] px-2.5 py-1 text-[11px] font-black text-[#315784]">
                  {t('path.continue')}
                </div>
              )}

              <div className={`mb-5 grid h-14 w-14 place-items-center rounded-2xl ${card.tone}`}>
                <Icon size={27} />
              </div>

              <h2 className="mb-2 text-2xl font-black text-[#17345f]">{card.name}</h2>
              <p className="mb-7 min-h-[72px] text-sm leading-6 text-[#7084a2]">{card.desc}</p>

              <div className="inline-flex items-center gap-2 rounded-xl bg-[#153d73] px-5 py-2.5 text-sm font-black text-white transition group-hover:bg-[#1f5fbf]">
                {card.hasProgress ? <Play className="h-3.5 w-3.5 fill-current" /> : null}
                <span>{card.hasProgress ? t('path.continue') : t('path.start')}</span>
                {!card.hasProgress ? <ArrowRight className="h-3.5 w-3.5" /> : null}
              </div>
            </motion.button>
          )
        })}
      </div>

      <motion.div
        className="mt-10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#6480a6] transition-colors hover:text-[#153d73]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t('path.back')}
        </button>
      </motion.div>
    </div>
  )
}
