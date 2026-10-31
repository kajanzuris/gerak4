import React from "react";
import { AbsoluteFill, Audio, Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";
import { Block, Stick, Bg, Prop } from "./VectorStory";
import type { StoryProps } from "./VectorStory";

// Tema "explainer": latar krem berbintik, header merek, judul 2 tingkat (kecil + besar) yang muncul per kata
// mengikuti suara, blok UI (jendela chat, dialog, folder, perbandingan, pohon) di tengah, maskot di bawah.
// Aktif bila scenes.src.json punya  "style": "explainer".

const { fontFamily: FONT } = loadFont("normal", { weights: ["400", "600", "800"], subsets: ["latin"] });

const C = { bg: "#f3efe6", ink: "#16161a", mute: "#6b665c", red: "#e5252a", blue: "#3b6fd8", green: "#1f9d8a", line: "#e2dccf", soft: "#efeadd" };
const FILE_COL = ["#2aa876", "#3b6fd8", "#7b4fd8", "#e5252a"];

// Warna kartu lewat CSS variable supaya satu komponen bisa tampil di tema "clean" (terang) maupun "hud" (kaca gelap).
// Nilai di belakang koma = tampilan tema clean.
const V = {
  cardBg: "var(--card-bg,#fff)",
  cardLine: "var(--card-line,#e2dccf)",
  cardInk: "var(--card-ink,#16161a)",
  cardShadow: "var(--card-shadow,0 10px 30px rgba(40,30,10,.10))",
  radius: "var(--card-radius,32px)",
  soft: "var(--soft,#efeadd)",
  row: "var(--row,#f4f1e8)",
  row2: "var(--row2,#f7f3ea)",
  note: "var(--note-bg,#fff3cf)",
  noteLine: "var(--note-line,#f1d98a)",
  ghost: "var(--btn-ghost,#e9e4d6)",
  mute: "var(--mute,#6b665c)",
  bar: "var(--bar,#cfc8b8)",
  callout: "var(--callout-bg,linear-gradient(180deg,#fff,#ffe9d6))",
};
const HUD_CYAN = "#22d3ee";
const HUD_ORANGE = "#ff7a1a";
const HUD_VARS = {
  "--card-bg": "rgba(8,22,50,.72)",
  "--card-line": "rgba(34,211,238,.55)",
  "--card-ink": "#e8f6ff",
  "--card-shadow": "0 0 28px rgba(34,211,238,.25), inset 0 0 22px rgba(34,211,238,.08)",
  "--card-radius": "20px",
  "--soft": "rgba(34,211,238,.16)",
  "--row": "rgba(34,211,238,.10)",
  "--row2": "rgba(34,211,238,.10)",
  "--note-bg": "rgba(255,122,26,.16)",
  "--note-line": "rgba(255,122,26,.6)",
  "--btn-ghost": "rgba(255,255,255,.14)",
  "--mute": "#9fb3d1",
  "--bar": "rgba(34,211,238,.45)",
  "--callout-bg": "linear-gradient(180deg,rgba(8,22,50,.88),rgba(60,28,8,.78))",
} as unknown as React.CSSProperties;

const TUT_VARS = {
  "--card-bg": "#ffffff",
  "--card-line": "#ffffff",
  "--card-ink": "#16161a",
  "--card-shadow": "0 10px 0 rgba(90,30,5,.55), 0 26px 44px rgba(60,15,0,.28)",
  "--card-radius": "22px",
} as unknown as React.CSSProperties;
const NEON_VARS = {
  "--card-bg": "linear-gradient(180deg, rgba(44,14,66,.92), rgba(20,6,38,.94))",
  "--card-line": "rgba(255,63,142,.85)",
  "--card-ink": "#ffffff",
  "--card-shadow": "0 0 26px rgba(255,63,142,.28)",
  "--card-radius": "20px",
  "--soft": "rgba(255,255,255,.10)",
  "--row": "rgba(255,255,255,.08)",
  "--row2": "rgba(255,255,255,.08)",
  "--note-bg": "rgba(255,178,31,.14)",
  "--note-line": "rgba(255,178,31,.55)",
  "--btn-ghost": "rgba(255,255,255,.16)",
  "--mute": "#b9a8c9",
  "--bar": "rgba(255,63,142,.45)",
  "--callout-bg": "linear-gradient(180deg,rgba(44,14,66,.92),rgba(80,20,60,.85))",
} as unknown as React.CSSProperties;

// ---- latar yang bisa dipilih (satu video boleh memakai beberapa, ganti otomatis tiap N adegan) ----
type Preset = { bg: string; pattern: "dots" | "grid" | "none"; dot: string; ink: string; mute: string };
const BG_PRESETS: Record<string, Preset> = {
  cream: { bg: "#f3efe6", pattern: "dots", dot: "#d9d2c1", ink: "#16161a", mute: "#6b665c" },
  mint: { bg: "#e6f4ee", pattern: "dots", dot: "#c5e3d6", ink: "#10261f", mute: "#4f6b60" },
  sky: { bg: "#e7f0fb", pattern: "dots", dot: "#c9dcf3", ink: "#10203a", mute: "#53647f" },
  sunset: { bg: "linear-gradient(180deg,#ffe3d0,#ffc9d8)", pattern: "none", dot: "transparent", ink: "#2a1420", mute: "#7a4d5c" },
  paper: { bg: "#ffffff", pattern: "none", dot: "transparent", ink: "#16161a", mute: "#6b665c" },
  grid: { bg: "#f6f4ee", pattern: "grid", dot: "#e3ded0", ink: "#16161a", mute: "#6b665c" },
  dark: { bg: "#14161d", pattern: "dots", dot: "#262a36", ink: "#ffffff", mute: "#a5acc0" },
  navy: { bg: "#0f2347", pattern: "dots", dot: "#1d3a6e", ink: "#ffffff", mute: "#b4c3e0" },
};
const bgStyle = (p: Preset): React.CSSProperties => {
  const imgs: string[] = [];
  const sizes: string[] = [];
  if (p.pattern === "dots") { imgs.push(`radial-gradient(${p.dot} 2px, transparent 2.5px)`); sizes.push("36px 36px"); }
  if (p.pattern === "grid") {
    imgs.push(`linear-gradient(${p.dot} 2px, transparent 2px)`, `linear-gradient(90deg, ${p.dot} 2px, transparent 2px)`);
    sizes.push("48px 48px", "48px 48px");
  }
  const isGrad = p.bg.startsWith("linear");
  if (isGrad) { imgs.push(p.bg); sizes.push("100% 100%"); }
  return { backgroundColor: isGrad ? undefined : p.bg, backgroundImage: imgs.length ? imgs.join(",") : undefined, backgroundSize: sizes.length ? sizes.join(",") : undefined };
};

// ---- transisi antar adegan: adegan lama KELUAR sambil adegan baru MASUK (durasi TD detik) ----
const TRANS = ["fade", "slide-left", "slide-up", "zoom", "wipe", "none"];
const TD = 0.45;
const easeIO = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
const transPair = (kind: string, k: number): { inn: React.CSSProperties; out: React.CSSProperties } => {
  const e = easeIO(Math.max(0, Math.min(1, k)));
  switch (kind) {
    case "fade": return { inn: { opacity: e }, out: { opacity: 1 - e } };
    case "slide-left": return { inn: { transform: `translateX(${(1 - e) * 1080}px)` }, out: { transform: `translateX(${-e * 1080}px)` } };
    case "slide-up": return { inn: { transform: `translateY(${(1 - e) * 1300}px)` }, out: { transform: `translateY(${-e * 1300}px)` } };
    case "zoom": return { inn: { opacity: e, transform: `scale(${0.85 + 0.15 * e})` }, out: { opacity: 1 - e, transform: `scale(${1 + 0.15 * e})` } };
    case "wipe": return { inn: { clipPath: `inset(0 ${(1 - e) * 100}% 0 0)` }, out: {} };
    default: return { inn: {}, out: {} };
  }
};

type Pose = React.ComponentProps<typeof Block>["pose"];
type W = { w: string; hl: boolean; a: number; b: number; s: number };
type Row = {
  k: "bubble" | "check" | "input" | "note" | "buttons" | "files";
  text?: string;
  from?: "user" | "bot";
  state?: "done" | "busy" | "todo";
  items?: string[];
  groups?: string[];
  n?: number;
  at?: string | number; // kata (dari title) atau detik relatif awal adegan
};
type Col = { title: string; tone?: string; items: string[] };
type TreeCol = { head: string; mid?: string; tag?: string; low?: string };
type TLine = { k?: "cmd" | "out" | "ok" | "err" | "dim"; text: string };
type Notif = { text: string; sub?: string; value?: string; icon?: string };
type IconDef = { glyph?: string; src?: string; label?: string; bg?: string };
type Item = {
  type: "window" | "compare" | "tree" | "files" | "dialog" | "callout" | "list" | "stat" | "image" | "meter" | "bars" | "terminal" | "browser" | "phone" | "chip" | "tiles" | "kpi" | "notifs" | "icons" | "profile" | "brand";
  url?: string; // browser: alamat
  lines?: TLine[]; // terminal: baris perintah / keluaran
  icon?: string; // chip, kpi, browser, profile: glyph pada ikon
  tag?: string; // chip, kpi: label kecil di kanan
  tab?: number; // browser: tab terpilih
  big?: boolean; // kpi: angka besar di tengah
  notifs?: Notif[]; // notifs
  icons?: IconDef[]; // icons
  pct?: number;
  bars?: { label: string; value: number }[];
  hi?: number;
  src?: string;
  caption?: string;
  h?: number;
  frame?: boolean;
  fit?: "cover" | "contain";
  hold?: boolean;
  at?: string | number;
  title?: string;
  tone?: string;
  rows?: Row[];
  items?: string[];
  left?: Col;
  right?: Col;
  cols?: TreeCol[];
  text?: string;
  sub?: string;
  buttons?: string[];
  cta?: string;
  value?: string;
  label?: string;
  n?: number;
  groups?: string[];
};
type Scene = { title: string; start: number; small?: number; pose?: string; mascot?: "left" | "center" | "right"; stage?: Item[]; transition?: string; bg?: string; label?: string; prop?: string; step?: string; orb?: "big" | "small" | "hide" };
type Data = {
  durationInFrames: number;
  theme?: "clean" | "hud" | "classic" | "tutorial" | "neon";
  brand?: string;
  tag?: string;
  accent?: string;
  char?: string;
  charColor?: string;
  charStyle?: "block" | "stick" | "sprite" | "orb";
  charImg?: string;
  charTalkImg?: string;
  header?: boolean;
  handle?: string; // tema tutorial: akun di dasar layar
  stepLabel?: string; // tema tutorial: kata di lencana langkah (default "Langkah")
  textColor?: string;
  transitions?: string[];
  transitionsMode?: "cycle" | "random";
  backgrounds?: string[];
  bgMode?: "single" | "auto";
  bgEvery?: number;
  cta?: string;
  words?: W[];
  env?: number[];
  scenes: Scene[];
};

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, "");

