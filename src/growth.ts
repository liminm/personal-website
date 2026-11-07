// Woven system under tension: fine strands over invisible tension points.
// Local alignment + crowding response + pull toward poles => folded mass
// with dense ridges, openings, and high-tension (cobalt) zones.

export function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Strand {
  /** unit-space points [x0,y0,x1,y1,...], mapped to pixels by renderer */
  pts: number[];
  /** per-point tension metric, same length as point count */
  tension: number[];
  width: number;
  alpha: number;
}

interface Pole { x: number; y: number; swirl: number; pull: number; sigma: number; }

export interface Weave { strands: Strand[]; cobaltAt: number; }

// Fixed logical aspect for the field: a named seed yields the same composition
// on any viewport. The renderer maps this space with cover-fit (crop overflow).
const LOGICAL_ASPECT = 1;

export function weave(seedNum: number): Weave {
  const rand = mulberry32(seedNum);
  const ph1 = rand() * Math.PI * 2;
  const ph2 = rand() * Math.PI * 2;

  // Three tension points, positions jittered per seed. y in unit space.
  const poles: Pole[] = [
    { x: 0.36 + (rand() - 0.5) * 0.1, y: 0.5 + (rand() - 0.5) * 0.12, swirl: 1.0, pull: 0.6, sigma: 0.17 },
    { x: 0.62 + (rand() - 0.5) * 0.1, y: 0.42 + (rand() - 0.5) * 0.12, swirl: -0.9, pull: 0.55, sigma: 0.16 },
    { x: 0.5 + (rand() - 0.5) * 0.12, y: 0.7 + (rand() - 0.5) * 0.08, swirl: 0.6, pull: 0.4, sigma: 0.2 },
  ];
  for (const p of poles) {
    p.swirl *= 0.85 + rand() * 0.3;
    p.pull *= 0.85 + rand() * 0.3;
  }

  const field = (u: number, v: number, out: { x: number; y: number }): number => {
    const aspect = LOGICAL_ASPECT;
    // proximity accumulator doubles as tension input
    let prox = 0;
    let ax = 1.0 + 0.3 * Math.sin(v * 5.1 + ph1) + 0.15 * Math.sin((u + v) * 7.3 + ph2);
    let ay = 0.32 * Math.sin(u * 3.7 + ph2) + 0.22 * Math.sin(u * 2.1 - v * 3.3 + ph1);
    for (const p of poles) {
      const dx = u - p.x;
      const dy = (v - p.y) * aspect;
      const d2 = dx * dx + dy * dy;
      const g = Math.exp(-d2 / (2 * p.sigma * p.sigma));
      prox += (Math.abs(p.swirl) + p.pull) * g;
      const d = Math.sqrt(d2) + 1e-4;
      // tangential (swirl) + radial-in (fold)
      ax += ((-dy / d) * p.swirl + (-dx / d) * p.pull) * g;
      ay += ((dx / d) * p.swirl * aspect + (-dy / d) * p.pull) * g / aspect;
    }
    const l = Math.hypot(ax, ay) || 1;
    out.x = ax / l; out.y = ay / l;
    return prox;
  };

  // Start grid with jitter; drop some cells to leave breathing openings.
  const cols = 16, rows = 19;
  const strands: Strand[] = [];
  const dir = { x: 1, y: 0 };
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (rand() < 0.12) continue; // openings
      const u0 = 0.07 + (c + 0.15 + rand() * 0.7) / cols * 0.86;
      const v0 = 0.06 + (r + 0.15 + rand() * 0.7) / rows * 0.88;
      const steps = 130 + Math.floor(rand() * 80);
      const h = 0.0042;
      let u = u0, v = v0;
      field(u, v, dir);
      let hx = dir.x, hy = dir.y;
      const pts = [u, v];
      const tension = [0];
      let alive = true;
      for (let s = 0; s < steps; s++) {
        field(u, v, dir);
        // align with neighbours (field) but keep own momentum: coherence
        let nx = hx * 0.62 + dir.x * 0.38;
        let ny = hy * 0.62 + dir.y * 0.38;
        const j = (rand() - 0.5) * 0.22;
        const cj = Math.cos(j), sj = Math.sin(j);
        const rx = nx * cj - ny * sj, ry = nx * sj + ny * cj;
        const rl = Math.hypot(rx, ry) || 1;
        nx = rx / rl; ny = ry / rl;
        const turn = Math.abs(nx * hy - ny * hx); // |sin of turning angle|
        const pu = u + nx * h, pv = v + ny * h;
        if (pu < 0.02 || pu > 0.98 || pv < 0.02 || pv > 0.98) { alive = false; break; }
        const prox = field(pu, pv, dir);
        u = pu; v = pv; hx = nx; hy = ny;
        pts.push(u, v);
        tension.push(turn * 2.2 + prox);
        void alive;
      }
      if (pts.length < 24) continue; // discard stubs that died immediately
      strands.push({
        pts,
        tension,
        width: 0.55 + rand() * 0.55,
        alpha: 0.16 + rand() * 0.3,
      });
    }
  }

  // Cobalt threshold: top ~5% of tension samples — accent, not mass.
  const all: number[] = [];
  for (const s of strands) for (const t of s.tension) all.push(t);
  all.sort((a, b) => a - b);
  const cobaltAt = all[Math.floor(all.length * 0.95)] ?? 1;

  // Shuffle strand order so the reveal has no spatial sweep bias.
  for (let i = strands.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [strands[i], strands[j]] = [strands[j], strands[i]];
  }

  return { strands, cobaltAt };
}
