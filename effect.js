// Thanks to http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript

function rgbToHsv(r, g, b) {
  r = r / 255, g = g / 255, b = b / 255;
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h, s, v = max;

  var d = max - min;
  s = max == 0 ? 0 : d / max;

  if (max == min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h, s, v];
}

function hsvToRgb(h, s, v) {
  var r, g, b;

  var i = Math.floor(h * 6);
  var f = h * 6 - i;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      r = v, g = t, b = p;
      break;
    case 1:
      r = q, g = v, b = p;
      break;
    case 2:
      r = p, g = v, b = t;
      break;
    case 3:
      r = p, g = q, b = v;
      break;
    case 4:
      r = t, g = p, b = v;
      break;
    case 5:
      r = v, g = p, b = q;
      break;
  }

  return [r * 255, g * 255, b * 255];
}


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
  saturate: function(r, g, b, a, index) {
    var hsv = rgbToHsv(r, g, b);
    var rgb = hsvToRgb(hsv[0], hsv[1] * 2, hsv[2]);
    return [rgb[0], rgb[1], rgb[2], 255];
  },
  lines: function(r, g, b, a, index) {
    if (index % 40 === 0 || index % 20 === 0 || index % 90 === 0) {
      return [r, g, b, 20];
    } else {
      return [r, g, b, a];
    }
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
  invert: function(r, g, b, a, index) {
    return [b, g, r, a];
  }
};