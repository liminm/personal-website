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
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h) % 1000000;
}

const seedStr = getSeed();
const seedNum = hashSeed(seedStr);

let instance: p5 | null = null;
const container = document.getElementById('canvas-container');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// static fallback for reduced-motion: draw one frame and stop
if (container) {
  if (reduce) {
    instance = new p5((p: p5) => {
      createFlowField(p, seedNum);
      const origDraw = p.draw;
      p.draw = () => {
        if (origDraw) origDraw.call(p);
        p.noLoop();
      };
    });
  } else {
    instance = new p5((p: p5) => createFlowField(p, seedNum));
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!instance) return;
        if (e.isIntersecting) instance.loop();
        else instance.noLoop();
      });
    }, { threshold: 0 });
    obs.observe(container);
  }
}

// quiet caption — collapsed about disclosure
const panel = document.getElementById('about-panel') as HTMLElement | null;
const toggle = document.getElementById('about-toggle') as HTMLButtonElement | null;
const openBtn = document.getElementById('about-open') as HTMLButtonElement | null;
const closeBtn = document.getElementById('about-close') as HTMLButtonElement | null;
function setAbout(open: boolean) {
  if (!panel || !toggle) return;
  panel.hidden = !open;
  toggle.setAttribute('aria-expanded', String(open));
  openBtn?.setAttribute('aria-expanded', String(open));
  if (open) panel.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}
toggle?.addEventListener('click', () => setAbout(panel!.hidden));
openBtn?.addEventListener('click', () => setAbout(true));
closeBtn?.addEventListener('click', () => setAbout(false));