type Cx = { ws: W[]; base: number; t: number; accent: string; name: string; ink: string; mute: string; theme: "clean" | "hud" | "classic" | "tutorial" | "neon"; hl?: string };
const Ctx = React.createContext<Cx>({ ws: [], base: 0, t: 0, accent: C.red, name: "", ink: C.ink, mute: C.mute, theme: "clean" });

// waktu (detik, absolut) kapan sebuah elemen muncul: kata tertentu di title, detik relatif, atau default
// Anti-layar-kosong: dibatasi maksimal 0.45s dari awal adegan agar penonton langsung melihat visual
const resolveT = (at: string | number | undefined, cx: Cx, fallback: number) => {
  if (typeof at === "number") return cx.base + Math.min(0.45, at);
  if (typeof at === "string") {
    const k = norm(at);
    const h = k ? cx.ws.find((w) => norm(w.w).startsWith(k)) : undefined;
    if (h) return Math.min(h.a, cx.base + 0.45);
  }
  return cx.base + Math.min(0.45, fallback);
};

const card: React.CSSProperties = {
  background: V.cardBg,
  borderRadius: V.radius,
  boxShadow: V.cardShadow,
  border: `2px solid ${V.cardLine}`,
  fontFamily: FONT,
  color: V.cardInk,
  overflow: "hidden",
};

const Appear: React.FC<{ t0: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ t0, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { theme } = React.useContext(Ctx);

  // Waktu berlalu sejak elemen mulai muncul
  const elapsed = frame - Math.round(t0 * fps);

  // Animasi masuk: Spring dinamis dengan sedikit pop/overshoot (bouncy)
  const s = clamp01(spring({ frame: elapsed, fps, config: { damping: 13, stiffness: 170, mass: 0.85 } }));

  // Animasi mengambang lembut (idle floating/breathing) setelah objek stabil agar video tidak kaku/mati
  const tLive = Math.max(0, elapsed / fps);
  const isSettled = elapsed > Math.round(0.35 * fps);
  const floatY = isSettled ? Math.sin(tLive * 2.2) * 4 : 0;
  const tiltDeg = theme === "classic" && !isSettled ? (1 - s) * -2 : 0;
  const hudFilter = theme === "hud" ? "drop-shadow(0 0 18px rgba(34, 211, 238, 0.2))" : theme === "neon" ? "drop-shadow(0 0 16px rgba(255, 63, 142, 0.18))" : undefined;

  return (
    <div
      style={{
        opacity: clamp01(s * 1.8),
        transform: `translateY(${(1 - s) * 28 + floatY}px) scale(${0.91 + 0.09 * s}) rotate(${tiltDeg}deg)`,
        transformOrigin: "center center",
        filter: hudFilter,
        ...style
      }}
    >
      {children}
    </div>
  );
};

