import Pixel from './Pixel.js';

const PIXEL_COLOR = '#222',
  PIXEL_DIM = 20,
  PIXEL_SEPARATION = 5,
  FACTOR = PIXEL_DIM + PIXEL_SEPARATION;

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

export default Screen;