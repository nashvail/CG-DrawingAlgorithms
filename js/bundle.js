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

const PIXEL_COLOR = '#222';
const PIXEL_DIM = 20;
const PIXEL_SEPARATION = 5;
const FACTOR = PIXEL_DIM + PIXEL_SEPARATION;

let Screen = {
  pixels: null,
  numRows: 0,
  numCols: 0,
  create(width, height) {
    let obj = Object.create(this);
    obj.width = width;
    obj.height = height;
    obj._populatePixels();
    return obj;
  },
  light(x, y) {
    if ((x > 0 && x < this.numCols) &&
      (y > 0 && y < this.numRows)) {

      let index = this.numCols * x + y;
      this.pixels[index].color = 'yellow';
    }
  },

  draw(context) {
    for (let i = 0; i < this.pixels.length; i++) {
      this.pixels[i].draw(context);
    }
  },

  _populatePixels() {
    this.numRows = Math.floor(this.width / FACTOR);
    this.numCols = Math.floor(this.height / FACTOR);

    this.pixels = [];

    for (let row = 0; row < this.numRows; row++) {
      for (let col = 0; col < this.numCols; col++) {
        this.pixels.push(Pixel.create(row * FACTOR, col * FACTOR, PIXEL_DIM, PIXEL_DIM, PIXEL_COLOR));
      }
    }
  }

};

let canvas = document.getElementById('canvas-screen');
let context = canvas.getContext('2d');
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
  
const BG_COLOR = '#101010';
const s = Screen.create(width, height);

let p1 = {
  x: 0,
  y: 0
};

let p2 = {
  x: 20,
  y: 15
};

let p = {
  x: 0,
  y: 0
};

let m = (p2.y - p1.y) / (p2.x - p1.x); // Slope of the line
p.x = p1.x;
p.y = p1.y;

s.light(p.x, p.y);
while(p.x <= p2.x) {
  let newX, newY;
  if(m < 1) {
    p.x += 1;
    p.y += m;
    s.light(p.x, Math.floor(p.y));
  }
  if(m > 1) {
    p.y += 1;
    p.x += (1/m);
    s.light(Math.floor(p.x), p.y);
  } 
  if(m == 1) {
    p.x += 1;
    p.y += 1;
    s.light(p.x, p.y);
  }
}

s.draw(context);


document.getElementsByTagName('body')[0].setAttribute('bgcolor', BG_COLOR);
// update();

}());