const Check = () => (
  <svg width={22} height={22} viewBox="0 0 24 24">
    <path d="M5 12.5l4.5 4.5L19 7.5" stroke="#fff" strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Arrow = () => (
  <svg width={26} height={26} viewBox="0 0 24 24">
    <path d="M4 12h15M13 6l6 6-6 6" stroke="#fff" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Trash = () => (
  <svg width={46} height={52} viewBox="0 0 46 52">
    <rect x={6} y={14} width={34} height={34} rx={6} fill={C.red} />
    <rect x={2} y={8} width={42} height={6} rx={3} fill={C.red} />
    <rect x={16} y={2} width={14} height={6} rx={3} fill={C.red} />
    <rect x={14} y={20} width={4} height={22} rx={2} fill="#fff" />
    <rect x={21} y={20} width={4} height={22} rx={2} fill="#fff" />
    <rect x={28} y={20} width={4} height={22} rx={2} fill="#fff" />
  </svg>
);
const FileIcon: React.FC<{ i: number; s?: number }> = ({ i, s = 44 }) => (
  <svg width={s} height={s * 1.2} viewBox="0 0 40 48">
    <rect x={2} y={2} width={36} height={44} rx={7} fill="#fff" stroke={FILE_COL[i % 4]} strokeWidth={3} />
    <rect x={9} y={12} width={22} height={14} rx={3} fill={FILE_COL[i % 4]} opacity={0.85} />
    <rect x={9} y={32} width={14} height={5} rx={2} fill="#d6d0c2" />
  </svg>
);

const Btn: React.FC<{ label: string; main?: boolean }> = ({ label, main }) => {
  const { accent } = React.useContext(Ctx);
  return (
    <div style={{ padding: "14px 32px", borderRadius: 22, fontSize: 28, fontWeight: 800, background: main ? accent : V.ghost, color: main ? "#fff" : V.mute }}>{label}</div>
  );
};

const FilesGrid: React.FC<{ n: number; groups?: string[]; t0: number }> = ({ n, groups, t0 }) => {
  const { t } = React.useContext(Ctx);
  if (groups && groups.length) {
    return (
      <div style={{ display: "flex", gap: 18, justifyContent: "center" }}>
        {groups.map((g, gi) => (
          <div key={g} style={{ flex: 1, border: `3px dashed ${FILE_COL[gi % 4]}`, borderRadius: 20, padding: "14px 10px", textAlign: "center", opacity: clamp01((t - t0 - gi * 0.25) * 3), fontFamily: FONT }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 4 }}>
              {[0, 1, 2].map((j) => <FileIcon key={j} i={gi} s={30} />)}
            </div>
            <div style={{ fontWeight: 800, fontSize: 26, color: FILE_COL[gi % 4] }}>{g}</div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(8,1fr)", gap: "10px 6px", justifyItems: "center" }}>
      {Array.from({ length: n }, (_, i) => (
        <div key={i} style={{ opacity: clamp01((t - t0 - i * 0.02) * 6), transform: `translate(${Math.sin(i * 7.3) * 8}px,${Math.cos(i * 3.1) * 8}px) rotate(${Math.sin(i * 5.7) * 14}deg)` }}>
          <FileIcon i={i} s={42} />
        </div>
      ))}
    </div>
  );
};

const RowView: React.FC<{ r: Row; t0: number }> = ({ r, t0 }) => {
  const { t, accent } = React.useContext(Ctx);
  let body: React.ReactNode = null;
  if (r.k === "bubble") {
    const user = r.from === "user";
    body = (
      <div style={{ display: "flex", justifyContent: user ? "flex-end" : "flex-start", gap: 12, alignItems: "flex-start" }}>
        {!user && (
          <div style={{ width: 46, height: 46, borderRadius: 23, background: "#dfe8ff", color: C.blue, fontWeight: 800, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>AI</div>
        )}
        <div style={{ maxWidth: "78%", padding: "16px 22px", borderRadius: 24, fontSize: 28, fontWeight: 600, lineHeight: 1.3, background: user ? accent : V.soft, color: user ? "#fff" : V.cardInk }}>{r.text}</div>
      </div>
    );
  } else if (r.k === "check") {
    const st = r.state || "done";
    body = (
      <div style={{ display: "flex", alignItems: "center", gap: 16, background: V.row, borderRadius: 18, padding: "12px 18px" }}>
        {st === "done" ? (
          <div style={{ width: 34, height: 34, borderRadius: 17, background: C.green, display: "flex", alignItems: "center", justifyContent: "center" }}><Check /></div>
        ) : st === "busy" ? (
          <div style={{ width: 34, height: 34, borderRadius: 17, border: `4px solid ${V.cardLine}`, borderTopColor: C.green, boxSizing: "border-box", transform: `rotate(${t * 540}deg)` }} />
        ) : (
          <div style={{ width: 34, height: 34, borderRadius: 17, border: `4px solid ${V.cardLine}`, boxSizing: "border-box" }} />
        )}
        <div style={{ fontSize: 28, fontWeight: 600 }}>{r.text}</div>
      </div>
    );
  } else if (r.k === "input") {
    const full = r.text || "";
    const n = Math.floor(Math.max(0, t - t0 - 0.25) * 18);
    const cursor = n < full.length || Math.floor(t * 2) % 2 === 0 ? "|" : "";
    body = (
      <div style={{ display: "flex", alignItems: "center", gap: 12, border: `3px solid ${C.green}`, borderRadius: 40, padding: "10px 12px 10px 26px", background: V.cardBg }}>
        <div style={{ flex: 1, fontSize: 28, fontWeight: 600, minHeight: 40, display: "flex", alignItems: "center" }}>{full.slice(0, n)}{cursor}</div>
        <div style={{ width: 54, height: 54, borderRadius: 27, background: accent, display: "flex", alignItems: "center", justifyContent: "center" }}><Arrow /></div>
      </div>
    );
  } else if (r.k === "note") {
    body = (
      <div style={{ background: V.note, border: `2px solid ${V.noteLine}`, borderRadius: 22, padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div style={{ fontSize: 28, fontWeight: 600, flex: 1 }}>{r.text}</div>
        {(r.items || []).map((it, i, a) => <Btn key={i} label={it} main={i === a.length - 1} />)}
      </div>
    );
  } else if (r.k === "buttons") {
    body = (
      <div style={{ display: "flex", gap: 14, justifyContent: "flex-end" }}>
        {(r.items || []).map((it, i, a) => <Btn key={i} label={it} main={i === a.length - 1} />)}
      </div>
    );
  } else if (r.k === "files") {
    body = <FilesGrid n={r.n || 18} groups={r.groups} t0={t0} />;
  }
  return <Appear t0={t0}>{body}</Appear>;
};

const WindowView: React.FC<{ b: Item; t0: number }> = ({ b, t0 }) => {
  const cx = React.useContext(Ctx);
  const tone = b.tone || C.blue;
  return (
    <Appear t0={t0}>
      <div style={card}>
        <div style={{ background: `${tone}26`, padding: "16px 24px", display: "flex", alignItems: "center", gap: 12 }}>
          {["#ff6159", "#ffbd2e", "#27c93f"].map((c) => <div key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />)}
          <div style={{ marginLeft: 10, fontWeight: 800, fontSize: 28, color: tone }}>{b.title}</div>
        </div>
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          {(b.rows || []).map((r, i) => <RowView key={i} r={r} t0={resolveT(r.at, cx, (t0 - cx.base) + 0.4 + i * 0.45)} />)}
        </div>
      </div>
    </Appear>
  );
};

const CompareView: React.FC<{ b: Item; t0: number }> = ({ b, t0 }) => (
  <div style={{ display: "flex", gap: 24, width: "100%" }}>
    {[b.left, b.right].map((c, ci) => {
      if (!c) return null;
      const tone = c.tone || (ci ? C.green : C.blue);
      return (
        <Appear key={ci} t0={t0 + ci * 0.25} style={{ flex: 1 }}>
          <div style={card}>
            <div style={{ background: tone, color: "#fff", fontWeight: 800, fontSize: 30, padding: "16px 0", textAlign: "center", letterSpacing: 1 }}>{c.title}</div>
            <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 14 }}>
              {c.items.map((it, k) => (
                <Appear key={k} t0={t0 + ci * 0.25 + 0.4 + k * 0.3}>
                  <div style={{ background: `${tone}22`, borderRadius: 18, padding: "14px 18px", fontSize: 26, fontWeight: 600 }}>{it}</div>
                </Appear>
              ))}
            </div>
          </div>
        </Appear>
      );
    })}
  </div>
);

const TreeView: React.FC<{ b: Item; t0: number }> = ({ b, t0 }) => (
  <div style={{ display: "flex", gap: 20, width: "100%", fontFamily: FONT }}>
    {(b.cols || []).map((c, i) => (
      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Appear t0={t0 + i * 0.15} style={{ width: "100%" }}>
          <div style={{ ...card, borderRadius: 18, padding: "14px 0", textAlign: "center", fontWeight: 800, fontSize: 28 }}>{c.head}</div>
        </Appear>
        {c.mid ? (
          <>
            <div style={{ width: 3, height: 26, background: V.cardLine }} />
            <Appear t0={t0 + 0.5 + i * 0.15} style={{ width: "100%" }}>
              <div style={{ ...card, borderRadius: 18, border: `3px solid ${C.blue}`, padding: "14px 0", textAlign: "center", fontWeight: 800, fontSize: 28 }}>
                {c.mid}
                {c.tag ? <div style={{ display: "inline-block", marginLeft: 8, background: C.blue, color: "#fff", borderRadius: 12, padding: "2px 12px", fontSize: 20 }}>{c.tag}</div> : null}
              </div>
            </Appear>
          </>
        ) : null}
        {c.low ? (
          <>
            <div style={{ width: 3, height: 26, background: V.cardLine }} />
            <Appear t0={t0 + 1.0 + i * 0.15} style={{ width: "100%" }}>
              <div style={{ ...card, borderRadius: 18, padding: "14px 0", textAlign: "center", fontWeight: 600, fontSize: 26 }}>{c.low}</div>
            </Appear>
          </>
        ) : null}
      </div>
    ))}
  </div>
);

const DialogView: React.FC<{ b: Item; t0: number }> = ({ b, t0 }) => (
  <Appear t0={t0}>
    <div style={card}>
      <div style={{ background: V.note, padding: "16px 24px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: 20, background: "#f5a623", color: "#fff", fontWeight: 800, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>!</div>
        <div style={{ fontWeight: 800, fontSize: 28 }}>{b.title}</div>
      </div>
      <div style={{ padding: "30px 28px", textAlign: "center" }}>
        <div style={{ fontSize: 38, fontWeight: 800 }}>{b.text}</div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 20, margin: "26px 0 10px" }}>
          {[0, 1, 2].map((i) => <FileIcon key={i} i={i} s={44} />)}
          <svg width={40} height={24} viewBox="0 0 40 24"><path d="M2 12h32M26 4l8 8-8 8" stroke={C.mute} strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <Trash />
        </div>
        {b.sub ? <div style={{ fontSize: 22, color: V.mute }}>{b.sub}</div> : null}
        <div style={{ display: "flex", gap: 18, justifyContent: "center", marginTop: 26 }}>
          {(b.buttons || []).map((x, i, a) => <Btn key={i} label={x} main={i === a.length - 1} />)}
        </div>
      </div>
    </div>
  </Appear>
);

const CalloutView: React.FC<{ b: Item; t0: number }> = ({ b, t0 }) => {
  const { accent } = React.useContext(Ctx);
  return (
    <Appear t0={t0}>
      <div style={{ ...card, padding: "48px 40px", textAlign: "center", background: V.callout }}>
        <div style={{ fontSize: 64, fontWeight: 800, color: accent, letterSpacing: 1 }}>{b.title}</div>
        {b.sub ? <div style={{ fontSize: 28, color: V.mute, margin: "12px 0 28px" }}>{b.sub}</div> : null}
        {b.cta ? <div style={{ display: "inline-block", background: accent, color: "#fff", borderRadius: 40, padding: "14px 36px", fontWeight: 800, fontSize: 30 }}>{b.cta}</div> : null}
      </div>
    </Appear>
  );
};

const ListView: React.FC<{ b: Item; t0: number }> = ({ b, t0 }) => {
  const { accent } = React.useContext(Ctx);
  const items = b.items || [];
  return (
    <Appear t0={t0}>
      <div style={card}>
        <div style={{ background: accent, color: "#fff", fontWeight: 800, fontSize: 34, padding: "18px 28px" }}>{b.title}</div>
        <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
          {items.map((it, i) => (
            <Appear key={i} t0={t0 + 0.35 + i * 0.3}>
              <div style={{ display: "flex", alignItems: "center", gap: 18, background: V.row2, borderRadius: 20, padding: "14px 18px" }}>
                <div style={{ width: 48, height: 48, borderRadius: 24, background: C.green, color: "#fff", fontWeight: 800, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
                <div style={{ fontSize: 30, fontWeight: 600 }}>{it}</div>
              </div>
            </Appear>
          ))}
          {b.cta ? (
            <Appear t0={t0 + 0.5 + items.length * 0.3}>
              <div style={{ background: C.green, color: "#fff", borderRadius: 40, padding: "16px 0", textAlign: "center", fontWeight: 800, fontSize: 30 }}>{b.cta}</div>
            </Appear>
          ) : null}
        </div>
      </div>
    </Appear>
  );
};

const StatView: React.FC<{ b: Item; t0: number }> = ({ b, t0 }) => {
  const { t, accent } = React.useContext(Ctx);
  const m = (b.value || "").match(/[\d.,]+/);
  const num = m ? parseFloat(m[0].replace(",", ".")) : NaN;
  const k = clamp01((t - t0) / 1.2);
  const shown = m && !isNaN(num) ? (b.value || "").replace(m[0], String(Math.round(num * k))) : b.value;
  return (
    <Appear t0={t0}>
      <div style={{ ...card, padding: "40px 30px", textAlign: "center" }}>
        <div style={{ fontSize: 190, fontWeight: 800, color: accent, lineHeight: 1 }}>{shown}</div>
        <div style={{ fontSize: 44, fontWeight: 600, marginTop: 12 }}>{b.label}</div>
      </div>
    </Appear>
  );
};

const ImageView: React.FC<{ b: Item; t0: number }> = ({ b, t0 }) => {
  const { t, name, mute: pageMute } = React.useContext(Ctx);
  const still = b.fit === "contain" || b.hold; // screenshot / gambar yang bertahan antar adegan: jangan di-zoom
  const zoom = still ? 1 : 1 + 0.06 * clamp01((t - t0) / 6); // zoom pelan supaya gambar diam tidak terasa mati
  if (b.frame === false) {
    // gambar transparan (produk/karakter): tanpa kartu, utuh (contain), melayang pelan + bayangan
    return (
      <Appear t0={t0}>
        <div style={{ height: b.h || 760, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {b.src ? (
            <Img src={staticFile(`${name}/${b.src}`)} style={{ maxWidth: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 18px 24px rgba(0,0,0,.25))", transform: `translateY(${Math.sin(t * 2) * 8}px)` }} />
          ) : null}
        </div>
        {b.caption ? <div style={{ fontSize: 28, fontWeight: 600, textAlign: "center", marginTop: 8, color: pageMute }}>{b.caption}</div> : null}
      </Appear>
    );
  }
  return (
    <Appear t0={t0}>
      <div style={{ ...card, padding: 14 }}>
        <div style={{ height: b.h || 640, borderRadius: 22, overflow: "hidden", background: V.soft }}>
          {b.src ? <Img src={staticFile(`${name}/${b.src}`)} style={{ width: "100%", height: "100%", objectFit: b.fit === "contain" ? "contain" : "cover", transform: `scale(${zoom})` }} /> : null}
        </div>
        {b.caption ? <div style={{ fontSize: 28, fontWeight: 600, textAlign: "center", margin: "14px 0 4px", color: V.mute }}>{b.caption}</div> : null}
      </div>
    </Appear>
  );
};

const MeterView: React.FC<{ b: Item; t0: number }> = ({ b, t0 }) => {
  const { t, accent } = React.useContext(Ctx);
  const v = Math.max(0, Math.min(100, b.pct ?? 0));
  const k = clamp01((t - t0) / 1.2);
  const cells = 20;
  const filled = Math.round(cells * (v / 100) * k);
  return (
    <Appear t0={t0}>
      <div style={{ ...card, padding: "22px 26px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 30, letterSpacing: 1 }}>
          <span>{b.title}</span>
          <span style={{ color: accent }}>{Math.round(v * k)}%</span>
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 16 }}>
          {Array.from({ length: cells }, (_, i) => (
            <div key={i} style={{ flex: 1, height: 34, borderRadius: 6, background: i < filled ? accent : "rgba(128,128,128,.25)" }} />
          ))}
        </div>
        {b.label ? <div style={{ fontSize: 24, color: V.mute, marginTop: 12 }}>{b.label}</div> : null}
      </div>
    </Appear>
  );
};

const BarsView: React.FC<{ b: Item; t0: number }> = ({ b, t0 }) => {
  const { t, accent } = React.useContext(Ctx);
  const items = (b.bars || []).slice(0, 6);
  const hi = b.hi ?? items.length - 1;
  const H = 360;
  return (
    <Appear t0={t0}>
      <div style={{ ...card, padding: "26px 26px 18px" }}>
        {b.title ? <div style={{ fontWeight: 800, fontSize: 30, marginBottom: 16 }}>{b.title}</div> : null}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: H }}>
          {items.map((it, i) => {
            const k = clamp01((t - t0 - i * 0.18) / 0.7);
            const e = 1 - Math.pow(1 - k, 3);
            const h = Math.max(8, (Math.max(0, Math.min(100, it.value)) / 100) * (H - 40)) * e;
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", height: "100%" }}>
                <div style={{ width: "100%", height: h, borderRadius: "10px 10px 0 0", background: i === hi ? accent : V.bar, boxShadow: i === hi ? `0 0 22px ${accent}88` : undefined }} />
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 10 }}>
          {items.map((it, i) => <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 22, color: V.mute, fontWeight: 600 }}>{it.label}</div>)}
        </div>
      </div>
    </Appear>
  );
};

// ================= BLOK BARU: TUTORIAL (ved1) & NEON (ved2) =================
// Semua blok di bawah murni tambahan; blok lama tidak diubah.
const TONE2 = "#ffb21f";
const TERM_COL: Record<string, string> = { cmd: "#e8eaf0", out: "#9aa3b5", ok: "#4ade80", err: "#ff6b6b", dim: "#6b7385" };

// teks hitam/putih yang terbaca di atas warna tertentu
const fgOn = (hex: string) => {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return "#ffffff";
  const n = parseInt(m[1], 16);
  const y = ((n >> 16) & 255) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114;
  return y > 150 ? "#1a0a00" : "#ffffff";
};

// angka naik: "+1.284", "US$ 11.876", "87%"; pemisah ribuan (titik/koma) dipertahankan
const countText = (value: string, k: number): string => {
  const m = value.match(/\d[\d.,]*/);
  if (!m) return value;
  const tok = m[0].replace(/[.,]+$/, "");
  const thousands = /^\d{1,3}([.,]\d{3})+$/.test(tok);
  const sep = thousands ? (tok.match(/[.,]/) as RegExpMatchArray)[0] : "";
  const target = thousands ? parseInt(tok.replace(/[.,]/g, ""), 10) : parseFloat(tok.replace(",", "."));
  if (isNaN(target)) return value;
  const e = 1 - Math.pow(1 - clamp01(k), 3);
  const cur = target * e;
  let out: string;
  if (thousands) out = String(Math.round(cur)).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
  else {
    const dec = (tok.split(/[.,]/)[1] || "").length;
    out = dec ? cur.toFixed(dec) : String(Math.round(cur));
  }
  return value.replace(tok, out);
};

const IconTile: React.FC<{ glyph?: string; fallback?: string; tone: string; size?: number }> = ({ glyph, fallback, tone, size = 64 }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.28, background: tone, color: fgOn(tone), display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: size * 0.5, flexShrink: 0, fontFamily: FONT }}>
    {glyph || fallback || ""}
  </div>
);

const Dots: React.FC = () => (
  <>
    {["#ff6159", "#ffbd2e", "#27c93f"].map((c) => <div key={c} style={{ width: 15, height: 15, borderRadius: 8, background: c }} />)}
  </>
);

// terminal: perintah diketik huruf demi huruf, keluaran muncul berurutan
const TermView: React.FC<{ b: Item; t0: number }> = ({ b, t0 }) => {
  const { t } = React.useContext(Ctx);
  let cursorT = t0 + 0.4;
  const sched = (b.lines || []).slice(0, 8).map((l) => {
    const kind = l.k || (l.text.trim().startsWith("$") ? "cmd" : "out");
    const dur = kind === "cmd" ? Math.min(1.6, Math.max(0.4, l.text.length / 40)) : 0.2;
    const s = { l, kind, start: cursorT, dur };
    cursorT += dur + (kind === "cmd" ? 0.3 : 0.15);
    return s;
  });
  return (
    <Appear t0={t0}>
      <div style={{ ...card, background: "#15171e", border: "2px solid #2b2f3b", color: "#e8eaf0" }}>
        <div style={{ background: "#232733", padding: "16px 24px", display: "flex", alignItems: "center", gap: 10 }}>
          <Dots />
          <div style={{ marginLeft: 12, fontFamily: MONO, fontSize: 22, color: "#9aa3b5" }}>{b.title || "Terminal"}</div>
        </div>
        <div style={{ padding: "26px 28px", minHeight: b.h || 420, fontFamily: MONO, fontSize: 27, lineHeight: 1.55, wordBreak: "break-all", whiteSpace: "pre-wrap" }}>
          {sched.map((s, i) => {
            if (t < s.start) return null;
            const full = s.l.text;
            const n = s.kind === "cmd" ? Math.min(full.length, Math.floor(((t - s.start) / s.dur) * full.length)) : full.length;
            const typing = s.kind === "cmd" && n < full.length;
            const isLast = i === sched.length - 1;
            const cur = typing || (isLast && s.kind === "cmd") ? (Math.floor(t * 2.5) % 2 === 0 ? "\u258C" : " ") : "";
            const shown = full.slice(0, n);
            const prompt = s.kind === "cmd" && shown.startsWith("$");
            return (
              <div key={i} style={{ color: TERM_COL[s.kind] }}>
                {prompt ? <span style={{ color: "#4ade80" }}>$</span> : null}
                {prompt ? shown.slice(1) : shown}
                {cur}
              </div>
            );
          })}
        </div>
      </div>
    </Appear>
  );
};

// jendela browser: address bar, judul situs, tab (Windows | Mac), blok kode, tombol Copy yang "ditekan"
const BrowserView: React.FC<{ b: Item; t0: number }> = ({ b, t0 }) => {
  const { t } = React.useContext(Ctx);
  const tabs = b.items || [];
  const press = t > t0 + 1.2 && t < t0 + 1.45;
  return (
    <Appear t0={t0}>
      <div style={{ ...card, background: "#ffffff", color: "#16161a", border: "2px solid #e6e6ea" }}>
        <div style={{ background: "#eceef2", padding: "14px 22px", display: "flex", alignItems: "center", gap: 14 }}>
          <Dots />
          <div style={{ flex: 1, background: "#fff", borderRadius: 20, padding: "8px 18px", fontSize: 24, fontWeight: 600, color: "#555b66", display: "flex", alignItems: "center", gap: 10, overflow: "hidden", whiteSpace: "nowrap" }}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#8a909c" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
            {b.url}
          </div>
        </div>
        <div style={{ padding: "30px 32px", minHeight: b.h || 380 }}>
          {b.title ? (
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22 }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: "#16161a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 800 }}>{b.icon || b.title.slice(0, 1)}</div>
              <div style={{ fontSize: 40, fontWeight: 800 }}>{b.title}</div>
            </div>
          ) : null}
          {b.sub ? <div style={{ fontSize: 26, color: "#6b7280", marginBottom: 18 }}>{b.sub}</div> : null}
          {tabs.length ? (
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {tabs.map((x, i) => (
                <div key={i} style={{ padding: "8px 22px", borderRadius: 10, fontSize: 24, fontWeight: 700, background: i === (b.tab ?? 0) ? "#16161a" : "#eceef2", color: i === (b.tab ?? 0) ? "#fff" : "#555b66" }}>{x}</div>
              ))}
            </div>
          ) : null}
          {b.text ? <div style={{ background: "#1b1d24", color: "#e8eaf0", borderRadius: 14, padding: "20px 22px", fontFamily: MONO, fontSize: 24, lineHeight: 1.5, wordBreak: "break-all" }}>{b.text}</div> : null}
          {b.cta ? <div style={{ display: "inline-block", marginTop: 18, background: "#16161a", color: "#fff", borderRadius: 10, padding: "10px 28px", fontSize: 24, fontWeight: 700, transform: press ? "scale(.92)" : "scale(1)" }}>{b.cta}</div> : null}
        </div>
      </div>
    </Appear>
  );
};

// layar HP dengan chat (rows: bubble dari "user" / "bot")
const PhoneView: React.FC<{ b: Item; t0: number }> = ({ b, t0 }) => {
  const rows = (b.rows || []).slice(0, 6);
  return (
    <Appear t0={t0}>
      <div style={{ width: 480, height: b.h || 820, margin: "0 auto", borderRadius: 60, border: "12px solid #0e0f13", background: "#c8e0b2", boxShadow: V.cardShadow, overflow: "hidden", display: "flex", flexDirection: "column", fontFamily: FONT }}>
        <div style={{ background: "#5f87b0", padding: "34px 22px 16px", display: "flex", alignItems: "center", gap: 14, color: "#fff" }}>
          <div style={{ width: 52, height: 52, borderRadius: 26, background: "#fff", color: "#5f87b0", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 26 }}>{(b.title || "B").slice(0, 1).toUpperCase()}</div>
          <div>
            <div style={{ fontSize: 26, fontWeight: 800 }}>{b.title}</div>
            <div style={{ fontSize: 18, opacity: 0.8 }}>{b.sub || "bot"}</div>
          </div>
        </div>
        <div style={{ flex: 1, padding: "18px 16px", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 12 }}>
          {rows.map((r, i) => {
            const user = r.from === "user";
            return (
              <Appear key={i} t0={t0 + 0.5 + i * 0.7}>
                <div style={{ display: "flex", justifyContent: user ? "flex-end" : "flex-start" }}>
                  <div style={{ maxWidth: "82%", padding: "12px 18px", borderRadius: 20, background: user ? "#effdde" : "#ffffff", color: "#16161a", fontSize: 23, fontWeight: 600, lineHeight: 1.3 }}>{r.text}</div>
                </div>
              </Appear>
            );
          })}
        </div>
        <div style={{ background: "#fff", padding: "16px 20px", fontSize: 22, color: "#9aa0aa" }}>Message</div>
      </div>
    </Appear>
  );
};

// kartu label berikon ("Rahasia", "Agen AI", "Ide") dengan tag opsional di kanan
const ChipView: React.FC<{ b: Item; t0: number }> = ({ b, t0 }) => {
  const { accent } = React.useContext(Ctx);
  const tone = b.tone || accent;
  return (
    <Appear t0={t0}>
      <div style={{ ...card, border: `2px solid ${tone}`, padding: "20px 26px", display: "flex", alignItems: "center", gap: 22 }}>
        <IconTile glyph={b.icon} fallback={(b.title || "?").slice(0, 1)} tone={tone} size={78} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 44, fontWeight: 800, lineHeight: 1.1 }}>{b.title}</div>
          {b.sub ? <div style={{ fontSize: 24, color: V.mute, marginTop: 4 }}>{b.sub}</div> : null}
        </div>
        {b.tag ? <div style={{ border: `2px solid ${tone}`, color: tone, borderRadius: 30, padding: "6px 18px", fontSize: 22, fontWeight: 700 }}>{b.tag}</div> : null}
      </div>
    </Appear>
  );
};

// beberapa kartu kecil berdampingan (cols: head = judul, mid = keterangan, tag = ikon)
const TilesView: React.FC<{ b: Item; t0: number }> = ({ b, t0 }) => {
  const { accent } = React.useContext(Ctx);
  const cols = (b.cols || []).slice(0, 4);
  const tones = [accent, TONE2, C.blue, C.green];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 18 }}>
      {cols.map((c, i) => {
        const tone = tones[i % 4];
        return (
          <div key={i} style={{ flex: cols.length === 1 ? "1 1 100%" : cols.length === 2 ? "1 1 0" : "0 0 calc(50% - 9px)", minWidth: 0 }}>
            <Appear t0={t0 + i * 0.3}>
              <div style={{ ...card, border: `2px solid ${tone}`, padding: "18px 22px", display: "flex", alignItems: "center", gap: 16 }}>
                <IconTile glyph={c.tag} fallback={c.head.slice(0, 1)} tone={tone} size={62} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.1 }}>{c.head}</div>
                  {c.mid ? <div style={{ fontSize: 20, color: V.mute, marginTop: 2 }}>{c.mid}</div> : null}
                </div>
              </div>
            </Appear>
          </div>
        );
      })}
    </div>
  );
};

