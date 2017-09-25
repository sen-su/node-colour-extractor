/* eslint-env node, mocha */

var path = require('path');

var colorExtractor = require('../');

// Test image from here: https://www.instagram.com/p/BZDT9MHnLcN/?taken-by=bj0rnstar

describe('color-extractor', function () {
  it('topColors', function (done) {
    colorExtractor.topColors(path.resolve(path.join('test', 'test001.jpg')), function (error, colors) {
      if (error) {
        return done(error);
      }

      colors.should.be.an.Array();
      colors.length.should.be.greaterThan(0);
      done();
    });
  });

  it('Works on png', function (done) {
    colorExtractor.topColors(path.resolve(path.join('test', 'test002.png')), function (error, colors) {
      if (error) {
        return done(error);
      }

      colors.should.be.an.Array();
      colors.length.should.be.greaterThan(0);
      done();
    });
  });

  it('Doesn\'t choke on comments', function (done) {
    colorExtractor.topColors(path.resolve(path.join('test', 'test003.jpeg')), function (error, colors) {
      if (error) {
        return done(error);
      }

      colors.should.be.an.Array();
      colors.length.should.be.greaterThan(0);
      done();
    });
  });

  it('Suppports transparent images', function (done) {
    colorExtractor.topColors(path.resolve(path.join('test', 'test004.png')), function (error, colors) {
      if (error) {
        return done(error);
      }

      colors.should.be.an.Array();
      colors.length.should.be.greaterThan(0);
      done();
    });
  });
});
