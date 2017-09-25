# CHANGELOG

## v1.1.1 - 2017-09-26
* Add typescript definition for topColors

## v1.1.0 - 2017-09-25
* Remove sorted option, always sort colors
* Add support for images with alpha in the histogram
* Return an error (NoColorsDetected) if we can't find any colors
* Flatten callback pyramid of doom
* Update devDependencies
* Add .npmignore to only distribute important files

## v1.0.1 - 2017-09-22
* Filter comments out that are not histogram entries

## v1.0.0 - 2017-09-21
* Fork from node-colour-extractor
* Convert from coffeescript to javascript
* Use American spelling of color
* Propagate errors through callbacks
* Log errors if unlinking temp files fail
* Rename project to color-extractor
* Update contact & license info
* Update README
* Add tests
* Remove "Magic" color detection algorithm
* Turn histogram parser into regex
* Update Travis CI config
* Use color quantization from GraphicsMagick
* Scale entire image instead of cropping to the center quarter of the iamge
* Scale to 256px to get more accurate representation
* Maximum 8 colors
* Add a CHANGELOG
* Add eslint
* Add .gitignore
* Remove Makefile

## v0.2.1 - 2013-02-12
* Metadata in images will be now stripped and ignored
