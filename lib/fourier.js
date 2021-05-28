// Refference: https://www.algorithm-archive.org/contents/cooley_tukey/cooley_tukey.html

function dft(x) {
  N = x.length || [];
  let X = [];
  for (let k = 0; k < N; k++) {
    let re = 0;
    let im = 0;
    for (let n = 0; n < N; n++) {
      let phi = (2 * PI * k * n) / N;
      re += x[n] * cos(phi);
      im += x[n] * sin(phi);
    }
    re /= N;
    im /= N;
    let freq = k;
    let amp = sqrt(re * re + im * im);
    let phase = atan2(im, re);
    X[k] = {
      re,
      im,
      freq,
      amp,
      phase,
    };
  }
  return X;
}