// kartu angka (KPI): judul + tag, angka naik, bar progres, avatar; big = angka besar di tengah
const KpiView: React.FC<{ b: Item; t0: number }> = ({ b, t0 }) => {
  const { t, accent } = React.useContext(Ctx);
  const tone = b.tone || accent;
  const k = clamp01((t - t0 - 0.2) / 1.3);
  const val = b.value ? countText(b.value, k) : "";
  const pill = b.tag ? <div style={{ marginLeft: "auto", background: tone, color: fgOn(tone), borderRadius: 30, padding: "5px 18px", fontSize: 21, fontWeight: 800 }}>{b.tag}</div> : null;
  const head = (
    <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, fontWeight: 700 }}>
      <IconTile glyph={b.icon} fallback={(b.title || "?").slice(0, 1)} tone={tone} size={46} />
      <span>{b.title}</span>
      {pill}
    </div>
  );
  if (b.big) {
    return (
      <Appear t0={t0}>
        <div style={{ ...card, border: `2px solid ${tone}`, padding: "24px 30px" }}>
          {head}
          <div style={{ textAlign: "center", fontSize: 120, fontWeight: 800, lineHeight: 1.15, marginTop: 8, color: k >= 1 ? tone : V.cardInk }}>{val}</div>
        </div>
      </Appear>
    );
  }
  const avatars = (b.items || []).slice(0, 5);
  const av = [accent, TONE2, C.blue, C.green, "#7b4fd8"];
  return (
    <Appear t0={t0}>
      <div style={{ ...card, border: `2px solid ${tone}`, padding: "20px 26px" }}>
        {head}
        {val || avatars.length ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
            <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.1 }}>{val}</div>
            <div style={{ display: "flex" }}>
              {avatars.map((a, i) => (
                <div key={i} style={{ width: 48, height: 48, borderRadius: 24, background: av[i % av.length], color: fgOn(av[i % av.length]), display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 22, marginLeft: i ? -12 : 0, border: "3px solid rgba(0,0,0,.35)" }}>{a.slice(0, 1)}</div>
              ))}
            </div>
          </div>
        ) : null}
        {b.pct !== undefined ? (
          <div style={{ height: 14, borderRadius: 7, background: "rgba(128,128,128,.25)", marginTop: 14, overflow: "hidden" }}>
            <div style={{ width: `${Math.max(0, Math.min(100, b.pct)) * clamp01((t - t0 - 0.2) / 1.1)}%`, height: "100%", background: tone, borderRadius: 7 }} />
          </div>
        ) : null}
      </div>
    </Appear>
  );
};

