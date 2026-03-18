import p5 from 'p5';

export function createFlowField(p: p5, seedNum: number) {
  let t = 0;
  const cols = 28, rows = 18;
  let field: number[][] = [];

  p.setup = () => {
    const container = document.getElementById('canvas-container')!;
    const c = p.createCanvas(container.clientWidth, container.clientHeight);
    c.parent(container);
    p.noiseSeed(seedNum);
    p.randomSeed(seedNum);
    field = Array.from({ length: cols }, () =>
      Array.from({ length: rows }, () => p.random(p.TWO_PI))
    );
    p.strokeWeight(0.9);
    p.pixelDensity(Math.min(window.devicePixelRatio, 1.5));
  };

  p.windowResized = () => {
    const container = document.getElementById('canvas-container')!;
    p.resizeCanvas(container.clientWidth, container.clientHeight);
  };

  p.draw = () => {
    p.clear();
    p.noStroke();
    p.fill(250, 249, 246, 18);
    p.rect(0, 0, p.width, p.height);

    t += 0.006;
    p.stroke(10, 10, 11, 38);
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        const px = (x / cols) * p.width + p.width * 0.06;
        const py = (y / rows) * p.height + p.height * 0.08;
        const n = p.noise(x * 0.18 + t, y * 0.18 + t * 0.8);
        let ang = field[x][y] + n * 6.28;
        // subtle mouse repulsion
        const mx = p.mouseX, my = p.mouseY;
        const dx = px - mx, dy = py - my;
        const d = Math.hypot(dx, dy);
        let repel = 0;
        if (d < 140 && p.mouseX > 0) repel = p.map(d, 0, 140, 0.9, 0);
        ang += repel;
        const len = 18 + n * 10;
        const nx = Math.cos(ang) * len;
        const ny = Math.sin(ang) * len;
        p.line(px, py, px + nx, py + ny);
        p.fill(10, 10, 11, 55);
        p.noStroke();
        p.circle(px, py, 1.3);
        p.stroke(10, 10, 11, 38);
      }
    }
  };
}
