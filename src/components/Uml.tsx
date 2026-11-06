// Renders a ```uml fence from the .md notes as an SVG class diagram.
//
//   title: Optional caption
//   Account <<abstract>> | - balance: number | + deposit(amount): void
//   Savings | + addInterest(): void        (one class per line: "Name | member | member")
//   ---                                    (starts the next row of classes)
//   Savings --|> Account : is a            (relationship, optional ": label")
//
// Members with "(" are methods, the rest are attributes. Relationship arrows:
//   --|> inheritance   ..|> implements   --> association   ..> dependency
//   o-- aggregation    *-- composition   -- plain link   (diamond / marker sits on the left class for o-- and *--)

import { useId } from "react";

type Box = { name: string; stereo: string; attrs: string[]; methods: string[] };
type Placed = Box & { x: number; y: number; w: number; h: number };
type Rel = { from: string; to: string; kind: string; label: string };

const REL = /^(\w+)\s+(--\|>|\.\.\|>|-->|\.\.>|o--|\*--|--)\s+(\w+)(?:\s*:\s*(.*))?$/;

const CHAR_W = 7.3;
const LINE_H = 18;
const PAD = 12;
const MIN_GAP_X = 56;
const GAP_Y = 84;
const MARGIN = 24;

function parse(source: string) {
  let title = "";
  const rows: Box[][] = [[]];
  const rels: Rel[] = [];

  for (const raw of source.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const meta = line.match(/^title:\s*(.*)$/i);
    if (meta) {
      title = meta[1];
      continue;
    }
    if (/^-{3,}$/.test(line)) {
      if (rows[rows.length - 1].length) rows.push([]);
      continue;
    }
    const rel = line.match(REL);
    if (rel) {
      rels.push({ from: rel[1], kind: rel[2], to: rel[3], label: (rel[4] ?? "").trim() });
      continue;
    }
    const [head, ...members] = line.split("|").map((s) => s.trim());
    const stereo = head.match(/<<(.+?)>>/)?.[1] ?? "";
    const name = head.replace(/<<.+?>>/, "").trim();
    if (!name) continue;
    const clean = members.filter(Boolean);
    rows[rows.length - 1].push({
      name,
      stereo,
      attrs: clean.filter((m) => !m.includes("(")),
      methods: clean.filter((m) => m.includes("(")),
    });
  }
  return { title, rows: rows.filter((r) => r.length), rels };
}

function measure(b: Box) {
  const longest = Math.max(b.name.length, b.stereo.length + 4, ...b.attrs.map((a) => a.length), ...b.methods.map((m) => m.length));
  const w = Math.max(110, Math.ceil(longest * CHAR_W + PAD * 2));
  const headLines = b.stereo ? 2 : 1;
  const headH = headLines * LINE_H + PAD;
  const attrH = b.attrs.length ? b.attrs.length * LINE_H + PAD : 0;
  const methH = b.methods.length ? b.methods.length * LINE_H + PAD : 0;
  return { w, h: headH + attrH + methH, headH, attrH };
}

// Point where the line from this box's centre toward (tx, ty) leaves the box.
function edge(b: Placed, tx: number, ty: number) {
  const cx = b.x + b.w / 2;
  const cy = b.y + b.h / 2;
  const dx = tx - cx;
  const dy = ty - cy;
  if (dx === 0 && dy === 0) return { x: cx, y: cy };
  const t = Math.min(dx === 0 ? Infinity : b.w / 2 / Math.abs(dx), dy === 0 ? Infinity : b.h / 2 / Math.abs(dy));
  return { x: cx + dx * t, y: cy + dy * t };
}

const MARKERS: Record<string, { end?: string; start?: string; dashed?: boolean }> = {
  "--|>": { end: "tri" },
  "..|>": { end: "tri", dashed: true },
  "-->": { end: "arrow" },
  "..>": { end: "arrow", dashed: true },
  "o--": { start: "hollow" },
  "*--": { start: "solid" },
  "--": {},
};