// tumpukan notifikasi (mis. "Penjualan baru +US$ 49") masuk satu per satu
const NotifsView: React.FC<{ b: Item; t0: number }> = ({ b, t0 }) => {
  const { accent } = React.useContext(Ctx);
  const tone = b.tone || accent;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {(b.notifs || []).slice(0, 4).map((n, i) => (
        <Appear key={i} t0={t0 + i * 0.55}>
          <div style={{ ...card, border: `2px solid ${tone}`, padding: "14px 20px", display: "flex", alignItems: "center", gap: 16 }}>
            <IconTile glyph={n.icon} fallback={n.text.slice(0, 1)} tone={tone} size={42} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.15 }}>{n.text}</div>
              {n.sub ? <div style={{ fontSize: 18, color: V.mute }}>{n.sub}</div> : null}
            </div>
            {n.value ? <div style={{ fontSize: 28, fontWeight: 800, color: tone }}>{n.value}</div> : null}
          </div>
        </Appear>
      ))}
    </div>
  );
};

// ikon aplikasi besar (boleh 2-3, dipisah panah): glyph/emoji atau gambar (src) + label
const IconsView: React.FC<{ b: Item; t0: number }> = ({ b, t0 }) => {
  const { name, ink } = React.useContext(Ctx);
  const icons = (b.icons || []).slice(0, 3);
  const size = icons.length > 1 ? 230 : 280;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 36 }}>
      {icons.map((ic, i) => (
        <React.Fragment key={i}>
          {i > 0 ? <Appear t0={t0 + i * 0.35}><div style={{ fontSize: 80, fontWeight: 800, color: ink, fontFamily: FONT }}>{"\u2192"}</div></Appear> : null}
          <Appear t0={t0 + i * 0.35}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: size, height: size, borderRadius: size * 0.24, background: ic.bg || "#ffffff", boxShadow: V.cardShadow, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.5, fontWeight: 800, color: "#16161a", fontFamily: FONT }}>
                {ic.src ? <Img src={staticFile(`${name}/${ic.src}`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : ic.glyph}
              </div>
              {ic.label ? <div style={{ fontSize: 36, fontWeight: 800, color: ink, marginTop: 16, fontFamily: FONT }}>{ic.label}</div> : null}
            </div>
          </Appear>
        </React.Fragment>
      ))}
    </div>
  );
};

// kartu profil akun untuk penutup ("Follow buat insight lainnya")
const ProfileView: React.FC<{ b: Item; t0: number }> = ({ b, t0 }) => {
  const { name, accent } = React.useContext(Ctx);
  return (
    <Appear t0={t0}>
      <div style={{ ...card, padding: "28px 30px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ width: 120, height: 120, borderRadius: 60, background: accent, color: fgOn(accent), overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56, fontWeight: 800, flexShrink: 0 }}>
            {b.src ? <Img src={staticFile(`${name}/${b.src}`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : b.icon || (b.title || "?").slice(0, 1).toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.1 }}>{b.title}</div>
            {b.sub ? <div style={{ fontSize: 26, color: V.mute, marginTop: 6 }}>{b.sub}</div> : null}
          </div>
        </div>
        {b.cta ? <div style={{ marginTop: 24, background: V.ghost, color: V.cardInk, borderRadius: 16, padding: "18px 0", textAlign: "center", fontSize: 32, fontWeight: 800 }}>{b.cta}</div> : null}
      </div>
    </Appear>
  );
};

// kartu merek penutup: teks kecil + nama besar + tombol toggle hijau
const BrandView: React.FC<{ b: Item; t0: number }> = ({ b, t0 }) => {
  const { ink } = React.useContext(Ctx);
  return (
    <Appear t0={t0}>
      <div style={{ textAlign: "center", color: ink, fontFamily: FONT }}>
        {b.sub ? <div style={{ fontSize: 40, fontWeight: 600, marginBottom: 18, opacity: 0.9 }}>{b.sub}</div> : null}
        <div style={{ fontSize: 118, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05 }}>{b.title}</div>
        <div style={{ position: "relative", width: 160, height: 72, borderRadius: 36, background: "#1fb86a", margin: "36px auto 0", boxShadow: "0 0 30px rgba(31,184,106,.45)" }}>
          <div style={{ position: "absolute", right: 8, top: 8, width: 56, height: 56, borderRadius: 28, background: "#06331c", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 22, height: 22, borderRadius: 11, border: "4px solid #fff", boxSizing: "border-box" }} />
          </div>
        </div>
        {b.cta ? <div style={{ display: "inline-block", marginTop: 30, background: "#ffffff", color: "#16161a", borderRadius: 40, padding: "14px 40px", fontSize: 32, fontWeight: 800 }}>{b.cta}</div> : null}
      </div>
    </Appear>
  );
};

// ---------- latar, maskot orb, caption, lencana untuk tema tutorial & neon ----------
const GridFloor: React.FC<{ f: number; color: string; h?: number; opacity?: number }> = ({ f, color, h = 760, opacity = 1 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: h, perspective: 700, perspectiveOrigin: "50% 0%", overflow: "hidden", opacity, WebkitMaskImage: "linear-gradient(to top, #000 25%, transparent 100%)", maskImage: "linear-gradient(to top, #000 25%, transparent 100%)" }}>
    <div style={{ position: "absolute", left: "-50%", width: "200%", top: 0, height: 1800, transformOrigin: "50% 0%", transform: "rotateX(72deg)", backgroundImage: `linear-gradient(${color} 2px, transparent 2px), linear-gradient(90deg, ${color} 2px, transparent 2px)`, backgroundSize: "90px 90px", backgroundPosition: `0 ${(f * 1.5) % 90}px` }} />
  </div>
);

const TutBackdrop: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 18%, #ff9a3c 0%, #f26a1b 45%, #d9480f 100%)" }} />
    <GridFloor f={f} color="rgba(255,255,255,.16)" h={700} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(60,10,0,.35) 100%)" }} />
  </AbsoluteFill>
);

const NeonBackdrop: React.FC<{ f: number; floor: number }> = ({ f, floor }) => {
  const a = Math.sin(f / 90);
  const b = Math.cos(f / 120);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${30 + a * 10}% ${22 + b * 6}%, rgba(255,63,142,.18), transparent 38%), radial-gradient(circle at ${72 - a * 8}% ${60 + b * 8}%, rgba(255,178,31,.12), transparent 40%), radial-gradient(ellipse at 50% 100%, rgba(120,30,140,.28), transparent 55%), #07020f` }} />
      {floor > 0.01 ? <GridFloor f={f} color="rgba(255,255,255,.22)" h={760} opacity={floor} /> : null}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(0,0,0,.5) 100%)" }} />
    </AbsoluteFill>
  );
};

// maskot bola bercahaya dengan dua cincin orbit (setengah cincin di belakang bola, setengah di depan)
const OrbMascot: React.FC<{ x: number; y: number; s: number; f: number; talk: number; op: number }> = ({ x, y, s, f, talk, op }) => {
  const rings = [
    { rx: 250, ry: 92, rot: -18, sp: 0.022, ph: 0, col: TONE2, dot: 15 },
    { rx: 215, ry: 70, rot: 38, sp: -0.03, ph: 2.1, col: "#ff3f8e", dot: 11 },
  ];
  const r = 150 * (1 + 0.05 * talk);
  const bob = Math.sin(f / 26) * 10;
  const back: React.ReactNode[] = [];
  const front: React.ReactNode[] = [];
  rings.forEach((rg, ri) => {
    const a = f * rg.sp + rg.ph;
    const dx = rg.rx * Math.cos(a);
    const dy = rg.ry * Math.sin(a);
    const dot = <circle cx={dx} cy={dy} r={rg.dot} fill={rg.col} filter="url(#orbGlow)" />;
    const arcBack = `M ${-rg.rx} 0 A ${rg.rx} ${rg.ry} 0 0 1 ${rg.rx} 0`;
    const arcFront = `M ${rg.rx} 0 A ${rg.rx} ${rg.ry} 0 0 1 ${-rg.rx} 0`;
    back.push(<g key={"b" + ri} transform={`rotate(${rg.rot})`}><path d={arcBack} fill="none" stroke={rg.col} strokeWidth={3} opacity={0.45} />{dy < 0 ? dot : null}</g>);
    front.push(<g key={"f" + ri} transform={`rotate(${rg.rot})`}><path d={arcFront} fill="none" stroke={rg.col} strokeWidth={4} opacity={0.9} />{dy >= 0 ? dot : null}</g>);
  });
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 700, height: 500, transform: `translate(-50%,-50%) scale(${s})`, opacity: op, pointerEvents: "none" }}>
      <svg viewBox="-350 -250 700 500" width={700} height={500} style={{ filter: "drop-shadow(0 0 40px rgba(255,90,120,.45))" }}>
        <defs>
          <radialGradient id="orbG" cx="0.38" cy="0.32" r="0.8">
            <stop offset="0%" stopColor="#ffe7a8" />
            <stop offset="35%" stopColor="#ff8a5c" />
            <stop offset="70%" stopColor="#d93a7d" />
            <stop offset="100%" stopColor="#4a1458" />
          </radialGradient>
          <radialGradient id="orbHalo" cx="0.5" cy="0.5" r="0.5">
            <stop offset="55%" stopColor="rgba(255,90,120,.35)" />
            <stop offset="100%" stopColor="rgba(255,90,120,0)" />
          </radialGradient>
          <filter id="orbGlow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <g transform={`translate(0,${bob})`}>
          <circle r={r * 1.6} fill="url(#orbHalo)" />
          {back}
          <circle r={r} fill="url(#orbG)" />
          <circle r={r} fill="none" stroke="rgba(255,255,255,.25)" strokeWidth={2} />
          <ellipse cx={-r * 0.35} cy={-r * 0.45} rx={r * 0.38} ry={r * 0.2} fill="#fff" opacity={0.22} transform={`rotate(-30 ${-r * 0.35} ${-r * 0.45})`} />
          {front}
        </g>
      </svg>
    </div>
  );
};

