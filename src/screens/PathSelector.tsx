import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Brain, Blocks3, ShieldCheck, Play } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageProvider'
import type { PlayerProgress } from '../types'

interface PathSelectorProps {
  progress: PlayerProgress
}

const CARD = 'group relative rounded-[24px] border border-[#d8e5f7] bg-white p-6 text-left shadow-[0_10px_30px_rgba(21,61,115,.06)] transition hover:-translate-y-0.5 hover:border-[#bdd3ef] hover:shadow-[0_16px_38px_rgba(21,61,115,.1)]'

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
    { key: 'thinking', icon: Brain, progress: hasThinkingProgress, name: t('path.thinking.name'), desc: t('path.thinking.desc'), route: '/app/thinking' },
    { key: 'blocks', icon: Blocks3, progress: hasBlocksProgress, name: t('path.blocks.name'), desc: t('path.blocks.desc'), route: '/app/blocks' },
    { key: 'safety', icon: ShieldCheck, progress: hasSafetyProgress, name: t('path.safety.name'), desc: t('path.safety.desc'), route: '/app/safety' },
  ]

  return (
    <div className="min-h-[calc(100vh-70px)] bg-[#f6faff] text-[#102a4f]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <motion.div
          className="mb-9 text-center"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mx-auto mb-3 inline-flex rounded-full border border-[#d8e5f7] bg-white px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[.14em] text-[#6680a3]">
            Aprende a tu ritmo
          </div>
          <h1 className="font-fun text-4xl font-semibold text-[#102a4f] sm:text-5xl">{t('path.choose')}</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#7488a7] sm:text-base">
            Tres rutas simples. Elige una, aprende haciendo y sigue avanzando.
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
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.06 }}
                whileTap={{ scale: 0.99 }}
              >
                {card.progress && (
                  <div className="absolute right-4 top-4 rounded-full bg-[#eef5ff] px-2.5 py-1 text-[11px] font-extrabold text-[#315784]">
                    {t('path.continue')}
                  </div>
                )}

                <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-[#eef5ff] text-[#2f73df]">
                  <Icon size={24} />
                </div>

                <h2 className="font-fun mb-2 text-2xl font-semibold text-[#17345f]">{card.name}</h2>
                <p className="mb-6 min-h-[66px] text-sm leading-6 text-[#7185a3]">{card.desc}</p>

                <div className="inline-flex items-center gap-2 rounded-xl bg-[#153d73] px-4 py-2.5 text-sm font-extrabold text-white transition group-hover:bg-[#1f5fbf]">
                  {card.progress ? <Play className="h-3.5 w-3.5 fill-current" /> : null}
                  <span>{card.progress ? t('path.continue') : t('path.start')}</span>
                  {!card.progress ? <ArrowRight className="h-3.5 w-3.5" /> : null}
                </div>
              </motion.button>
            )
          })}
        </div>

        <motion.div className="mt-9 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#6f84a5] transition hover:text-[#153d73]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t('path.back')}
          </button>
        </motion.div>
      </div>
    </div>
  )
}
