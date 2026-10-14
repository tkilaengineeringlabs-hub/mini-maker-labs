const REPO_URL = 'https://github.com/tkilaengineeringlabs-hub/mini-maker-labs'
const START_YEAR = 2026

function formatBuildDate(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`
}

export function Footer() {
  return (
    <footer className="py-8 px-5 border-t border-white/[0.06] text-center">
      <div className="max-w-2xl mx-auto space-y-1 text-white/40 text-xs">
        <p>© {START_YEAR}–presente Mini Maker Labs</p>
        <p>Actualizado {formatBuildDate(__BUILD_DATE__)}</p>
        {__COMMIT_SHA__ && (
          <p className="font-mono">
            <a
              href={`${REPO_URL}/commit/${__COMMIT_SHA__}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/70 transition-colors"
            >
              {__COMMIT_SHA__}
            </a>
            {' · '}
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/70 transition-colors"
            >
              Código fuente
            </a>
          </p>
        )}
        <div className="pt-3 text-white/30">
          Aprende · Construye · Programa · Experimenta
        </div>
      </div>
    </footer>
  )
}