const groupsOfN = (words: W[], n: number) => {
  const g: W[][] = [];
  let cur: W[] = [];
  words.forEach((w) => {
    if (cur.length && (cur.length >= n || cur[0].s !== w.s)) { g.push(cur); cur = []; }
    cur.push(w);
    if (/[.?!,]$/.test(w.w)) { g.push(cur); cur = []; }
  });
  if (cur.length) g.push(cur);
  return g;
};

// caption tutorial: bilah gelap di bawah, kata yang sudah/sedang diucapkan menyala
const TutCaption: React.FC<{ words: W[]; t: number }> = ({ words, t }) => {
  const groups = groupsOfN(words, 6);
  let gi = -1;
  for (let i = 0; i < groups.length; i++) if (t >= groups[i][0].a - 0.05) gi = i;
  if (gi < 0) return null;
  const g = groups[gi];
  if (t > g[g.length - 1].b + 0.6) return null;
  return (
    <div style={{ position: "absolute", left: 90, right: 90, top: 1450, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "4px 14px", padding: "18px 26px", borderRadius: 20, background: "#2b0f05", boxShadow: "0 7px 0 rgba(0,0,0,.28)", fontFamily: FONT, fontSize: 44, fontWeight: 700, lineHeight: 1.25 }}>
      {g.map((w, i) => {
        const on = t >= w.a;
        return <span key={i} style={{ color: !on ? "#c9a894" : w.hl ? "#ffb066" : "#ffffff", opacity: on ? 1 : 0.6 }}>{w.w}</span>;
      })}
    </div>
  );
};

// caption neon: satu frasa muncul sekaligus, kata penting berwarna pink / kuning bergantian
const NeonCaption: React.FC<{ words: W[]; t: number; accent: string }> = ({ words, t, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const groups = groupsOfN(words, 7);
  let gi = -1;
  for (let i = 0; i < groups.length; i++) if (t >= groups[i][0].a - 0.05) gi = i;
  if (gi < 0) return null;
  const g = groups[gi];
  if (t > g[g.length - 1].b + 0.8) return null;
  const sp = clamp01(spring({ frame: frame - Math.round(g[0].a * fps), fps, config: { damping: 16, stiffness: 220 } }));
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: 1290, display: "flex", flexWrap: "wrap", justifyContent: "center", alignContent: "flex-start", gap: "2px 16px", textAlign: "center", opacity: clamp01(sp * 2), transform: `translateY(${(1 - sp) * 18}px)`, fontFamily: FONT }}>
      {g.map((w, i) => (
        <span key={i} style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.25, color: w.hl ? (gi % 2 === 0 ? accent : TONE2) : "#ffffff", textShadow: "0 2px 18px rgba(0,0,0,.6)" }}>{w.w}</span>
      ))}
    </div>
  );
};

// lencana "Langkah N /M" (tema tutorial); muncul membal saat langkah berganti
const StepBadge: React.FC<{ step: string; label: string; t0: number }> = ({ step, label, t0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = clamp01(spring({ frame: frame - Math.round(t0 * fps), fps, config: { damping: 12, stiffness: 200 } }));
  const parts = step.split("/");
  return (
    <div style={{ position: "absolute", left: 80, top: 84, background: "#2b0f05", color: "#fff", borderRadius: 40, padding: "10px 26px", fontSize: 32, fontWeight: 700, fontFamily: FONT, transform: `rotate(-4deg) scale(${0.6 + 0.4 * s})`, opacity: clamp01(s * 2), boxShadow: "0 6px 0 rgba(0,0,0,.28)" }}>
      {label} <span style={{ fontSize: 40, fontWeight: 800 }}>{parts[0]}</span>
      {parts[1] !== undefined ? <span style={{ opacity: 0.7 }}> /{parts[1]}</span> : null}
    </div>
  );
};

// handle akun di dasar layar (tema tutorial)
const HandleTag: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 1600, display: "flex", justifyContent: "center", alignItems: "center", gap: 12, fontFamily: FONT, fontSize: 30, fontWeight: 600, color: "rgba(255,244,230,.85)" }}>
    <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
    {text}
  </div>
);

const StageItem: React.FC<{ b: Item; i: number }> = ({ b, i }) => {
  const cx = React.useContext(Ctx);
  const t0 = b.hold ? -100 : resolveT(b.at, cx, 0.05 + i * 0.35); // hold = lanjutan dari adegan sebelumnya: langsung tampil, tanpa animasi masuk
  switch (b.type) {
    case "window": return <WindowView b={b} t0={t0} />;
    case "compare": return <CompareView b={b} t0={t0} />;
    case "tree": return <TreeView b={b} t0={t0} />;
    case "dialog": return <DialogView b={b} t0={t0} />;
    case "callout": return <CalloutView b={b} t0={t0} />;
    case "list": return <ListView b={b} t0={t0} />;
    case "stat": return <StatView b={b} t0={t0} />;
    case "image": return <ImageView b={b} t0={t0} />;
    case "meter": return <MeterView b={b} t0={t0} />;
    case "bars": return <BarsView b={b} t0={t0} />;
    case "terminal": return <TermView b={b} t0={t0} />;
    case "browser": return <BrowserView b={b} t0={t0} />;
    case "phone": return <PhoneView b={b} t0={t0} />;
    case "chip": return <ChipView b={b} t0={t0} />;
    case "tiles": return <TilesView b={b} t0={t0} />;
    case "kpi": return <KpiView b={b} t0={t0} />;
    case "notifs": return <NotifsView b={b} t0={t0} />;
    case "icons": return <IconsView b={b} t0={t0} />;
    case "profile": return <ProfileView b={b} t0={t0} />;
    case "brand": return <BrandView b={b} t0={t0} />;
    case "files":
      return (
        <Appear t0={t0}>
          <div style={{ ...card, padding: 24 }}>
            {b.title ? <div style={{ fontWeight: 800, fontSize: 28, marginBottom: 14 }}>{b.title}</div> : null}
            <FilesGrid n={b.n || 24} groups={b.groups} t0={t0} />
          </div>
        </Appear>
      );
    default: return null;
  }
};

const Header: React.FC<{ brand: string; tag: string }> = ({ brand, tag }) => (
  <div style={{ position: "absolute", left: 30, right: 30, top: 60, height: 78, borderRadius: 39, background: "#fff", color: C.ink, boxShadow: "0 4px 18px rgba(0,0,0,.08)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", fontFamily: FONT }}>
    {brand ? (
      <div style={{ display: "flex", alignItems: "center", gap: 14, fontWeight: 800, fontSize: 34 }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: C.red, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>{brand.slice(0, 1)}</div>
        {brand}
      </div>
    ) : <div />}
    {tag ? <div style={{ background: C.ink, color: "#fff", borderRadius: 30, padding: "8px 22px", fontSize: 26, fontWeight: 600 }}>{tag}</div> : null}
  </div>
);

const SpriteMascot: React.FC<{ name: string; img: string; talkImg?: string; x: number; flip: boolean; pose: string; f: number; talk: number; ent: number; feet: number }> = ({ name, img, talkImg, x, flip, pose, f, talk, ent, feet }) => {
  let dy = Math.sin(f / 9) * 4;
  let rot = Math.sin(f / 25) * 1.2;
  if (pose === "cheer") { dy = -Math.abs(Math.sin(f / 5)) * 34; rot += Math.sin(f / 5) * 3; }
  else if (pose === "walk") { dy = -Math.abs(Math.sin(f / 4)) * 16; rot += Math.sin(f / 4) * 3; }
  else if (pose === "tremble") rot += Math.sin(f * 2.2) * 2;
  else if (pose === "sad") { rot += 5; dy += 10; }
  else if (pose === "think") rot -= 4;
  const sx = 1 - 0.012 * talk;
  const sy = 1 + 0.03 * talk;
  return (
    <div style={{ position: "absolute", left: x, top: feet, height: 520, display: "grid", transformOrigin: "50% 100%", transform: `translate(-50%, -100%) translate(0px, ${dy + (1 - ent) * 420}px) rotate(${rot}deg) scale(${(flip ? -1 : 1) * sx}, ${sy})` }}>
      <Img src={staticFile(`${name}/${img}`)} style={{ gridArea: "1 / 1", height: "100%", width: "auto" }} />
      {talkImg ? <Img src={staticFile(`${name}/${talkImg}`)} style={{ gridArea: "1 / 1", height: "100%", width: "auto", opacity: talk > 0.25 ? 1 : 0 }} /> : null}
    </div>
  );
};

// judul 2 tingkat: `small` kata pertama = baris kecil, sisanya = baris besar; tiap kata muncul saat diucapkan
const Headline: React.FC<{ ws: W[]; small: number; solo?: boolean }> = ({ ws, small, solo }) => {
  const { accent, ink, mute, theme, hl: hlColor } = React.useContext(Ctx);
  const hudTheme = theme === "hud";
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const big = ws.slice(small);
  const bigSize = Math.round((big.length <= 3 ? 88 : big.length <= 5 ? 76 : big.length <= 8 ? 64 : 54) * (solo ? 1.08 : 1));
  const line = (arr: W[], size: number, weight: number, base: string) => (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: `0 ${size * 0.26}px`, fontSize: size, fontWeight: weight, lineHeight: 1.18, textTransform: hudTheme ? "uppercase" : undefined }}>
      {arr.map((w, i) => {
        const s = clamp01(spring({ frame: frame - Math.round(w.a * fps), fps, config: { damping: 14, stiffness: 200 } }));
        return (
          <span key={i} style={{ display: "inline-block", opacity: s > 0.02 ? clamp01(s * 2) : 0, transform: `translateY(${(1 - s) * 20}px)`, color: w.hl ? (hlColor || accent) : base, textShadow: hudTheme && w.hl ? `0 0 22px ${accent}aa` : undefined }}>{w.w}</span>
        );
      })}
    </div>
  );
  return (
    <>
      {small > 0 ? line(ws.slice(0, small), solo ? 50 : 42, 600, mute) : null}
      {line(big, bigSize, 800, ink)}
    </>
  );
};

