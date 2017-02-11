import screen from './Screen.js';

// Put all math functions in window cuz me lazy
Object.getOwnPropertyNames(Math).map(function(p) {
  window[p] = Math[p];
});

let canvas = document.getElementById('canvas-screen'),
  context = canvas.getContext('2d'),
  width = canvas.width = window.innerWidth,
  height = canvas.height = window.innerHeight;
 // 5 7 4 5 
 // 5 4
const BG_COLOR = '#101010';
const s = screen.create(width, height);

lineBres(0, 0, 32, 18);
lineDDA(5, 0, 32, 18);


document.getElementsByTagName('body')[0].setAttribute('bgcolor', BG_COLOR);
s.draw(context);

function lineDDA(x1, y1, x2, y2) {
  let dx = x2 - x1,
    dy = y2 - y1,
    steps;

  let xInc, yInc, x = x1, y = y1;
  steps = (abs(dx) > abs(dy)) ? abs(dx) : abs(dy);
  xInc = dx / steps;
  yInc = dy / steps;

  s.light(round(x), round(y));
  for(let k = 0; k < steps; k++) {
    x += xInc;
    y += yInc;
    s.light(round(x), round(y));
  }
}

function lineBres(x1, y1, x2, y2) {
  let dx, dy, d, de, dne;
  let x, y;

  dx = x2 - x1;
  dy = y2 - y1;
  x = x1;
  y = y1;

  if(dx < dy) {
    let t = dx;
    dx = dy;
    dy = t;
  } 
  d = 2 * dy - dx;
  de = 2 * dy;
  dne = 2 * (dy - dx);

  s.light(round(x), round(y), 'blue');
  while(x < x2) {
    if(d <= 0) {
      d += de;
    } else {
      d += dne;
      y += 1;
    }
    x += 1;
    s.light(round(x), round(y), 'blue');
  }
}