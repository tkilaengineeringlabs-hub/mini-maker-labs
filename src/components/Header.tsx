import { motion } from 'framer-motion'
import { ArrowLeft, Star } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { XPBar } from './XPBar'
import { Logo } from './Logo'
import { StatsModal } from './StatsModal'
import type { PlayerProgress } from '../types'
import { getAllStats, type PathId } from '../utils/progressStats'
import { useLanguage } from '../i18n/LanguageProvider'

interface HeaderProps {
  progress: PlayerProgress
}

export function Header({ progress }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const [statsOpen, setStatsOpen] = useState(false)

  const pathParts = location.pathname.split('/').filter(Boolean)
  const subPath = pathParts.length >= 2 ? pathParts[1] : null
  const isInSubPath = subPath === 'blocks' || subPath === 'thinking' || subPath === 'safety'
  const isSubHome = isInSubPath && pathParts.length === 2
  const isWorldPage = isInSubPath && pathParts.length === 4 && pathParts[2] === 'world'
  const isLessonPage = isInSubPath && pathParts.length >= 5 && pathParts[2] === 'world'
  const showBack = isSubHome || isWorldPage || isLessonPage

  const currentPath: PathId | null = isInSubPath ? (subPath as PathId) : null
  const stats = getAllStats(progress)
  const pathStats = currentPath === 'blocks' ? stats.blocks : currentPath === 'thinking' ? stats.thinking : currentPath === 'safety' ? stats.safety : null
  const shownStars = pathStats ? pathStats.stars : stats.stars
  const allPaths: PathId[] = ['blocks', 'thinking', 'safety']
  const defaultStatsPath: PathId = allPaths.reduce((best, path) =>
    stats[path].stars > stats[best].stars ? path : best
  )

  const handleClick = () => {
    if (isLessonPage) navigate(`/app/${subPath}/world/${pathParts[3]}`)
    else if (isWorldPage) navigate(`/app/${subPath}`)
    else if (isSubHome) navigate('/app')
    else navigate('/')
  }

  return (
    <header className="sticky top-0 z-30 border-b border-[#d8e5f7] bg-white/92 backdrop-blur-xl shadow-[0_8px_28px_rgba(36,84,145,.06)]">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <button onClick={handleClick} className="group flex shrink-0 items-center gap-2">
          {showBack ? (
            <div className="flex items-center gap-2 font-bold text-[#456a9f] transition-colors hover:text-[#153d73]">
              <ArrowLeft className="h-5 w-5 shrink-0" />
              <span className="hidden text-sm sm:inline">
                {subPath === 'thinking' ? t('path.thinking.name') : subPath === 'safety' ? t('path.safety.name') : t('path.blocks.name')}
              </span>
            </div>
          ) : (
            <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#eaf3ff] ring-1 ring-[#cfe0f6]">
                <Logo size={28} className="shrink-0" />
              </div>
              <div className="hidden leading-tight sm:block">
                <div className="text-lg font-black text-[#102a4f]">Mini Maker Labs</div>
                <div className="text-xs font-semibold text-[#6f84a5]">{t('landing.nav.tagline')}</div>
              </div>
            </motion.div>
          )}
        </button>

        <div className="ml-2 flex-1">
          <XPBar xp={progress.xp} compact hideLabel={subPath === 'thinking' || subPath === 'safety'} />
        </div>

        <button
          onClick={() => setStatsOpen(true)}
          aria-label={t('stats.open')}
          title={t('stats.open')}
          className="flex shrink-0 cursor-pointer items-center gap-1 rounded-full border border-[#d4e2f6] bg-[#f6f9fe] px-2 py-1.5 transition hover:bg-[#edf4ff] sm:px-3"
        >
          <Star className="h-3.5 w-3.5 shrink-0 fill-[#f3b51b] text-[#f3b51b]" />
          <span className="text-sm font-bold text-[#315784]">{shownStars}</span>
        </button>

        <div className="flex shrink-0 overflow-hidden rounded-xl border border-[#d4e2f6] bg-[#f6f9fe] p-1">
          <button
            onClick={() => setLanguage('id')}
            className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-colors ${language === 'id' ? 'bg-[#153d73] text-white' : 'text-[#5e789d] hover:bg-white hover:text-[#153d73]'}`}
          >
            ES
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-colors ${language === 'en' ? 'bg-[#153d73] text-white' : 'text-[#5e789d] hover:bg-white hover:text-[#153d73]'}`}
          >
            EN
          </button>
        </div>
      </div>

      {statsOpen && (
        <StatsModal
          progress={progress}
          initialPath={currentPath ?? defaultStatsPath}
          currentPath={currentPath}
          onClose={() => setStatsOpen(false)}
        />
      )}
    </header>
  )
}
