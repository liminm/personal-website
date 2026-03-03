import p5 from 'p5';

// Deterministic seed from URL or date
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

const sketch = (p: p5) => {
  let t = 0;
  const cols = 28, rows = 18;
  let field: number[][] = [];

  p.setup = () => {
    const container = document.getElementById('canvas-container')!;
    const c = p.createCanvas(container.clientWidth, container.clientHeight);
    c.parent(container);
    p.noiseSeed(seedNum);
    p.randomSeed(seedNum);
    // build flow angles
    field = Array.from({length: cols}, () => Array.from({length: rows}, () => p.random(p.TWO_PI)));
    p.strokeWeight(0.9);
    // DPR cap
    p.pixelDensity(Math.min(window.devicePixelRatio, 1.5));
  };

  p.windowResized = () => {
    const container = document.getElementById('canvas-container')!;
    p.resizeCanvas(container.clientWidth, container.clientHeight);
  };

  p.draw = () => {
    p.clear();
    // very light bg wash
    p.noStroke();
    p.fill(250, 249, 246, 18);
    p.rect(0,0,p.width,p.height);

    t += 0.006;
    const s = 42; // step
    p.stroke(10, 10, 11, 38);
    for (let x=0; x<cols; x++) {
      for (let y=0; y<rows; y++) {
        const px = (x/cols)*p.width + p.width*0.06;
        const py = (y/rows)*p.height + p.height*0.08;
        const n = p.noise(x*0.18 + t, y*0.18 + t*0.8);
        const ang = field[x][y] + n * 6.28;
        // subtle mouse repulsion
        let mx = p.mouseX, my = p.mouseY;
        let dx = px - mx, dy = py - my;
        let d = Math.hypot(dx, dy);
        let repel = 0;
        if (d < 140 && p.mouseX > 0) repel = p.map(d, 0, 140, 0.9, 0);
        const len = 18 + n*10;
        const nx = Math.cos(ang + repel) * len;
        const ny = Math.sin(ang + repel) * len;
        p.line(px, py, px + nx, py + ny);
        // dot
        p.fill(10,10,11, 55);
        p.noStroke();
        p.circle(px, py, 1.3);
        p.stroke(10,10,11, 38);
      }
    }
    // accent bar at bottom
    // keep loop gentle for reduced-motion users handled via CSS; we also noLoop when hidden
  };
};

// IntersectionObserver to pause when offscreen
let instance: p5 | null = null;
const container = document.getElementById('canvas-container');
if (container && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  instance = new p5(sketch);
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!instance) return;
      if (e.isIntersecting) instance.loop(); else instance.noLoop();
    });
  }, {threshold: 0});
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
