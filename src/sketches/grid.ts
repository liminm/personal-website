import p5 from 'p5';

export function createGrid(p: p5, seedNum: number) {
  p.setup = () => {
    const parent = p.canvas.parentElement!;
    const c = p.createCanvas(parent.clientWidth, 160);
    c.parent(parent);
    p.randomSeed(seedNum);
    p.noLoop();
  };
  p.draw = () => {
    p.clear();
    p.background(255);
    const cols = 7, rows = 5;
    const cw = p.width / cols, rh = p.height / rows;
    p.noFill(); p.stroke(10,10,11, 55); p.strokeWeight(0.8);
    for (let x=0;x<cols;x++) for (let y=0;y<rows;y++) {
      const px = x*cw + 8, py = y*rh + 8;
      const w = cw -16, h = rh -16;
      const r = p.random([0,1,2]);
      if (r===0) p.rect(px, py, w, h, 2);
      else if (r===1) { p.circle(px+w/2, py+h/2, Math.min(w,h)*0.9); p.line(px+w/2, py, px+w/2, py+h); }
      else { p.line(px, py, px+w, py+h); p.line(px+w, py, px, py+h); p.rect(px, py, w, h, 2); }
      // accent dot seeded
      if (p.random() > 0.6) { p.fill(224,255,90); p.noStroke(); p.circle(px+w-4, py+4, 6); p.noFill(); p.stroke(10,10,11,55); }
    }
  };
}
