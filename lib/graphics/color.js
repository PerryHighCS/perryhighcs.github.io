'use strict';

/**
 * @namespace Color
 */

var Randomizer = require('./randomizer.js');

/**
 * @class Color
 * @param {number} r - Red value.
 * @param {number} g - Green value.
 * @param {number} b - Blue value.
 */
function Color(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
}

/**
 * Generate a hex representation of the color.
 * @returns {string}
 */
Color.prototype.toString = function() {
    return Color.createFromRGB(this.r, this.g, this.b);
};

Color.random = Randomizer.nextColor;

Color.constants = {
    red: '#FF0000',
    RED: '#FF0000',
    green: '#00FF00',
    GREEN: '#00FF00',
    blue: '#0000FF',
    BLUE: '#0000FF',
    yellow: '#FFFF00',
    YELLOW: '#FFFF00',
    cyan: '#00FFFF',
    CYAN: '#00FFFF',
    orange: '#FFA500',
    ORANGE: '#FFA500',
    white: '#FFFFFF',
    WHITE: '#FFFFFF',
    black: '#000000',
    BLACK: '#000000',
    gray: '#cccccc',
    GRAY: '#CCCCCC',
    grey: '#cccccc',
    GREY: '#CCCCCC',
    purple: '#9B30FF',
    PURPLE: '#9B30FF'
};

var name;
for (name in Color.constants) {
    Color[name] = Color.constants[name];
}

/**
 * Helpers for createFromRGB
 */

/**
 * Convert RGB to a hex string.
 *
 * @memberof Color
 * @param {number} r - Red component.
 * @param {number} g - Green component.
 * @param {number} b - Blue component.
 * @returns {string} Hex representation.
 */
function rgbToHex(r, g, b) {
    r = Math.floor(r);
    g = Math.floor(g);
    b = Math.floor(b);
    if (r > 255 || g > 255 || b > 255) {
        throw 'Invalid color component';
    }
    return ((r << 16) | (g << 8) | b).toString(16);
}

function getColor(r, g, b) {
    return '#' + ('000000' + rgbToHex(r, g, b)).slice(-6);
}

/**
 * Create a hex color from RGB values.
 *
 * @param {number} r - Red value.
 * @param {number} g - Green value.
 * @param {number} b - Blue value .
 * @returns {string}
 */
Color.createFromRGB = function(r, g, b) {
    return getColor(r, g, b);
};

/**
 * Generate a random red value.
 *
 * @returns {string} Hex representation of random red color.
 */
Color.randomRed = function() {
    var r = Randomizer.nextInt(50, 255);
    return Color.createFromRGB(r, 0, 0);
};

/**
 * Generate a random green value.
 *
 * @returns {string} Hex representation of random green color.
 */
Color.randomGreen = function() {
    var g = Randomizer.nextInt(50, 255);
    return Color.createFromRGB(0, g, 0);
};

/**
 * Generate a random blue value.
 *
 * @returns {string} Hex representation of random blue color.
 */
Color.randomBlue = function() {
    var b = Randomizer.nextInt(50, 255);
    return Color.createFromRGB(0, 0, b);
};


/**
 * Creates a hex color string from a (r,g,b) value as well
 * as a lightness value l from [0, 1]. To do this we convert
 * the rgb color to hsl. Then we modify the l, take it back to
 * rgb, and then convert to a color string.
 *
 * @param {number} r - The red color value.
 * @param {number} g - The green color value.
 * @param {number} b - The blue color value.
 * @param {number} l - The lightness value [0,1].
 * @returns {string} The hex color string.
 */
Color.createFromRGBL = function(r, g, b, l) {
    var hsl = Color.rgbToHsl(r, g, b);

    if (l < 0) {
        l = 0;
    }
    if (l > 1) {
        l = 1;
    }

    var rgb = Color.hslToRgb(hsl[0], hsl[1], l);
    return Color.createFromRGB(rgb[0], rgb[1], rgb[2]);
};


/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param {number} r - The red color value.
 * @param {number} g - The green color value.
 * @param {number} b - The blue color value.
 * @returns {array} The HSL representation.
 */
Color.rgbToHsl = function(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    }else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
};

/**
 * Helpers for hslToRgb
 */

/**
 * Converts an HSL representation to RGB.
 *
 * @memberof Color
 * @param {number} p
 * @param {number} q
 * @param {number} t
 * @returns {number} RGB representation of component.
 */
function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param {number} h - The hue.
 * @param {number} s - The saturation.
 * @param {number} l - The lightness.
 * @returns {object} The RGB representation.
 */
Color.hslToRgb = function(h, s, l) {
    var r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [r * 255, g * 255, b * 255];
};

/**
 * Generate the average of two hex colors.
 *
 * @param {string} colorOne - First hex color.
 * @param {string} colorTwo - Second hex color.
 * @returns {string} Averaged hex color.
 */
Color.average = function(colorOne, colorTwo) {
    // functions for converting to/from hex/dec
    function getHex(num) { return num.toString(16); }
    function getDec(hex) { return parseInt(hex, 16); }

    var componentRegEx = /[\da-z]{2}/gi;

    var componentsOne = colorOne.match(componentRegEx);
    var componentsTwo = colorTwo.match(componentRegEx);

    var averageHex = '#';
    var colorOneComponent;
    var colorTwoComponent;
    var averageDec;
    var h;
    for (var i = 0; i < componentsOne.length; i++) {
        colorOneComponent = getDec(componentsOne[i]);
        colorTwoComponent = getDec(componentsTwo[i]);
        averageDec = Math.floor((colorOneComponent + colorTwoComponent) >> 1);
        h = getHex(averageDec);
        if (h.length == 1) h = '0' + h;
        averageHex += h;
    }

    return averageHex;
};

Color.getColor = function(colorString) {
    return Color.constants[colorString];
};

Color.getHexColor = function(hexString) {
    return hexString;
};

module.exports = Color;
