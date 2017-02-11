import screen from './Screen.js';
import u from './utils.js';

// Put all math functions in window cuz me lazy
Object.getOwnPropertyNames(Math).map(function(p) {
  window[p] = Math[p];
});

let canvas = document.getElementById('canvas-screen'),
  context = canvas.getContext('2d'),
  overlayCanvas = document.getElementById('canvas-overlay'),
  overlayContext = overlayCanvas.getContext('2d'),
  width = canvas.width = window.innerWidth,
  height = canvas.height = window.innerHeight;

const BG_COLOR = '#101010';
const s = screen.create(width, height);

let screenFactor = s.pixelDim + s.pixelSeparation;
let p1 = {x: 0, y: 0};
let p2 = {x: 1, y: 1};

document.addEventListener('mousemove', function(event) {
  p2.x = floor(event.clientX / screenFactor);
  p2.y = floor(event.clientY / screenFactor);
});

function update() {
  context.clearRect(0, 0, width, height);

  lineDDA(p1.x, p1.y, p2.x, p2.y);
  s.redraw(context);

  requestAnimationFrame(update);
}

document.getElementsByTagName('body')[0].setAttribute('bgcolor', BG_COLOR);
update();

// DDA Line drawing algorithm
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

// Bresenham's line drawing algorithm
function lineBres(x1, y1, x2, y2) {
  let dx, dy, p, twoDy, twoDyDx;
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
  p = 2 * dy - dx;
  twoDy = 2 * dy;
  twoDyDx = 2 * (dy - dx);

  s.light(round(x), round(y), 'blue');
  while(x < x2) {
    if(p < 0) {
      p += twoDy;
    } else {
      p += twoDyDx;
      y += 1;
    }
    x += 1;
    s.light(round(x), round(y), 'blue');
  }
}