(function () {
'use strict';

let Pixel = {
  create(x, y, width, height, color) {
    let obj = Object.create(this);
    obj.x = x;
    obj.y = y;
    obj.width = width;
    obj.height = height;
    obj.color = color;

    return obj;
  },

  draw(context) {
    context.fillStyle = this.color;
    context.beginPath();
    context.rect(this.x, this.y, this.width, this.height);
    context.fill();

    // Reset fill style
    context.fillStyle = '#000';
  }
};

let Screen = {
  pixels: null,
  numRows: 0,
  numCols: 0,
  pixelColor: '#222',
  pixelDim: 10,
  pixelSeparation: 1,
  create(width, height) {
    let obj = Object.create(this);
    obj.width = width;
    obj.height = height;
    obj._populatePixels();
    return obj;
  },

  lightPixel(x, y, color = 'yellow') {
    if(this._isInBounds(x, y)) {
      let index = Math.round(this.numCols * x + y);
      this.pixels[index].color = color;
    }
  },

  draw(context) {
    for (let i = 0; i < this.pixels.length; i++) {
      this.pixels[i].draw(context);
    }
  },

  redraw(context) {
    this.draw(context);
    for (let i = 0; i < this.pixels.length; i++) {
      this.pixels[i].color = this.pixelColor;
    }
  },

  _populatePixels() {
    let FACTOR = this.pixelDim + this.pixelSeparation;

    this.numRows = Math.floor(this.width / FACTOR);
    this.numCols = Math.floor(this.height / FACTOR);

    this.pixels = [];

    for (let row = 0; row < this.numRows; row++) {
      for (let col = 0; col < this.numCols; col++) {
        this.pixels.push(Pixel.create(row * FACTOR, col * FACTOR, this.pixelDim, this.pixelDim, this.pixelColor));
      }
    }
  },

  _isInBounds(x, y) {
    return (x >= 0 && x < this.numRows) && (y >= 0 && y < this.numCols);
  }
};

// Put all math functions in window cuz me lazy
Object.getOwnPropertyNames(Math).map(function(p) {
  window[p] = Math[p];
});

let canvas = document.getElementById('canvas-screen');
let context = canvas.getContext('2d');
let overlayCanvas = document.getElementById('canvas-overlay');
let overlayContext = overlayCanvas.getContext('2d');
let width = canvas.width = overlayCanvas.width =  window.innerWidth;
let height = canvas.height = overlayCanvas.height = window.innerHeight;

const s = Screen.create(width, height);

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

}());
