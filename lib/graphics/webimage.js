'use strict';

var Thing = require('./thing.js');

var UNDEFINED = -1;
var NOT_LOADED = 1;
var DONE = 2;

var NUM_CHANNELS = 4;
var RED = 0;
var GREEN = 1;
var BLUE = 2;
var ALPHA = 3;

/**
 * @constructor
 * @augments Thing
 * @param {string} filename - Filepath to the image
 */
function WebImage(filename) {
    if (typeof filename !== 'string') {
        throw new TypeError('You must pass a string to <span class="code">' +
            'new WebImage(filename)</span> that has the image\'s location.');
    }
    Thing.call(this);
    var self = this;

    this.image = new Image();
    this.image.src = filename;
    this.filename = filename;
    this.width = NOT_LOADED;
    this.height = NOT_LOADED;
    this.image.onload = function() {
        self.checkDimensions();
        if (self.loadfn) {
            self.loadfn();
        }

    };
    this.set = 0;
    this.type = 'WebImage';

    this.displayFromData = false;
    this.isCrossOrigin = false;
    this.data = NOT_LOADED;
}

WebImage.prototype = new Thing();
WebImage.prototype.constructor = WebImage;

/**
 * Set a function to be called when the WebImage is loaded.
 *
 * @param {function} callback - A function
 */
WebImage.prototype.loaded = function(callback) {
    this.loadfn = callback;
};

/**
 * Set the image of the WebImage.
 *
 * @param {string} filename - Filepath to the image
 */
WebImage.prototype.setImage = function(filename) {
    var self = this;

    this.image = new Image();
    this.image.src = filename;
    this.filename = filename;
    this.width = NOT_LOADED;
    this.height = NOT_LOADED;
    this.image.onload = function() {
        self.checkDimensions();
        if (self.loadfn) {
            self.loadfn();
        }

    };
    this.set = 0;

    this.displayFromData = false;
    this.isCrossOrigin = false;
    this.data = NOT_LOADED;
};

/**
 * Reinforce the dimensions of the WebImage based on the image it displays.
 */
WebImage.prototype.checkDimensions = function() {
    if (this.width == NOT_LOADED) {
        this.width = this.image.width;
        this.height = this.image.height;
    }
};

/**
 * Draws the WebImage in the canvas.
 *
 * @param {CodeHSGraphics} __graphics__ - Instance of the __graphics__ module.
 */
WebImage.prototype.draw = function(__graphics__) {
    this.checkDimensions();
    var context = __graphics__.getContext('2d');
    // http://stackoverflow.com/questions/17125632/html5-canvas-rotate-object-without-moving-coordinates
    context.save();
    context.beginPath();

    context.translate(this.x + this.width / 2, this.y + this.height / 2);
    context.rotate(this.rotation);

    // If we should be displaying the underlying pixel data, display that
    // Otherwise display the image
    if (this.displayFromData && this.data !== NOT_LOADED) {
        // putImageData does not respect context transformations so use
        // this.x and this.y for the upper left corner
        context.putImageData(this.data, this.x, this.y);
    } else {
        context.drawImage(this.image, -this.width / 2, -this.height / 2,
            this.width, this.height);
    }

    // If we haven't updated the underlying pixel data yet, try to get
    // the pixel data from the canvas context.
    try {
        if (this.data === NOT_LOADED && !this.isCrossOrigin) {
            // get the ImageData for this image
            this.data = context.getImageData(this.x, this.y,
                this.width, this.height);
        }
    } catch (err) {
        // Image was cross origin.
        // Fail silently so we can still display images from cross origin,
        // just not access cross origin image data
        this.data = NOT_LOADED;
        this.isCrossOrigin = true;
    }

    context.closePath();
    context.restore();
};

/**
 * Assign the ImageData of the canvas at the position of the image,
 * essentially assigning the ImageData.
 * Read more at https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getImageData
 */
WebImage.prototype.getData = function(__graphics__) {
    var context = __graphics__.getContext();
    //context.drawImage(this.image, this.x, this.y, this.width, this.height);
    this.data = context.getImageData(this.x, this.y, this.width, this.height);
};

/**
 * Checks if the passed point is contained in the WebImage.
 *
 * @param {number} x - The x coordinate of the point being tested.
 * @param {number} y - The y coordinate of the point being tested.
 * @returns {boolean} Whether the passed point is contained in the WebImage.
 */
WebImage.prototype.containsPoint = function(x, y) {
    return x >= this.x && x <= this.x + this.width &&
           y >= this.y && y <= this.y + this.height;
};

/**
 * Gets the width of the WebImage.
 *
 * @returns {number} Width of the WebImage.
 */
WebImage.prototype.getWidth = function() {
    return this.width;
};

/**
 * Gets the height of the WebImage.
 *
 * @returns {number} Height of the WebImage.
 */
WebImage.prototype.getHeight = function() {
    return this.height;
};

/**
 * Sets the size of the WebImage.
 *
 * @param {number} width - The desired width of the resulting WebImage.
 * @param {number} height - The desired height of the resulting WebImage.
 */
