// Cross-browser stuff
window.URL = window.URL || window.webkitURL;
navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

// Loop engine, used to draw the video to the canvas endlessly
function animLoop(render, element) {
  var running, lastFrame = +new Date;
  function loop(now) {
    if (running !== false) {
      requestAnimationFrame(loop, element);
      running = render(now - lastFrame);
      lastFrame = now;
    }
  }
  loop(lastFrame);
}