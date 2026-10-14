import { motion } from 'framer-motion'
import { ArrowLeft, Star } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { XPBar } from './XPBar'
import { Logo } from './Logo'
import hubLogo from '../assets/landing/mini-maker-labs-logo.png'
import { StatsModal } from './StatsModal'
import type { PlayerProgress } from '../types'
import { getAllStats, type PathId } from '../utils/progressStats'
import { useLanguage } from '../i18n/LanguageProvider'

interface HeaderProps {
  progress: PlayerProgress
  light?: boolean
}

export function Header({ progress, light = false }: HeaderProps) {
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
    if (isLessonPage) {
      navigate(`/app/${subPath}/world/${pathParts[3]}`)
    } else if (isWorldPage) {
      navigate(`/app/${subPath}`)
    } else if (isSubHome) {
      navigate('/app')
    } else {
      navigate('/')
    }
  }

  return (
    <header className={`sticky top-0 z-30 backdrop-blur-md border-b ${light ? 'bg-white/95 border-[#CDEEF2]' : 'bg-[#0A0618]/80 border-purple-900/30'}`}>
      <div className={`max-w-6xl mx-auto px-4 py-3 flex items-center gap-3 ${light ? 'flex-wrap' : ''}`}>
        <button onClick={handleClick} aria-label={light ? t('path.back') : undefined} className={`flex items-center gap-2 group shrink-0 ${light ? 'min-h-11 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#087D8B]' : ''}`}>
          {showBack ? (
            <div className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors font-bold">
              <ArrowLeft className="w-5 h-5 shrink-0" />
              <span className="text-sm hidden sm:inline">
                {subPath === 'thinking' ? t('path.thinking.name') : subPath === 'safety' ? t('path.safety.name') : t('path.blocks.name')}
              </span>
            </div>
          ) : (
            <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {light ? <img src={hubLogo} width={704} height={303} alt={t('hub.brand')} className="h-auto w-24 sm:w-36" /> : <Logo size={32} className="shrink-0" />}
              {!light && <div className="leading-tight hidden sm:block">
                <div className="font-black text-lg text-white">Mini Maker Labs</div>
                <div className="text-xs font-semibold text-purple-300">{t('landing.nav.tagline')}</div>
              </div>}
            </motion.div>
          )}
        </button>

        <div className="flex-1 ml-2">
          <XPBar xp={progress.xp} light={light} compact hideLabel={subPath === 'thinking' || subPath === 'safety'} />
        </div>

        <button
          onClick={() => setStatsOpen(true)}
          aria-label={t('stats.open')}
          title={t('stats.open')}
          className={`flex items-center gap-1 border transition-colors px-2 sm:px-3 py-1.5 rounded-full shrink-0 cursor-pointer focus-visible:outline-2 ${light ? 'focus-visible:outline-[#087D8B]' : 'focus-visible:outline-blue-500'} ${light ? 'min-h-11 min-w-11 justify-center bg-[#ECFAFC] border-[#CDEEF2] hover:bg-[#CDEEF2] text-[#173644]' : 'bg-yellow-500/20 border-yellow-400/30 hover:bg-yellow-500/30 hover:border-yellow-400/50'}`}
        >
          <Star className={`w-3.5 h-3.5 shrink-0 ${light ? 'text-[#087D8B] fill-[#CDEEF2]' : 'text-yellow-300 fill-yellow-300'}`} />
          <span className={`font-bold text-sm ${light ? 'text-[#173644]' : 'text-yellow-200'}`}>{shownStars}</span>
        </button>

        <div className={`flex rounded-xl overflow-hidden border shrink-0 ${light ? 'border-[#CDEEF2]' : 'border-purple-800/40'}`}>
          <button
            onClick={() => setLanguage('id')}
            aria-pressed={language === 'id'}
            className={`px-2.5 py-1.5 text-xs font-bold transition-colors ${light ? 'min-h-11 min-w-11 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#087D8B]' : ''} ${light ? (language === 'id' ? 'bg-[#087D8B] text-white' : 'text-slate-600 hover:bg-[#ECFAFC]') : (language === 'id' ? 'bg-purple-600 text-white' : 'text-purple-300 hover:text-white hover:bg-purple-900/40')}`}
          >
            ES
          </button>
          <button
            onClick={() => setLanguage('en')}
            aria-pressed={language === 'en'}
            className={`px-2.5 py-1.5 text-xs font-bold transition-colors ${light ? 'min-h-11 min-w-11 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#087D8B]' : ''} ${light ? (language === 'en' ? 'bg-[#087D8B] text-white' : 'text-slate-600 hover:bg-[#ECFAFC]') : (language === 'en' ? 'bg-purple-600 text-white' : 'text-purple-300 hover:text-white hover:bg-purple-900/40')}`}
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
