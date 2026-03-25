import p5 from 'p5';

export function createParticles(p: p5, seedNum: number) {
  const count = 90;
  let pts: { x: number; y: number; vx: number; vy: number }[] = [];
  p.setup = () => {
    const parent = p.canvas.parentElement!;
    const c = p.createCanvas(parent.clientWidth, 160);
    c.parent(parent);
    p.randomSeed(seedNum);
    p.noiseSeed(seedNum);
    pts = Array.from({ length: count }, () => ({
      x: p.random(p.width), y: p.random(p.height),
      vx: p.random(-0.6, 0.6), vy: p.random(-0.6, 0.6)
    }));
    p.strokeWeight(0.7);
  };
  p.draw = () => {
    p.clear();
    p.background(249, 250, 251, 0);
    for (const pt of pts) {
      pt.x += pt.vx + p.noise(pt.x*0.01, p.frameCount*0.01)*0.4 -0.2;
      pt.y += pt.vy + p.noise(pt.y*0.01, p.frameCount*0.01)*0.4 -0.2;
      if (pt.x < 0) pt.x = p.width; if (pt.x > p.width) pt.x = 0;
      if (pt.y < 0) pt.y = p.height; if (pt.y > p.height) pt.y = 0;
      // trail dot
      p.noStroke(); p.fill(10,10,11, 38); p.circle(pt.x, pt.y, 2.2);
    }
    // connections
    p.stroke(10,10,11, 22);
    for (let i=0;i<pts.length;i++) for (let j=i+1;j<pts.length;j++) {
      const d = Math.hypot(pts[i].x-pts[j].x, pts[i].y-pts[j].y);
      if (d < 28) p.line(pts[i].x, pts[i].y, pts[j].x, pts[j].y);
    }
  };
}
