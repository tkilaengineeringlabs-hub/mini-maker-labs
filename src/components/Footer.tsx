const REPO_URL = 'https://github.com/tkilaengineeringlabs-hub/mini-maker-labs'
const START_YEAR = 2026

function formatBuildDate(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`
}

export function Footer() {
  return (
    <footer className="border-t border-[#d8e5f7] bg-white/75 px-5 py-8 text-center">
      <div className="mx-auto max-w-2xl space-y-1 text-xs text-[#7b8fae]">
        <p>© {START_YEAR}–presente Mini Maker Labs</p>
        <p>Actualizado {formatBuildDate(__BUILD_DATE__)}</p>
        {__COMMIT_SHA__ && (
          <p className="font-mono">
            <a
              href={`${REPO_URL}/commit/${__COMMIT_SHA__}`}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#153d73]"
            >
              {__COMMIT_SHA__}
            </a>
            {' · '}
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#153d73]"
            >
              Código fuente
            </a>
          </p>
        )}
        <div className="pt-3 font-semibold text-[#97a8c0]">
          Aprende · Construye · Programa · Experimenta
        </div>
      </div>
    </footer>
  )
}
