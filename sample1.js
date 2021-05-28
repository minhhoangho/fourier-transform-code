let y = [];

let time = 0;
let wave = [];

function setup() {
  createCanvas(600, 400);
  let angle = 0
  for (let i = 0; i < 100; i++) {
    const val = 500 * noise(angle) - 250
    y.push(val)
    angle+= 0.02
  }
  fourierY = dft(y);
}

function draw() {
  background(0);
  translate(150, 200);
  let x = 0;
  let y = 0;
  for (let i = 0; i < fourierY.length; i++) {
    let prevX = x;
    let prevY = y;

    let freq = fourierY[i].freq;
    let radius = fourierY[i].amp;
    let phase = fourierY[i].phase;

    x += radius * cos(freq * time + phase + PI/2);
    y += radius * sin(freq * time + phase + PI/2);

    stroke(255, 100);
    noFill();
    ellipse(prevX, prevY, radius * 2);

    stroke(255);
    line(prevX, prevY, x, y);
  }
  wave.unshift(y);

  translate(200, 0);
  line(x - 200, y, 0, wave[0]);

  beginShape();
  noFill();
  for (let i = 0; i < wave.length; i++) {
    vertex(i, wave[i]);
  }
  endShape();


  const dt = 2 * PI / fourierY.length
  time += dt;

  if (wave.length > 250) {
    wave.pop();
  }
}
