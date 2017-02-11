import screen from './Screen.js';

let canvas = document.getElementById('canvas-screen'),
  context = canvas.getContext('2d'),
  width = canvas.width = window.innerWidth,
  height = canvas.height = window.innerHeight;
  
const BG_COLOR = '#101010';
const s = screen.create(width, height);

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