export default function Uml({ source }: { source: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const { title, rows, rels } = parse(source);
  if (!rows.length) return null;

  // Side-by-side boxes need room for the longest arrow label between them.
  const longestLabel = Math.max(0, ...rels.map((r) => r.label.length));
  const GAP_X = Math.max(MIN_GAP_X, Math.ceil(longestLabel * 6.4) + 24);

  // Lay rows out top to bottom, each row centred horizontally.
  const sized = rows.map((row) => row.map((b) => ({ b, ...measure(b) })));
  const rowW = sized.map((row) => row.reduce((n, s) => n + s.w, 0) + GAP_X * (row.length - 1));
  const rowH = sized.map((row) => Math.max(...row.map((s) => s.h)));
  const width = Math.max(...rowW) + MARGIN * 2;
  const height = rowH.reduce((n, h) => n + h, 0) + GAP_Y * (rows.length - 1) + MARGIN * 2;

  const placed = new Map<string, Placed & { headH: number; attrH: number }>();
  let y = MARGIN;
  sized.forEach((row, r) => {
    let x = (width - rowW[r]) / 2;
    for (const s of row) {
      placed.set(s.b.name, { ...s.b, x, y, w: s.w, h: s.h, headH: s.headH, attrH: s.attrH });
      x += s.w + GAP_X;
    }
    y += rowH[r] + GAP_Y;
  });

  const id = (k: string) => `${uid}-${k}`;
  const stroke = "var(--diagram)";

  return (
    <figure className="not-prose glass my-6 rounded-2xl p-4 sm:p-6">
      {title && (
        <figcaption className="mb-3 text-center text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {title}
        </figcaption>
      )}
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={title || "UML class diagram"}
          className="mx-auto h-auto w-full"
          style={{ minWidth: Math.min(width, 560), maxWidth: width, fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" }}
        >
          <defs>
            <marker id={id("tri")} viewBox="0 0 14 12" refX="13" refY="6" markerWidth="14" markerHeight="12" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
              <path d="M0,0 L13,6 L0,12 z" fill="var(--bg)" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />
            </marker>
            <marker id={id("arrow")} viewBox="0 0 12 12" refX="11" refY="6" markerWidth="12" markerHeight="12" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
              <path d="M1,1 L11,6 L1,11" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
            </marker>
            <marker id={id("hollow")} viewBox="0 0 18 12" refX="17" refY="6" markerWidth="18" markerHeight="12" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
              <path d="M0,6 L8.5,0.5 L17,6 L8.5,11.5 z" fill="var(--bg)" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />
            </marker>
            <marker id={id("solid")} viewBox="0 0 18 12" refX="17" refY="6" markerWidth="18" markerHeight="12" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
              <path d="M0,6 L8.5,0.5 L17,6 L8.5,11.5 z" fill={stroke} stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />
            </marker>
          </defs>

          {rels.map((rel, i) => {
            const a = placed.get(rel.from);
            const b = placed.get(rel.to);
            if (!a || !b) return null;
            const p1 = edge(a, b.x + b.w / 2, b.y + b.h / 2);
            const p2 = edge(b, a.x + a.w / 2, a.y + a.h / 2);
            const m = MARKERS[rel.kind];
            return (
              <g key={i}>
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={stroke}
                  strokeWidth="1.5"
                  strokeDasharray={m.dashed ? "6 5" : undefined}
                  markerStart={m.start ? `url(#${id(m.start)})` : undefined}
                  markerEnd={m.end ? `url(#${id(m.end)})` : undefined}
                />
                {rel.label && (
                  <text
                    x={(p1.x + p2.x) / 2}
                    y={(p1.y + p2.y) / 2 - 6}
                    textAnchor="middle"
                    fontSize="11"
                    fill="currentColor"
                    className="text-slate-500 dark:text-slate-400"
                    style={{ paintOrder: "stroke", stroke: "var(--bg)", strokeWidth: 4, strokeLinejoin: "round" }}
                  >
                    {rel.label}
                  </text>
                )}
              </g>
            );
          })}

          {[...placed.values()].map((b) => {
            let ty = b.y + PAD / 2 + 13;
            return (
              <g key={b.name} fontSize="12.5">
                <rect
                  x={b.x}
                  y={b.y}
                  width={b.w}
                  height={b.h}
                  rx="8"
                  stroke={stroke}
                  strokeWidth="1.5"
                  style={{ fill: "color-mix(in srgb, var(--diagram) 9%, var(--bg))" }}
                />
                {b.stereo && (
                  <text x={b.x + b.w / 2} y={ty} textAnchor="middle" fontSize="11" fill="currentColor" opacity="0.6">
                    {`«${b.stereo}»`}
                  </text>
                )}
                <text
                  x={b.x + b.w / 2}
                  y={(ty += b.stereo ? LINE_H : 0)}
                  textAnchor="middle"
                  fontWeight="700"
                  fill="currentColor"
                  fontStyle={b.stereo === "abstract" ? "italic" : undefined}
                >
                  {b.name}
                </text>
                {b.attrs.length > 0 && (
                  <>
                    <line x1={b.x} x2={b.x + b.w} y1={b.y + b.headH} y2={b.y + b.headH} stroke={stroke} strokeOpacity="0.5" />
                    {b.attrs.map((m, i) => (
                      <text key={m} x={b.x + PAD} y={b.y + b.headH + PAD / 2 + 13 + i * LINE_H} fill="currentColor">
                        {m}
                      </text>
                    ))}
                  </>
                )}
                {b.methods.length > 0 && (
                  <>
                    <line
                      x1={b.x}
                      x2={b.x + b.w}
                      y1={b.y + b.headH + b.attrH}
                      y2={b.y + b.headH + b.attrH}
                      stroke={stroke}
                      strokeOpacity="0.5"
                    />
                    {b.methods.map((m, i) => (
                      <text key={m} x={b.x + PAD} y={b.y + b.headH + b.attrH + PAD / 2 + 13 + i * LINE_H} fill="currentColor">
                        {m}
                      </text>
                    ))}
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </figure>
  );
}
