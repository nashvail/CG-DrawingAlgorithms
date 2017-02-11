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
  pixelDim: 33,
  pixelSeparation: 3,
  create(width, height) {
    let obj = Object.create(this);
    obj.width = width;
    obj.height = height;
    obj._populatePixels();
    return obj;
  },

  light(x, y, color = 'yellow') {
    if(this._isInBounds(x, y)) {
      let index = this.numCols * x + y;
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
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const BG_COLOR = '#101010';
const s = Screen.create(width, height);

let screenFactor = s.pixelDim + s.pixelSeparation;
let p1 = {x: 0, y: 0};
let p2 = {x: 1, y: 1};

console.log(s.numRows);
console.log(s.numCols);

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

}());
