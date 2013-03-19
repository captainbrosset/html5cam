var CanvasOverlay = function(ctx) {
  this._current = 'standard';
  this.ctx = ctx;
};

CanvasOverlay.prototype.use = function(overlay) {
  if (overlay in this.overlays) {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.overlays[overlay](this.ctx);
  }
};

CanvasOverlay.prototype.overlays = {
  standard: function(ctx) {},
  lines: function(ctx) {
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.translate(ctx.canvas.width, -ctx.canvas.height);
    ctx.rotate(Math.PI/4);
    for(var i = 0; i < ctx.canvas.width*2; i += 5) {
      ctx.fillRect(i, 0, 3, ctx.canvas.height*3);
    }
    ctx.restore();
  }
};