// ================= TEMA HUD / HOLOGRAM =================
const MONO = "ui-monospace, 'SFMono-Regular', Menlo, Consolas, 'DejaVu Sans Mono', monospace";

const HudBackdrop: React.FC<{ f: number; accent: string }> = ({ f, accent }) => {
  const dots = Array.from({ length: 22 }, (_, i) => {
    const x = (i * 197) % 1080;
    const y = 1900 - ((f * (0.8 + (i % 5) * 0.35) + i * 131) % 1900);
    const sz = 3 + (i % 3) * 2;
    const col = i % 4 === 0 ? HUD_ORANGE : accent;
    return <div key={i} style={{ position: "absolute", left: x, top: y, width: sz, height: sz, borderRadius: sz, background: col, opacity: 0.25 + 0.5 * Math.abs(Math.sin(f / 20 + i)), boxShadow: `0 0 10px ${col}` }} />;
  });
  const br = (pos: React.CSSProperties, bw: React.CSSProperties) => (
    <div style={{ position: "absolute", width: 90, height: 90, border: `0 solid ${accent}`, opacity: 0.75, ...pos, ...bw }} />
  );
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 38%, #12305f 0%, #081a3a 48%, #030a1a 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 760, perspective: 700, perspectiveOrigin: "50% 0%", overflow: "hidden", WebkitMaskImage: "linear-gradient(to top, #000 25%, transparent 100%)", maskImage: "linear-gradient(to top, #000 25%, transparent 100%)" }}>
        <div style={{ position: "absolute", left: "-50%", width: "200%", top: 0, height: 1800, transformOrigin: "50% 0%", transform: "rotateX(72deg)", backgroundImage: `linear-gradient(${accent}55 2px, transparent 2px), linear-gradient(90deg, ${accent}55 2px, transparent 2px)`, backgroundSize: "90px 90px", backgroundPosition: `0 ${(f * 2) % 90}px` }} />
      </div>
      {dots}
      <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,.035) 0px, rgba(255,255,255,.035) 1px, transparent 1px, transparent 4px)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,.45) 100%)" }} />
      {br({ left: 26, top: 26 }, { borderTopWidth: 5, borderLeftWidth: 5 })}
      {br({ right: 26, top: 26 }, { borderTopWidth: 5, borderRightWidth: 5 })}
      {br({ left: 26, bottom: 26 }, { borderBottomWidth: 5, borderLeftWidth: 5 })}
      {br({ right: 26, bottom: 26 }, { borderBottomWidth: 5, borderRightWidth: 5 })}
    </AbsoluteFill>
  );
};

const HudLabel: React.FC<{ text: string; brand: string; base: number; t: number; accent: string }> = ({ text, brand, base, t, accent }) => {
  const n = Math.floor(Math.max(0, t - base) * 28);
  const cursor = Math.floor(t * 2.5) % 2 === 0 ? "\u258C" : " ";
  return (
    <div style={{ position: "absolute", left: 64, right: 64, top: 66, display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 26, letterSpacing: 2, color: accent, textShadow: `0 0 10px ${accent}88` }}>
      <div>{text.slice(0, n)}{cursor}</div>
      {brand ? <div style={{ color: "#9fb3d1", fontSize: 22, textShadow: "none" }}>{brand.toUpperCase()}</div> : null}
    </div>
  );
};

const groupsOf = (words: W[]) => {
  const g: W[][] = [];
  let cur: W[] = [];
  words.forEach((w) => {
    if (cur.length && (cur.length >= 4 || cur[0].s !== w.s)) { g.push(cur); cur = []; }
    cur.push(w);
    if (/[.?!,]$/.test(w.w)) { g.push(cur); cur = []; }
  });
  if (cur.length) g.push(cur);
  return g;
};

const HudCaption: React.FC<{ words: W[]; t: number; accent: string }> = ({ words, t, accent }) => {
  const groups = groupsOf(words);
  let gi = -1;
  for (let i = 0; i < groups.length; i++) if (t >= groups[i][0].a - 0.05) gi = i;
  if (gi < 0) return null;
  const g = groups[gi];
  if (t > g[g.length - 1].b + 0.6) return null;
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: 1535, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "4px 18px", padding: "20px 28px", borderRadius: 30, background: "rgba(5,15,35,.82)", border: `2px solid ${accent}99`, boxShadow: `0 0 26px ${accent}44, inset 0 0 18px ${accent}18`, fontWeight: 800, fontSize: 48, lineHeight: 1.2, color: "#fff" }}>
      {g.map((w, i) => {
        const active = t >= w.a && t < w.b;
        const spoken = t >= w.b;
        return <span key={i} style={{ color: w.hl || active ? accent : "#fff", opacity: spoken || active ? 1 : 0.45, textShadow: active ? `0 0 16px ${accent}` : undefined }}>{w.w}</span>;
      })}
    </div>
  );
};

const HoloRing: React.FC<{ x: number; y: number; f: number; accent: string }> = ({ x, y, f, accent }) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
    <g transform={`translate(${x},${y})`} fill="none">
      <circle r={230} stroke={accent} strokeWidth={3} strokeDasharray="14 12" opacity={0.7} transform={`rotate(${f * 0.5})`} />
      <circle r={285} stroke={HUD_ORANGE} strokeWidth={3} strokeDasharray="40 18" opacity={0.6} transform={`rotate(${-f * 0.35})`} />
      <circle r={190} stroke={accent} strokeWidth={2} opacity={0.35} />
    </g>
  </svg>
);

// ================= TEMA KLASIK (stickman + latar kota/ruang, caption di atas) =================
const CLASSIC_BGS = ["dawn", "dusk", "room", "stage", "night", "day", "office"];
const CLASSIC_PROPS = ["bulb", "confetti", "crowd", "fork", "laptop", "money", "orb", "phone", "shadow", "think", "trophy", "rocket", "chart", "lock"];
const classicVars = (accent: string) => ({
  "--card-bg": "rgba(14,18,38,.88)",
  "--card-line": accent,
  "--card-ink": "#ffffff",
  "--card-shadow": "0 10px 30px rgba(0,0,0,.35)",
  "--card-radius": "44px",
  "--soft": "rgba(255,255,255,.14)",
  "--row": "rgba(255,255,255,.09)",
  "--row2": "rgba(255,255,255,.09)",
  "--note-bg": "rgba(255,209,102,.16)",
  "--note-line": "rgba(255,209,102,.5)",
  "--btn-ghost": "rgba(255,255,255,.16)",
  "--mute": "#c4c9d8",
  "--bar": "rgba(255,255,255,.35)",
  "--callout-bg": "linear-gradient(180deg,rgba(14,18,38,.92),rgba(40,30,70,.85))",
}) as unknown as React.CSSProperties;

const ClassicCaption: React.FC<{ words: W[]; t: number; accent: string }> = ({ words, t, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const groups = groupsOf(words);
  let gi = -1;
  for (let i = 0; i < groups.length; i++) if (t >= groups[i][0].a - 0.05) gi = i;
  if (gi < 0) return null;
  const g = groups[gi];
  if (t > g[g.length - 1].b + 0.6) return null;
  const sp = clamp01(spring({ frame: frame - Math.round(g[0].a * fps), fps, config: { damping: 13, stiffness: 190 } }));
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 180, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "4px 18px", padding: "18px 28px", borderRadius: 36, background: "rgba(10,12,24,.75)", transform: `scale(${0.92 + 0.08 * sp})`, opacity: 0.35 + 0.65 * sp, boxShadow: "0 10px 30px rgba(0,0,0,.4)" }}>
      {g.map((w, i) => {
        const active = t >= w.a && t < w.b;
        const spoken = t >= w.b;
        return (
          <span key={i} style={{ display: "inline-block", fontWeight: 800, fontSize: w.hl ? 56 : 48, lineHeight: 1.22, color: w.hl ? accent : "#fff", opacity: spoken || active ? 1 : 0.55, transform: `scale(${active ? 1.08 : 1})`, textShadow: "0 3px 14px rgba(0,0,0,.8)" }}>{w.w}</span>
        );
      })}
    </div>
  );
};

const fallbackWords = (title: string, start: number, idx: number): W[] =>
  title.split(" ").filter(Boolean).map((raw, i) => ({ w: raw.replace(/\*/g, ""), hl: raw.includes("*"), a: start + i * 0.25, b: start + i * 0.25 + 0.25, s: idx }));

