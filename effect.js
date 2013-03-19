// FIXME : only one effect at a time, remove the _appliedEffects and do the removeAll and add here instead of script.js
var CanvasEffect = function(ctx) {
  this._appliedEffects = [];
};

CanvasEffect.prototype.add = function(effect) {
  if (effect in this.effects && this._appliedEffects.indexOf(effect) === -1) {
    this._appliedEffects.push(effect);
  }
};

CanvasEffect.prototype.remove = function(effect) {
  if (!effect) {
    this._appliedEffects = [];
  } else {
    var index = this._appliedEffects.indexOf(effect);
    if (index > -1) {
      this._appliedEffects.splice(index, 1);
    }
  }
};

CanvasEffect.prototype.toggle = function(effect) {
  if (this._appliedEffects.indexOf(effect) === -1) {
    this.add(effect);
  } else {
    this.remove(effect);
  }
};

CanvasEffect.prototype.transform = function(imageData) {
  this._appliedEffects.forEach(function(item, index, array) {
    for (var i = 0; i < imageData.data.length; i += 4) {
      rgba = this.effects[item](imageData.data[i], imageData.data[i + 1], imageData.data[i + 2], imageData.data[i + 3], i);
      imageData.data[i] = rgba[0];
      imageData.data[i + 1] = rgba[1];
      imageData.data[i + 2] = rgba[2];
      imageData.data[i + 3] = rgba[3];
    }
  }.bind(this));
  return imageData;
};

CanvasEffect.prototype.effects = {
  standard: function(r, g, b, a, index) {
    return [r, g, b, a];
  },
  bw: function(r, g, b, a, index) {
    var luma = Math.floor(r * 0.3 + g * 0.59 + b * 0.11);
    r = g = b = luma;
    a = 255;
    return [r, g, b, a];
  },
  grey3: function(r, g, b, a, index) {
    var w = 100;
    var bl = 30;
    if (r > w && g > w && b > w) {
      return [200, 200, 200, 255];
    } else if (r <= w && r > bl && g <= w && g > bl && b <= w && b > bl) {
      return [150, 150, 150, 255];
    } else {
      return [100, 100, 100, 255];
    }
  },
  bi: function(r, g, b, a, index) {
    var w = 100;
    if (r > w && g > w && b > w) {
      return [255, 255, 255, 255];
    } else {
      return [255, 0, 0, 255];
    }
  },
  offset: function(r, g, b, a, index) {
    return [b, g, r, a];
  },
  invert: function(r, g, b, a, index) {
    return [255 - r, 255 - g, 255 - b, a];
  }
};