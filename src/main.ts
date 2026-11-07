import { weave, hashSeed, type Weave } from './growth';

function getSeed(): string {
  const params = new URLSearchParams(location.search);
  const urlSeed = params.get('seed');
  if (urlSeed) return `url:${urlSeed}`;
  const rnd = Math.random().toString(36).slice(2, 9);
  return `visit:${rnd}`;
}

const canvas = document.getElementById('study') as HTMLCanvasElement | null;
const seedLabel = document.getElementById('seed-label');
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

// Cached geometry: regenerated only when the seed changes, so resize
// re-maps the same composition instead of growing a new one.
let cachedSeed = '';
let cachedWeave: Weave | null = null;
let rafId = 0;
let settled = false;

function drawWeave(
  ctx: CanvasRenderingContext2D,
  cssW: number,
  cssH: number,
  w: Weave,
  p: number,
): void {
  const N = w.strands.length;
  // cover-fit: same logical composition on any viewport, overflow cropped
  const s = Math.max(cssW, cssH);
  const ox = (cssW - s) / 2;
  const oy = (cssH - s) / 2;
  const X = (u: number): number => ox + u * s;
  const Y = (v: number): number => oy + v * s;
  const local = (q: number, j: number): number => {
    const start = (j / Math.max(1, N)) * 0.35;
    return Math.min(1, Math.max(0, (q - start) / 0.65));
  };
  ctx.clearRect(0, 0, cssW, cssH);
  for (let j = 0; j < N; j++) {
    const st = w.strands[j];
    const nPts = st.pts.length / 2;
    const upto = 1 + Math.floor(local(p, j) * (nPts - 1));
    if (upto < 2) continue;
    ctx.strokeStyle = `rgba(30, 33, 38, ${st.alpha})`;
    ctx.lineWidth = st.width;
    ctx.beginPath();
    ctx.moveTo(X(st.pts[0]), Y(st.pts[1]));
    for (let k = 1; k < upto; k++) ctx.lineTo(X(st.pts[k * 2]), Y(st.pts[k * 2 + 1]));
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(35, 71, 255, 0.42)';
  for (let j = 0; j < N; j++) {
    const st = w.strands[j];
    const nPts = st.pts.length / 2;
    const upto = 1 + Math.floor(local(p, j) * (nPts - 1));
    if (upto < 2) continue;
    ctx.lineWidth = st.width + 0.25;
    ctx.beginPath();
    let pen = false;
    for (let k = 1; k < upto; k++) {
      if (st.tension[k] >= w.cobaltAt) {
        if (!pen) { ctx.moveTo(X(st.pts[(k - 1) * 2]), Y(st.pts[(k - 1) * 2 + 1])); pen = true; }
        ctx.lineTo(X(st.pts[k * 2]), Y(st.pts[k * 2 + 1]));
      } else {
        pen = false;
      }
    }
    ctx.stroke();
  }
}

function render(): void {
  if (!canvas) return;
  const host = canvas.parentElement;
  if (!host) return;
  cancelAnimationFrame(rafId);
  const rect = host.getBoundingClientRect();
  const cssW = Math.max(280, rect.width);
  const cssH = Math.max(320, Math.min(560, cssW * 1.02));
  const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

  canvas.style.width = `${cssW}px`;
  canvas.style.height = `${cssH}px`;
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const seedStr = getSeed();
  if (seedLabel) seedLabel.textContent = seedStr.replace(/^visit:/, 'study ').replace(/^url:/, 'study ');
  if (seedStr !== cachedSeed || !cachedWeave) {
    cachedWeave = weave(hashSeed(seedStr));
    cachedSeed = seedStr;
    settled = false;
  }
  const w = cachedWeave;

  if (motionQuery.matches || w.strands.length === 0) {
    drawWeave(ctx, cssW, cssH, w, 1);
    settled = true;
    return;
  }
  if (settled) {
    // Resize after the entrance finished: keep the settled frame, no replay.
    drawWeave(ctx, cssW, cssH, w, 1);
    return;
  }
  drawWeave(ctx, cssW, cssH, w, 0.35);
  const duration = 4200;
  const t0 = performance.now();
  const frame = (now: number) => {
    const t = Math.min(1, (now - t0) / duration);
    const eased = 1 - Math.pow(1 - t, 2.1);
    drawWeave(ctx, cssW, cssH, w, 0.35 + 0.65 * eased);
    if (t < 1) {
      rafId = requestAnimationFrame(frame);
    } else {
      settled = true;
    }
  };
  rafId = requestAnimationFrame(frame);
}

let timer: number | undefined;
function schedule(): void {
  window.clearTimeout(timer);
  timer = window.setTimeout(render, 120);
}

// Runtime preference change: stop motion and show the finished frame.
motionQuery.addEventListener('change', () => render());

render();
window.addEventListener('resize', schedule);
