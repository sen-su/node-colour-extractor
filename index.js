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
Example line:
  f:  (rrr, ggg, bbb)   #rrggbb\n
  \   \                 \_____________ Hex code / "black" / "white"
   \   \______________________________ RGB triplet
    \_________________________________ Frequency at which color appears
*/

var histogramRE = /\s*(\d+): \(\s*(\d+),\s*(\d+),\s*(\d+)\)/;

function parseHistogramLine (line) {
  var m = histogramRE.exec(line);
  return [ +m[1], [ +m[2], +m[3], +m[4] ] ];
}

exports.topColors = function (sourceFilename, sorted, cb) {
  var img = gm(sourceFilename);

  var tmpFilename = temp.path({
    suffix: '.miff'
  });

  img.size(function (error, size) {
    if (error) {
      return cb(error);
    }

    var ratio = size.width / MAX_W;

    img.scale(Math.ceil(size.height / ratio), MAX_W).colors(8).write('histogram:' + tmpFilename, function (error) {
      if (error) {
        return cb(error);
      }

      var histogram = '';

      var miffRS = fs.createReadStream(tmpFilename, {
        encoding: 'utf8'
      });

      miffRS.addListener('data', function (chunk) {
        var endDelimPos = chunk.indexOf(MIFF_END);

        if (endDelimPos !== -1) {
          histogram += chunk.slice(0, endDelimPos + MIFF_END.length);
          miffRS.destroy();
        } else {
          histogram += chunk;
        }
      });

      miffRS.addListener('close', function () {
        fs.unlink(tmpFilename, function (error) {
          if (error) {
            console.error(error);
          }
        });

        var histogramStart = histogram.indexOf(MIFF_START) + MIFF_START.length;
        var histogramEnd = histogram.indexOf('}', histogramStart);

        var colors = histogram.slice(histogramStart, histogramEnd - 1).split('\n').map(parseHistogramLine);

        if (sorted) {
          colors.sort(sortByFrequency);
        }

        cb(null, colors);
      });
    });
  });
};

exports.colorKey = function (path, cb) {
  exports.topColors(path, false, function (error, xs) {
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
