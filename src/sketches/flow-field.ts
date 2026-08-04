import p5 from 'p5';

// Dense, layered ribbons — single dark editorial system
export function createFlowField(p: p5, seedNum: number) {
  let t = 0;
  let pointer = { x: -9999, y: -9999, active: false };
  let target = { x: -9999, y: -9999, active: false };

  // Use low-alpha trails via semi-transparent backdrop instead of clear()
  p.setup = () => {
    const container = document.getElementById('canvas-container')!;
    const c = p.createCanvas(container.clientWidth, container.clientHeight);
    c.parent(container);
    p.noiseSeed(seedNum);
    p.randomSeed(seedNum);
    p.pixelDensity(Math.min(window.devicePixelRatio, 1.5));
    p.strokeCap(p.ROUND);
    p.strokeJoin(p.ROUND);
    // initial wash
    p.background(16, 17, 18);
  };

  p.windowResized = () => {
    const container = document.getElementById('canvas-container')!;
    p.resizeCanvas(container.clientWidth, container.clientHeight);
    p.background(16, 17, 18);
  };

  // track pointer on window (works even over text)
  const onMove = (x: number, y: number) => {
    target.x = x; target.y = y; target.active = true;
  };
  const onLeave = () => { target.active = false; };
  if (typeof window !== 'undefined') {
    window.addEventListener('pointermove', (e) => onMove(e.clientX, e.clientY), { passive: true });
    window.addEventListener('pointerdown', (e) => onMove(e.clientX, e.clientY), { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    window.addEventListener('pointerleave', onLeave);
    window.addEventListener('touchend', onLeave);
  }

  p.draw = () => {
    // smooth pointer follows
    pointer.x += (target.x - pointer.x) * 0.08;
    pointer.y += (target.y - pointer.y) * 0.08;
    if (!target.active) {
      // drift to center-off when idle
      pointer.x += (p.width * 0.62 - pointer.x) * 0.002;
      pointer.y += (p.height * 0.55 - pointer.y) * 0.002;
    }
    const active = target.active && p.mouseX > 0;

    // trail backdrop — very low alpha to keep ribbons lingering
    p.noStroke();
    // 16,17,18 = #101112
    p.fill(16, 17, 18, 36);
    p.rect(0, 0, p.width, p.height);

    t += 0.0045;

    // Layer 1 — long ribbons (primary, muted warm white)
    p.strokeWeight(0.85);
    for (let i = 0; i < 46; i++) {
      const baseX = (i / 46) * p.width + p.width * 0.02;
      const baseY = p.height * 0.08 + p.noise(i * 0.14, t * 0.6) * p.height * 0.78;
      let x = baseX, y = baseY;
      p.noFill();
      // alternate stroke: mostly muted, occasional accent
      const isAccent = p.random() < 0.14;
      if (isAccent) p.stroke(215, 246, 91, 56); // #d7f65b
      else p.stroke(242, 239, 232, 18);

      p.beginShape();
      p.vertex(x, y);
      for (let s = 0; s < 7; s++) {
        const n = p.noise(x * 0.0018 + t * 0.55, y * 0.0018 - t * 0.35);
        let ang = n * p.TWO_PI * 1.8 + p.noise(i * 0.3, s * 0.5) * 0.6;
        // pointer bends field broadly
        const dx = x - pointer.x, dy = y - pointer.y;
        const d = Math.hypot(dx, dy);
        const influence = active ? p.map(d, 0, 420, 1, 0, true) : p.map(d, 0, 700, 0.18, 0, true);
        if (influence > 0) {
          const pullAng = Math.atan2(dy, dx);
          ang += Math.sin(pullAng - ang) * influence * 1.15;
        }
        const len = 42 + n * 34;
        x += Math.cos(ang) * len;
        y += Math.sin(ang) * len;
        // keep within viewport with soft wrap
        x = (x + p.width) % p.width;
        y = (y + p.height) % p.height;
        p.vertex(x, y);
      }
      p.endShape();
    }

    // Layer 2 — fine grain threads (denser, lower contrast)
    p.strokeWeight(0.5);
    p.stroke(242, 239, 232, 9);
    for (let i = 0; i < 70; i++) {
      const x0 = p.random(p.width);
      const y0 = p.random(p.height);
      let x = x0, y = y0;
      p.beginShape();
      p.vertex(x, y);
      for (let s = 0; s < 4; s++) {
        const n = p.noise(x * 0.0035, y * 0.0035, t * 0.9);
        let ang = n * p.TWO_PI * 1.2;
        const d = Math.hypot(x - pointer.x, y - pointer.y);
        if (d < 340 && active) {
          ang += p.map(d, 0, 340, 0.55, 0) * Math.sin((x - pointer.x) * 0.01);
        }
        x += Math.cos(ang) * 18;
        y += Math.sin(ang) * 18;
        p.vertex(x, y);
      }
      p.endShape();
    }

    // Layer 3 — occasional particles that follow flow, accent
    p.noStroke();
    for (let i = 0; i < 18; i++) {
      const px = p.noise(i * 0.7, t * 0.45) * p.width;
      const py = p.noise(i * 0.7 + 10, t * 0.45 + 5) * p.height;
      const n = p.noise(px * 0.002, py * 0.002, t);
      const isAccent = n > 0.62;
      p.fill(isAccent ? 215 : 242, isAccent ? 246 : 239, isAccent ? 91 : 232, isAccent ? 90 : 22);
      const s = isAccent ? 1.8 : 1.1;
      p.circle(px, py, s);
    }

    // vignette — subtle center focus, keeps text legible without a card
    p.noStroke();
    // radial vignette via large rect with low-alpha center hole approximated by gradient rect
    // simple: darken edges
    const vig = p.drawingContext as CanvasRenderingContext2D;
    const g = vig.createRadialGradient(p.width * 0.42, p.height * 0.52, p.width * 0.28, p.width * 0.42, p.height * 0.52, p.width * 0.95);
    g.addColorStop(0, 'rgba(16,17,18,0)');
    g.addColorStop(1, 'rgba(16,17,18,0.42)');
    vig.fillStyle = g;
    vig.fillRect(0, 0, p.width, p.height);
  };
}
