import p5 from 'p5';
import { createFlowField } from './sketches/flow-field';

function getSeed(): string {
  const params = new URLSearchParams(location.search);
  const urlSeed = params.get('seed');
  if (urlSeed) return urlSeed;
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
}
function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i=0;i<s.length;i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h) % 1000000;
}

const seedStr = getSeed();
const seedNum = hashSeed(seedStr);
const seedEl = document.getElementById('seed-display');
if (seedEl) seedEl.textContent = `seed ${seedStr} · ${seedNum}`;

let instance: p5 | null = null;
const container = document.getElementById('canvas-container');
if (container && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  instance = new p5((p: p5) => createFlowField(p, seedNum));
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!instance) return;
      if (e.isIntersecting) instance.loop(); else instance.noLoop();
    });
  }, { threshold: 0 });
  obs.observe(container);
}

document.getElementById('regen')?.addEventListener('click', () => {
  const s = `${Date.now()}`;
  const u = new URL(location.href);
  u.searchParams.set('seed', s);
  location.href = u.toString();
});
document.getElementById('save')?.addEventListener('click', () => {
  if (instance) instance.saveCanvas(`liminm-${seedStr}`, 'png');
});
window.addEventListener('keydown', (e) => {
  if (e.key === 'r') document.getElementById('regen')?.click();
  if (e.key === 's') document.getElementById('save')?.click();
});