WebImage.prototype.setSize = function(width, height) {
    this.width = width;
    this.height = height;
};

/* Get and set pixel functions */

/**
 * Gets a pixel at the given x and y coordinates.
 * Read more here:
 * https://developer.mozilla.org/en-US/docs/Web/API/ImageData/data
 *
 * @param {number} x - The x coordinate of the point being tested.
 * @param {number} y - The y coordinate of the point being tested.
 * @returns {array} An array of 4 numbers representing the (r,g,b,a) values
 *                     of the pixel at that coordinate.
 */
WebImage.prototype.getPixel = function(x, y) {
    if (this.data === NOT_LOADED ||
        x > this.width ||
        x < 0 ||
        y > this.height ||
        y < 0
    ) {
        var noPixel = [UNDEFINED, UNDEFINED, UNDEFINED, UNDEFINED];
        return noPixel;
    } else {
        var index = NUM_CHANNELS * (y * this.width + x);
        var pixel = [
                this.data.data[index + RED],
                this.data.data[index + GREEN],
                this.data.data[index + BLUE],
                this.data.data[index + ALPHA]
                    ];
        return pixel;
    }
};

/**
 * Get the red value at a given location in the image.
 *
 * @param {number} x - The x coordinate of the point being tested.
 * @param {number} y - The y coordinate of the point being tested.
 * @returns {integer} An integer between 0 and 255.
 */
WebImage.prototype.getRed = function(x, y) {
    return this.getPixel(x, y)[RED];
};

/**
 * Get the green value at a given location in the image.
 *
 * @param {number} x - The x coordinate of the point being tested.
 * @param {number} y - The y coordinate of the point being tested.
 * @returns {integer} An integer between 0 and 255.
 */
WebImage.prototype.getGreen = function(x, y) {
    return this.getPixel(x, y)[GREEN];
};

/**
 * Get the blue value at a given location in the image.
 *
 * @param {number} x - The x coordinate of the point being tested.
 * @param {number} y - The y coordinate of the point being tested.
 * @returns {integer} An integer between 0 and 255.
 */
WebImage.prototype.getBlue = function(x, y) {
    return this.getPixel(x, y)[BLUE];
};

/**
 * Get the alpha value at a given location in the image.
 *
 * @param {number} x - The x coordinate of the point being tested.
 * @param {number} y - The y coordinate of the point being tested.
 * @returns {integer} An integer between 0 and 255.
 */
WebImage.prototype.getAlpha = function(x, y) {
    return this.getPixel(x, y)[ALPHA];
};

/**
 * Set the `component` value at a given location in the image to `val`.
 *
 * @param {number} x - The x coordinate of the point being tested.
 * @param {number} y - The y coordinate of the point being tested.
 * @param {integer} component - Integer representing the color value to
 * be set. R, G, B = 0, 1, 2, respectively.
 * @param {integer} val - The desired value of the `component` at the pixel.
 * Must be between 0 and 255.
 */
WebImage.prototype.setPixel = function(x, y, component, val) {
    if (this.data !== NOT_LOADED &&
        !(x < 0 || y < 0 || x > this.width || y > this.height)) {

        // Update the pixel value
        var index = NUM_CHANNELS * (y * this.width + x);
        this.data.data[index + component] = val;

        // Now that we have modified the image data, we need to display
        // the image based on the underlying image data rather than the
        // image url
        this.displayFromData = true;
    }
};

/**
 * Set the red value at a given location in the image to `val`.
 *
 * @param {number} x - The x coordinate of the point being tested.
 * @param {number} y - The y coordinate of the point being tested.
 * @param {integer} val - The desired value of the red component at the pixel.
 * Must be between 0 and 255.
 */
WebImage.prototype.setRed = function(x, y, val) {
    this.setPixel(x, y, RED, val);
};

/**
 * Set the green value at a given location in the image to `val`.
 *
 * @param {number} x - The x coordinate of the point being tested.
 * @param {number} y - The y coordinate of the point being tested.
 * @param {integer} val - The desired value of the green component at the pixel.
 * Must be between 0 and 255.
 */
WebImage.prototype.setGreen = function(x, y, val) {
    this.setPixel(x, y, GREEN, val);
};

/**
 * Set the blue value at a given location in the image to `val`.
 *
 * @param {number} x - The x coordinate of the point being tested.
 * @param {number} y - The y coordinate of the point being tested.
 * @param {integer} val - The desired value of the blue component at the pixel.
 * Must be between 0 and 255.
 */
WebImage.prototype.setBlue = function(x, y, val) {
    this.setPixel(x, y, BLUE, val);
};

/**
 * Set the alpha value at a given location in the image to `val`.
 *
 * @param {number} x - The x coordinate of the point being tested.
 * @param {number} y - The y coordinate of the point being tested.
 * @param {integer} val - The desired value of the alpha component at the
 * pixel.
 * Must be between 0 and 255.
 */
WebImage.prototype.setAlpha = function(x, y, val) {
    this.setPixel(x, y, ALPHA, val);
};

module.exports = WebImage;
