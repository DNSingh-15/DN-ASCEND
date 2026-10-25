// Renders a ```flow fence from the .md notes as numbered boxes joined by arrows.
//
//   title: Optional caption
//   direction: right            (optional, default is top-to-bottom)
//   Client | browser or app     ("Title | small note")
//   > cache miss                (label on the arrow after the previous row)
//   App 1 || App 2 || App 3     (boxes side by side = one parallel row)

type Cell = { title: string; note: string };
type Row = { cells: Cell[]; label?: string };

function parse(source: string) {
  let title = "";
  let horizontal = false;
  const rows: Row[] = [];

  for (const raw of source.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const meta = line.match(/^(title|direction):\s*(.*)$/i);
    if (meta) {
      if (meta[1].toLowerCase() === "title") title = meta[2];
      else horizontal = /^(right|horizontal)/i.test(meta[2]);
      continue;
    }
    if (line.startsWith(">")) {
      if (rows.length) rows[rows.length - 1].label = line.slice(1).trim();
      continue;
    }
    const cells = line.split("||").map((part) => {
      const [t, ...rest] = part.split("|");
      return { title: t.trim(), note: rest.join("|").trim() };
    });
    rows.push({ cells });
  }
  return { title, horizontal, rows };
}

function Box({ cell, n }: { cell: Cell; n?: number }) {
  return (
    <div className="flex min-w-[9rem] max-w-xs flex-1 items-start gap-3 rounded-xl border border-indigo-300/70 bg-indigo-50 px-4 py-3 text-left shadow-sm dark:border-indigo-400/30 dark:bg-indigo-500/10">
      {n !== undefined && (
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
          {n}
        </span>
      )}
      <div className="min-w-0">
        <p className="font-semibold leading-snug text-slate-900 dark:text-slate-100">{cell.title}</p>
        {cell.note && <p className="mt-0.5 text-sm leading-snug text-slate-600 dark:text-slate-300">{cell.note}</p>}
      </div>
    </div>
  );
}

function Arrow({ label, horizontal }: { label?: string; horizontal: boolean }) {
  return (
    <div
      className={`flex items-center justify-center gap-2 text-indigo-500 ${horizontal ? "md:flex-col" : "py-1"}`}
      aria-hidden
    >
      <span className={`text-xl leading-none ${horizontal ? "rotate-90 md:rotate-0" : ""}`}>
        {horizontal ? "→" : "↓"}
      </span>
      {label && <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</span>}
    </div>
  );
}

export default function Flow({ source }: { source: string }) {
  const { title, horizontal, rows } = parse(source);
  if (!rows.length) return null;

  // Number only rows with a single box; a parallel row counts as one step.
  return (
    <figure className="not-prose my-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-6">
      {title && (
        <figcaption className="mb-4 text-center text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {title}
        </figcaption>
      )}
      <div className={`flex ${horizontal ? "flex-col items-stretch md:flex-row md:items-center md:justify-center" : "flex-col items-center"}`}>
        {rows.map((row, i) => (
          <div
            key={i}
            className={`flex ${horizontal ? "flex-col items-stretch md:flex-row md:items-center" : "w-full flex-col items-center"}`}
          >
            <div className={`flex w-full flex-wrap justify-center gap-3 ${horizontal ? "md:w-auto" : ""}`}>
              {row.cells.map((cell, j) => (
                <Box key={j} cell={cell} n={row.cells.length === 1 ? i + 1 : undefined} />
              ))}
            </div>
            {i < rows.length - 1 && <Arrow label={row.label} horizontal={horizontal} />}
          </div>
        ))}
      </div>
    </figure>
  );
}
