import Pixel from './Pixel.js';

let Screen = {
  pixels: null,
  numRows: 0,
  numCols: 0,
  pixelColor: '#222',
  pixelDim: 10,
  pixelSeparation: 2,
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
    return (x >= 0 && x < this.numCols) && (y >= 0 && y < this.numRows);
  }
};

export default Screen;