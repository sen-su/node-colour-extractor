/* eslint-env node, mocha */

var path = require('path');

var colorExtractor = require('../');

// Test image from here: https://www.instagram.com/p/BZDT9MHnLcN/?taken-by=bj0rnstar

describe('color-extractor', function () {
  it('topColors', function (done) {
    colorExtractor.topColors(path.resolve(path.join('test', 'test001.jpg')), true, function (error, colors) {
      if (error) {
        return done(error);
      }

      colors.should.be.an.Array();
      done();
    });
  });

  it('Works on png', function (done) {
    colorExtractor.topColors(path.resolve(path.join('test', 'test002.png')), true, function (error, colors) {
      if (error) {
        return done(error);
      }

      colors.should.be.an.Array();
      done();
    });
  });

  it('doesn\'t choke on comments', function (done) {
    colorExtractor.topColors(path.resolve(path.join('test', 'test003.jpeg')), true, function (error, colors) {
      if (error) {
        return done(error);
      }

      colors.should.be.an.Array();
      done();
    });
  });
});
