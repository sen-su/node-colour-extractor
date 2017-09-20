# color-extractor [![build status](https://secure.travis-ci.org/sen-su/node-color-extractor.png)](http://travis-ci.org/sen-su/node-color-extractor)

Extract color palettes from photos using Node.js.

## Installation

Is as simple as with any other Node.js module:

    $ npm install color-extractor

NOTE: `color-extractor` depends on [gm](http://aheckmann.github.com/gm/) module, which in turn depends on [GraphicsMagick](http://www.graphicsmagick.org).

## Sample
![sample](http://i.imgur.com/8aWnu5W.png)

## Usage

`color-extractor` exports two functions:

    ce = require('color-extractor')
    ce.topColors('Photos/Cats/01.jpg', true, function (error, colors) {
      console.log(colors);
    });

`topColors` function takes three arguments:

  * path to your photo,
  * `true` if you'd like the resulting array to be sorted by frequency,
    `false` if you'd like to get colors sorted as they appear in the photo (top-to-bottom),
  * a callback function.

Callback function will be passed an `Array` with RGB triplet of each color and its frequency:

    [
      [1,   [46, 70, 118]],
      [0.3, [0,   0,   2]],
      [0.2, [12,  44,  11]]
    ]

The second function, `colorKey`, returns an array with nine colors, where each one can be mapped to a 3x3 box, ie. super-pixelised representation of the photo.

    ce.colorKey('Photos/Cats/999999.jpg', function (error, colors) {
      database.store('color-keys', photoId, colors);
      res.send(colors);
      // render colors to user while they wait for the photo to load.
      // (or something equally brilliant)
    });


### Utilities

`color-extractor` exports two more utility functions:

    > ce.rgb2hex(100, 10, 12);
    '#640a0c'
    > ce.rgb2hex([44, 44, 44]);
    '#2c2c2c'
    > ce.hex2rgb('#ffffff');
    [255, 255, 255]
    > ce.hex2rgb('45c092')
    [69, 192, 146]

## How does it work?

That's what I'd like to know as well! Anyhow, `color-extractor` parses GraphicMagick's histogram, tries to detect similar colors and remove ones which appear less frequently than others.

If you happen to know an actual algorithm that deals with this sort of stuff, don't hesitate to contact me!

## License

color-extractor is published under MMIT license, please see the LICENSE file for full details.

Photos used in the sample can be downloaded from Flickr:

  * [Title?](http://www.flickr.com/photos/chavals/2941676828)
  * [nel profondo del blu](http://www.flickr.com/photos/shamballah/2038749488)
  * [Reykjavík revisited](http://www.flickr.com/photos/giesenbauer/4951425521)
