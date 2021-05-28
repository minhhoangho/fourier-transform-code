let time = 0;
let wave = []
const numCircle = 5
function setup() {
  createCanvas(600, 400);
  // y = [100, 100, -100, -100]
  // fourierY = dft(y)
}


function draw() {
  background(0);
  translate(150, 200)
  let x = 0;
  let y = 0;
  for (let i = 0; i < numCircle; i++) {
    let prevX = x;
    let prevY = y;
    let n = i * 2 + 1;
    let radius = 75 * (4 / (n* PI))
    x += radius * cos(n * time)
    y += radius * sin(n * time)
    
    stroke(255, 100);
    noFill();
    ellipse(prevX, prevY, radius * 2);
    
    stroke(255)
    line(prevX, prevY, x, y)
  }
  wave.unshift(y);


  translate(200, 0)
  line(x - 200, y, 0, wave[0])


  beginShape();
  noFill();
  for (let i = 0; i < wave.length; i++) {
    vertex(i, wave[i])
    
  }
  endShape();

  time+=0.05

  if (wave.length > 250) {
    wave.pop()
  } 
}