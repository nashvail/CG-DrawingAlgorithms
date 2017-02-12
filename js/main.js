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
  width = canvas.width = overlayCanvas.width =  window.innerWidth,
  height = canvas.height = overlayCanvas.height = window.innerHeight;

const s = screen.create(width, height);

let screenFactor = s.pixelDim + s.pixelSeparation;
let p1 = {x: 0, y: 0};

update();
function update() {
  context.clearRect(0, 0, width, height);
  circleMidPoint(40, 40, 10);
  circleMidPoint(80, 40, 10);
  lineDDA(50, 40, 70, 40);
  s.draw(context);

  // requestAnimationFrame(dUpdate);
}

// Algorithms

// DDA Line drawing algorithm
function lineDDA(x1, y1, x2, y2) {
  let dx = x2 - x1,
    dy = y2 - y1,
    steps;

  let xInc, yInc, x = x1, y = y1;
  steps = (abs(dx) > abs(dy)) ? abs(dx) : abs(dy);
  xInc = dx / steps;
  yInc = dy / steps;

  s.lightPixel(round(x), round(y));
  for(let k = 0; k < steps; k++) {
    x += xInc;
    y += yInc;
    s.lightPixel(round(x), round(y));
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

  s.lightPixel(round(x), round(y), 'blue');
  while(x < x2) {
    if(p < 0) {
      p += twoDy;
    } else {
      p += twoDyDx;
      y += 1;
    }
    x += 1;
    s.lightPixel(round(x), round(y), 'blue');
  }
}

function circleMidPoint(xCenter, yCenter, radius) {
  if(radius <= 0) return;
  let x = 0,
    y = radius,
    p = 1 - radius;

  // Plot first set of points
  circlePlotPoints(xCenter, yCenter, x, y);
  while(x <= y) {
    x++;
    if(p < 0) // Mid point is inside therefore y remains same
      p += 2 * x + 1;
    else { // Mid point is outside the circle so y decreases
      y--;
      p += 2 * (x - y) + 1;
    }
    circlePlotPoints(xCenter, yCenter, x, y);
  }

  function circlePlotPoints() {
    s.lightPixel(xCenter + x, yCenter + y);
    s.lightPixel(xCenter + y, yCenter + x);

    s.lightPixel(xCenter - x, yCenter + y);
    s.lightPixel(xCenter - y, yCenter + x);

    s.lightPixel(xCenter + x, yCenter - y);
    s.lightPixel(xCenter + y, yCenter - x);

    s.lightPixel(xCenter - x, yCenter - y);
    s.lightPixel(xCenter - y, yCenter - x);
  }
}