export const Explainer: React.FC<StoryProps> = ({ name, data: d }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  if (!d) return null;
  const data = d as unknown as Data;
  const t = frame / fps;
  const hud = data.theme === "hud";
  const classic = data.theme === "classic";
  const tut = data.theme === "tutorial";
  const neon = data.theme === "neon";
  const accent = data.accent || (hud ? HUD_CYAN : classic ? "#FFD700" : tut ? "#ff5a1f" : neon ? "#ff3f8e" : C.red);

  let idx = 0;
  data.scenes.forEach((s, i) => { if (t >= s.start - 1e-6) idx = i; });
  const sc = data.scenes[idx];
  const prev = idx > 0 ? data.scenes[idx - 1] : undefined;
  const base = sc.start;

  const talk = data.env ? data.env[Math.min(data.env.length - 1, frame)] : undefined;
  const hasMascot = !!sc.mascot && !neon; // tema neon memakai maskot orb sendiri
  const persist = hasMascot && prev?.mascot === sc.mascot;
  const ent = persist ? 1 : clamp01(spring({ frame: frame - Math.round(base * fps), fps, config: { damping: 14 } }));
  const mx = classic ? (sc.mascot === "left" ? 300 : sc.mascot === "right" ? 780 : 540) : sc.mascot === "left" ? 250 : sc.mascot === "right" ? 830 : 540;
  const flip = sc.mascot === "right";
  const ctaStart = durationInFrames - Math.round(2 * fps);

  // latar per adegan: satu saja, atau ganti otomatis tiap N adegan; "bg" per adegan mengalahkan semuanya
  const names = (data.backgrounds || []).filter((n) => BG_PRESETS[n]);
  const bgNames = names.length ? names : ["cream"];
  const every = Math.max(1, data.bgEvery || 3);
  const presetFor = (i: number): Preset => {
    const own = data.scenes[i].bg;
    if (own && BG_PRESETS[own]) return BG_PRESETS[own];
    return BG_PRESETS[data.bgMode === "auto" ? bgNames[Math.floor(i / every) % bgNames.length] : bgNames[0]];
  };
  const preset = presetFor(idx);
  const cList = (data.backgrounds || []).filter((n) => CLASSIC_BGS.includes(n));
  const cBgFor = (i: number): string => {
    const own = data.scenes[i].bg;
    if (own && CLASSIC_BGS.includes(own)) return own;
    const pool = cList.length ? cList : CLASSIC_BGS;
    return pool[Math.floor(i / Math.max(1, data.bgEvery || 2)) % pool.length];
  };
  const ink = data.textColor || (hud || classic || neon ? "#ffffff" : tut ? "#1a0e08" : preset.ink);

  // jenis transisi masuk per adegan: "transition" di adegan, atau dari daftar global (berurutan / acak)
  const tlist = (data.transitions || []).filter((x) => TRANS.includes(x));
  const tkindFor = (i: number): string => {
    if (i === 0) return "none";
    if (data.scenes[i].stage?.[0]?.hold) return "none"; // gambar yang bertahan: jangan digeser
    const own = data.scenes[i].transition;
    if (own && TRANS.includes(own)) return own;
    if (!tlist.length) return "none";
    const r = Math.abs(Math.sin((i + 1) * 12.9898) * 43758.5453) % 1;
    return tlist[data.transitionsMode === "random" ? Math.floor(r * tlist.length) : i % tlist.length];
  };
  const tkind = tkindFor(idx);
  const inTrans = idx > 0 && tkind !== "none" && t - base < TD;
  const pair = transPair(tkind, (t - base) / TD);

  const hasHeader = !classic && !tut && !neon && data.header !== false && (hud || !!(data.brand || data.tag));
  const dy = hasHeader ? 0 : -80;
  const feet = hud ? 1470 : classic ? 1500 : 1800;
  const mScale = classic ? 0.85 : 0.62;
  const wsMain = (data.words || []).filter((w) => w.s === idx);
  const hlWord = (wsMain.find((w) => w.hl) || wsMain[0] || { w: "" }).w.replace(/[.,!?;:"'*]/g, "").toUpperCase();
  const hudLabel = sc.label || `${(data.tag || "STATUS").toUpperCase()}: ${hlWord}`;
  const cstyle = data.charStyle || "block";
  const poseName = sc.pose || "idle";

  // satu lapisan adegan (judul + blok visual); dipakai dua kali saat transisi (adegan lama + baru)
  const layer = (i: number, wrap: React.CSSProperties) => {
    const s = data.scenes[i];
    const fw = (data.words || []).filter((w) => w.s === i);
    const wsI = fw.length ? fw : fallbackWords(s.title, s.start, i);
    const solo = !(s.stage && s.stage.length);
    const sm = (s.small ?? 0) <= 3 && (s.small ?? 0) <= wsI.length - 2 ? s.small ?? 0 : 0;
    const hm = !!s.mascot;
    const p = presetFor(i);
    return (
      <Ctx.Provider key={"L" + i} value={{ ws: wsI, base: s.start, t, accent, name, ink: data.textColor || (hud || neon ? "#ffffff" : tut ? "#1a0e08" : p.ink), mute: data.textColor || (hud ? "#9fb3d1" : classic ? "#c4c9d8" : neon ? "#b9a8c9" : tut ? "#5a2a14" : p.mute), theme: hud ? "hud" : classic ? "classic" : tut ? "tutorial" : neon ? "neon" : "clean", hl: tut ? "#ffffff" : undefined }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, ...wrap }}>
          {classic || neon ? null : (
            <div style={{ position: "absolute", left: 50, right: 50, top: solo ? 460 : hud ? 150 : tut ? 150 : 190 + dy, height: solo ? 520 : 300, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 10, textAlign: "center" }}>
              <Headline ws={wsI} small={sm} solo={solo} />
            </div>
          )}
          {classic && s.prop && CLASSIC_PROPS.includes(s.prop) && typeof Prop !== "undefined" ? (
            <Prop kind={s.prop} f={frame} lf={Math.max(0, frame - Math.round(s.start * fps))} hx={s.mascot === "left" ? 300 : s.mascot === "right" ? 780 : 540} accent={accent} />
          ) : null}
          <div style={{ position: "absolute", left: 60, right: 60, top: neon ? 170 : tut ? (hm ? 500 : 470) : classic ? (hm ? 420 : 360) : hud ? (hm ? 480 : 500) : (hm ? 500 : 520) + dy, bottom: neon ? 700 : tut ? (hm ? 700 : 540) : classic ? (hm ? 840 : 260) : hud ? (hm ? 790 : 440) : (hm ? 520 : 200), display: "flex", flexDirection: "column", justifyContent: neon ? "flex-start" : "center", gap: neon ? 18 : 28 }}>
            {(s.stage || []).map((b, bi) => <StageItem key={bi} b={b} i={bi} />)}
          </div>
        </div>
      </Ctx.Provider>
    );
  };

  // ---- tema tutorial: lencana langkah ----
  let stepStart = base;
  if (sc.step) {
    let si = idx;
    while (si > 0 && data.scenes[si - 1].step === sc.step) si--;
    stepStart = data.scenes[si].start;
  }
  // ---- tema neon: maskot orb besar (hook / tanpa kartu) atau kecil (di bawah kartu), berpindah halus ----
  const orbFor = (i: number) => {
    const sn = data.scenes[i];
    const hide = sn.orb === "hide" || !!sn.stage?.some((b) => b.type === "brand");
    const big = sn.orb ? sn.orb === "big" : !(sn.stage && sn.stage.length) || (sn.stage.length === 1 && sn.stage[0].type === "chip");
    return { hide, y: big ? 900 : 1620, sc: big ? 1.15 : 0.62 };
  };
  const oc = orbFor(idx);
  const opv = idx > 0 ? orbFor(idx - 1) : oc;
  const ok = idx > 0 ? easeIO(clamp01((t - base) / 0.5)) : 1;
  const orbY = opv.y + (oc.y - opv.y) * ok;
  const orbS = opv.sc + (oc.sc - opv.sc) * ok;
  const orbVis = (oc.hide && opv.hide ? 0 : oc.hide ? 1 - ok : opv.hide ? ok : 1) * (idx === 0 ? clamp01(spring({ frame, fps, config: { damping: 14 } })) : 1);
  const floorOp = idx > 0 && opv.hide && !oc.hide ? 1 - ok : oc.hide ? (idx > 0 && opv.hide ? 1 : ok) : 0;

  const prevPreset = idx > 0 ? presetFor(idx - 1) : preset;

  return (
    <AbsoluteFill style={{ ...(hud ? { backgroundColor: "#030a1a", ...HUD_VARS } : classic ? { backgroundColor: "#000", ...classicVars(accent) } : tut ? { backgroundColor: "#d9480f", ...TUT_VARS } : neon ? { backgroundColor: "#07020f", ...NEON_VARS } : bgStyle(preset)), fontFamily: FONT, color: ink }}>
      <Audio src={staticFile(name + "/mix.wav")} />
      {hud ? <HudBackdrop f={frame} accent={accent} /> : null}
      {tut ? <TutBackdrop f={frame} /> : null}
      {neon ? <NeonBackdrop f={frame} floor={floorOp} /> : null}
      {classic && typeof Bg !== "undefined" ? (
        <>
          <Bg type={cBgFor(idx)} f={frame} p={clamp01((t - base) / 3)} />
          {inTrans && idx > 0 && cBgFor(idx - 1) !== cBgFor(idx) ? (
            <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: 1 - easeIO(clamp01((t - base) / TD)) }}>
              <Bg type={cBgFor(idx - 1)} f={frame} p={1} />
            </div>
          ) : null}
        </>
      ) : null}
      {!hud && !classic && !tut && !neon && inTrans && prevPreset !== preset ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, ...bgStyle(prevPreset), opacity: 1 - easeIO(clamp01((t - base) / TD)) }} />
      ) : null}
      {inTrans ? layer(idx - 1, pair.out) : null}
      {layer(idx, inTrans ? pair.inn : {})}
      {hasHeader ? (hud ? <HudLabel text={hudLabel} brand={data.brand || ""} base={base} t={t} accent={accent} /> : <Header brand={data.brand || ""} tag={data.tag || ""} />) : null}
      {hud && hasMascot ? <HoloRing x={mx} y={feet - 190 + (1 - ent) * 420} f={frame} accent={accent} /> : null}
      {hasMascot && cstyle === "sprite" && data.charImg ? (
        <SpriteMascot name={name} img={data.charImg} talkImg={data.charTalkImg} x={mx} flip={flip} pose={poseName} f={frame} talk={talk ?? 0} ent={ent} feet={feet} />
      ) : hasMascot ? (
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, filter: hud ? `drop-shadow(0 0 14px ${accent}99)` : undefined }}>
          <g transform={`translate(${mx},${feet + (1 - ent) * 420}) scale(${flip ? -mScale : mScale},${mScale})`}>
            <ellipse cx={0} cy={4} rx={100} ry={14} fill="#000" opacity={0.15} />
            {cstyle === "stick" && typeof Stick !== "undefined" ? (
              <Stick pose={poseName as Pose} color={data.charColor || "#222"} f={frame} type={data.char} talk={talk} />
            ) : (
              <Block pose={poseName as Pose} color={data.charColor || "#222"} f={frame} type={data.char} talk={talk} />
            )}
          </g>
        </svg>
      ) : null}
      {neon && orbVis > 0.01 ? <OrbMascot x={540} y={orbY} s={orbS} f={frame} talk={talk ?? 0} op={orbVis} /> : null}
      {tut && sc.step ? <StepBadge step={sc.step} label={data.stepLabel || "Langkah"} t0={stepStart} /> : null}
      {hud ? <HudCaption words={data.words || []} t={t} accent={accent} /> : null}
      {tut ? <TutCaption words={data.words || []} t={t} /> : null}
      {neon ? <NeonCaption words={data.words || []} t={t} accent={accent} /> : null}
      {tut && data.handle ? <HandleTag text={data.handle} /> : null}
      {classic ? <ClassicCaption words={data.words || []} t={t} accent={accent} /> : null}
      {classic && data.header !== false && data.brand ? (
        <div style={{ position: "absolute", left: 60, bottom: 330, color: "rgba(255,255,255,0.45)", fontSize: 34, fontFamily: FONT }}>{data.brand}</div>
      ) : null}
      {data.cta && frame >= ctaStart ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 110 }}>
          <div style={{ padding: "22px 52px", borderRadius: 60, background: accent, color: "#fff", fontWeight: 800, fontSize: 46, fontFamily: FONT }}>{data.cta}</div>
        </AbsoluteFill>
      ) : null}
      <div style={{ position: "absolute", bottom: 0, left: 0, height: 8, width: `${(frame / durationInFrames) * 100}%`, backgroundColor: accent }} />
    </AbsoluteFill>
  );
};
