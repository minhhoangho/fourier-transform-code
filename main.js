const FILE_PATH = "./sgroup.json"
let DATA = []



fetch(FILE_PATH).then( async (res) => {
  DATA = await res.json()
})

let x = [];
let y = [];

let fourierX = [];
let fourierY = [];

let time = 0;
let path = [];



function setup() {
  createCanvas(900, 600);
  const skip = 12;
  for (let i = 0; i < DATA?.length; i += skip) {
    x.push(DATA[i].x);
    y.push(DATA[i].y);
  }

  fourierY = dft(y);
  fourierX = dft(x);
  fourierX.sort((a, b) => b.amp - a.amp);
  fourierY.sort((a, b) => b.amp - a.amp);
}

function drawCycles(x, y, rotation, fourier) {
  for (let i = 0; i < fourierY.length; i++) {
    let prevX = x;
    let prevY = y;

    let freq = fourier[i].freq;
    let radius = fourier[i].amp;
    let phase = fourier[i].phase;

    x += radius * cos(freq * time + phase + rotation);
    y += radius * sin(freq * time + phase + rotation);

    stroke(255, 100);
    noFill();
    ellipse(prevX, prevY, radius * 2);

    stroke(255);
    line(prevX, prevY, x, y);
  }
  return createVector(x, y);
}

function draw() {
  background(0);
  let vx = drawCycles(width / 4 + 100, 100, 0, fourierX);
  let vy = drawCycles(100, height / 4 + 10, PI / 2, fourierY);
  let v = createVector(vx.x, vy.y);

  path.unshift(v);
  line(vx.x, vx.y, v.x, v.y);
  line(vy.x, vy.y, v.x, v.y);

  beginShape();
  noFill();
  for (let i = 0; i < path.length; i++) {
    vertex(path[i].x, path[i].y);
  }
  endShape();

  const dt = (2 * PI) / fourierY.length;
  time += dt;

  if (time > TWO_PI) {
    time = 0;
    path = [];
  }
  stop()
}





