// Initializing our elements
var video = document.querySelector('video');
var canvas = document.querySelector('canvas#video'),
  ctx = canvas.getContext('2d');
var overlay = document.querySelector('canvas#overlay'),
  ctxOverlay = overlay.getContext('2d');
var mediaStream = null;

// Init the snapshot shit up
overlay.addEventListener('click', function(e) {
  // FIXME: overlays are not save here, need to get imageData from both canvas, then draw both to another canvas and save this one instead
  document.location.href = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
});

// Transform UI init
var transformBtns = [].slice.call(document.querySelectorAll('.transforms button'));
var currentTransform = 'standard';
transformBtns.forEach(function(item, index, array) {
  item.addEventListener('click', function(e) {
    currentTransform = e.target.dataset.transform;
  });
});

// Overlay handler
var overlayHandler = new CanvasOverlay(ctxOverlay);
var overlayBtns = [].slice.call(document.querySelectorAll('.overlays button'));
overlayBtns.forEach(function(item, index, array) {
  item.addEventListener('click', function(e) {
    overlayHandler.use(e.target.dataset.overlay);
  });
});

// Effect handler
var effects = new CanvasEffect(ctx);
var filterBtns = [].slice.call(document.querySelectorAll('.filters button'));
filterBtns.forEach(function(item, index, array) {
  item.addEventListener('click', function(e) {
    effects.remove();
    effects.add(e.target.dataset.filter);
  });
});

// Requesting the video feed from the cam and streaming it to the video tag
navigator.getUserMedia({
  video: true
}, function(stream) {
  mediaStream = stream;
  video.src = window.URL.createObjectURL(mediaStream);
});


// Drawing the video to the canvas
animLoop(function(deltaT) {
  video2canvasDrawer[currentTransform](video, ctx);
  ctx.putImageData(effects.transform(ctx.getImageData(0, 0, canvas.width, canvas.height)), 0, 0);
});