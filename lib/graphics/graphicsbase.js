'use strict';

var Graphics = require('./graphics.js');
var CodeHSGraphics = Graphics.CodeHSGraphics;
var PUBLIC_CONSTRUCTORS = Graphics.PUBLIC_CONSTRUCTORS;
var PUBLIC_METHODS = Graphics.PUBLIC_METHODS;
var WebImage = require('./webimage.js');
var Polygon = require('./polygon.js');
var Color = require('./color.js');
var Randomizer = require('./randomizer.js');
var Text = require('./text.js');
var Grid = require('./grid.js');
var Circle = require('./circle.js');
var Line = require('./line.js');
var Rectangle = require('./rectangle.js');
var ImageLibrary = require('./imagelibrary.js');
// var Sound = require('./sound.js');

module.exports = {
    CodeHSGraphics: CodeHSGraphics,
    PUBLIC_METHODS: PUBLIC_METHODS,
    PUBLIC_CONSTRUCTORS: PUBLIC_CONSTRUCTORS,
    WebImage: WebImage,
    ImageLibrary: ImageLibrary,
    Polygon: Polygon,
    Color: Color,
    Randomizer: Randomizer,
    Text: Text,
    Grid: Grid,
    Circle: Circle,
    Line: Line,
    Rectangle: Rectangle,
    // Sound: Sound,
};
