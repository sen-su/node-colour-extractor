var fs = require('fs');
var gm = require('gm');
var temp = require('temp');

var MAX_W = 256;
var MIFF_START = 'comment={\n';
var MIFF_END = '\x0A}\x0A\x0C\x0A\n';

function sortByFrequency (a, b) {
  return b[0] - a[0];
}

/*
Example lines:
  f:  (rrr, ggg, bbb, aaa)  #rrggbbaa\n
  f:  (rrr, ggg, bbb)   #rrggbb\n
*/

var histogramRE = /\s*(\d+): \(\s*(\d+),\s*(\d+),\s*(\d+)(,\s*\d+)?\)/;

function parseHistogramLine (line) {
  var m = histogramRE.exec(line);
  return m && [ +m[1], [ +m[2], +m[3], +m[4] ] ];
}

function extractColors (filename, cb) {
  var commentBlock = '';

  var miffRS = fs.createReadStream(filename, {
    encoding: 'utf8'
  });

  miffRS.on('data', function (chunk) {
    var endDelimPos = chunk.indexOf(MIFF_END);

    if (endDelimPos !== -1) {
      commentBlock += chunk.slice(0, endDelimPos + MIFF_END.length);
      miffRS.destroy();
    } else {
      commentBlock += chunk;
    }
  });

  miffRS.on('close', function () {
    fs.unlink(filename, function (error) {
      if (error) {
        console.error(error);
      }
    });

    var histogramStart = commentBlock.indexOf(MIFF_START) + MIFF_START.length;
    var histogramEnd = commentBlock.indexOf('}', histogramStart);

    var colors = commentBlock.slice(histogramStart, histogramEnd - 1).split('\n').map(parseHistogramLine).filter(Boolean).sort(sortByFrequency);

    if (!colors.length) {
      return cb(new Error('NoColorsDetected'));
    }

    cb(null, colors);
  });
}

function quantizeImage (img, size, cb) {
  var ratio = size.width / MAX_W;

  var filename = temp.path({
    suffix: '.miff'
  });

  img.scale(Math.ceil(size.height / ratio), MAX_W).colors(8).write('histogram:' + filename, function (error) {
    if (error) {
      return cb(error);
    }

    extractColors(filename, cb);
  });
}

exports.topColors = function (filename, appPath, cb) {
  var img = gm.subClass({
		imageMagick: true,
		appPath: appPath,
	})(filename);

  img.size(function (error, size) {
    if (error) {
      return cb(error);
    }

    return quantizeImage(img, size, cb);
  });
};

exports.colorKey = function (path, cb) {
  exports.topColors(path, function (error, xs) {
    if (error) {
      return cb(error);
    }

    var M = xs.length;
    var m = Math.ceil(M / 2);

    cb(null, [xs[0], xs[1], xs[2], xs[m - 1], xs[m], xs[m + 1], xs[M - 3], xs[M - 2], xs[M - 1]]);
  });
};

exports.rgb2hex = function (r, g, b) {
  var rgb = arguments.length === 1 ? r : [r, g, b];

  return '#' + rgb.map(function (x) {
    return (x < 16 ? '0' : '') + x.toString(16);
  }).join('');
};

exports.hex2rgb = function (xs) {
  if (xs[0] === '#') {
    xs = xs.slice(1);
  }
  return [xs.slice(0, 2), xs.slice(2, -2), xs.slice(-2)].map(function (x) {
    return parseInt(x, 16);
  });
};

module.exports = exports;
