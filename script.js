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

// Initializing our elements
var video = document.querySelector('video');
var canvas = document.querySelector('canvas'), ctx = canvas.getContext('2d');
var mediaStream = null;

// Filter handler
var filterHandler = {
  els : [].slice.call(document.querySelectorAll('.filters button')),
  states : {
    bw : false,
    hue120 : false,
    contrast : false
  },
  handleEvent : function(e) {
    var filter = e.target.dataset.filter;
    this.states[filter] = !this.states[filter];

    var style = '';
    if(this.states.bw) {
      style += 'grayscale(1) ';
    }
    if(this.states.hue120) {
      style += 'hue-rotate(120deg) ';
    }
    if(this.states.contrast) {
      style += 'contrast(250%) ';
    }
    canvas.style.webkitFilter = style;
  },
  init : function() {
    this.els.forEach(function(item, index, array) {
      item.addEventListener('click', filterHandler);
    });
  }
};
filterHandler.init();

// Transform handler
var transformHandler = {
  current : 'standard',
  els : [].slice.call(document.querySelectorAll('.transforms button')),
  handleEvent : function(e) {
    this.current = e.target.dataset.transform;
  },
  init : function() {
    this.els.forEach(function(item, index, array) {
      item.addEventListener('click', transformHandler);
    });
  }
};
transformHandler.init();

var video2canvasDrawer = {
  standard: function(video, ctx) {
    var canvas = ctx.canvas;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  },
  split4: function(video, ctx) {
    var canvas = ctx.canvas;
    var w = video.videoWidth, h = video.videoHeight;
    ctx.drawImage(video, w/2, h/2, w/2, h/2, 0, 0, canvas.width/2, canvas.height/2);
    ctx.drawImage(video, 0, 0, w/2, h/2, canvas.width/2, canvas.height/2, canvas.width/2, canvas.height/2);
    ctx.drawImage(video, 0, h/2, w/2, h/2, canvas.width/2, 0, canvas.width/2, canvas.height/2);
    ctx.drawImage(video, w/2, 0, w/2, h/2, 0, canvas.height/2, canvas.width/2, canvas.height/2);
  },
  rotate4: function(video, ctx) {
    var canvas = ctx.canvas;
    var w = video.videoWidth, h = video.videoHeight;
    ctx.drawImage(video, 0, 0, w/2, h/2, 0, 0, canvas.width/2, canvas.height/2);
    
    ctx.save();
    ctx.rotate(Math.PI/2);
    ctx.drawImage(video, 0, 0, w/2, h/2, 0, -canvas.width, canvas.height/2, canvas.width/2);
    ctx.restore();

    ctx.save();
    ctx.rotate(Math.PI);
    ctx.drawImage(video, 0, 0, w/2, h/2, -canvas.width, -canvas.height, canvas.width/2, canvas.height/2);
    ctx.restore();

    ctx.save();
    ctx.rotate(-Math.PI/2);
    ctx.drawImage(video, 0, 0, w/2, h/2, -canvas.height, 0, canvas.height/2, canvas.width/2);
    ctx.restore();
  },
  hFlip: function(video, ctx) {
    var canvas = ctx.canvas;
    var w = video.videoWidth, h = video.videoHeight;
    ctx.drawImage(video, 0, 0, w/2, h, 0, 0, canvas.width/2, canvas.height);
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, w/2, h, -canvas.width, 0, canvas.width/2, canvas.height);
    ctx.restore();
  },
  flipAll: function(video, ctx) {
    var canvas = ctx.canvas;
    var w = video.videoWidth, h = video.videoHeight;
    ctx.drawImage(video, 0, 0, w/2, h/2, 0, 0, canvas.width/2, canvas.height/2);

    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, w/2, h/2, -canvas.width, 0, canvas.width/2, canvas.height/2);
    ctx.restore();

    ctx.save();
    ctx.scale(1, -1);
    ctx.drawImage(video, 0, 0, w/2, h/2, 0, -canvas.height, canvas.width/2, canvas.height/2);
    ctx.restore();

    ctx.save();
    ctx.scale(-1, -1);
    ctx.drawImage(video, 0, 0, w/2, h/2, -canvas.width, -canvas.height, canvas.width/2, canvas.height/2);
    ctx.restore();
  }
};

// Requesting the video feed from the cam and streaming it to the video tag
navigator.getUserMedia({video: true}, function(stream) {
  mediaStream = stream;
  video.src = window.URL.createObjectURL(mediaStream);
});

// Drawing the video to the canvas
animLoop(function(deltaT) {
  video2canvasDrawer[transformHandler.current](video, ctx);
});