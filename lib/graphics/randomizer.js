'use strict';

/**
 * @module Randomizer
 */

/**
 * Get a random integer between low to high, inclusive.
 * If only one parameter is given, a random integer
 * from (0, low-1) inclusive.
 * @param {number} low - Lower bound on range of random int.
 * @param {number} high - Upper bound on range of random int.
 * @returns {number} Random number between low and high, inclusive.
*/
var nextInt = function(low, high) {
    if(typeof high == 'undefined'){
        high = low - 1;
        low = 0;
    }

    low = Math.floor(low);
    var r = Math.random();
    return low + Math.floor(r * (high - low + 1));
};

/**
 * Get a random float between low to high, inclusive.
 * If only one parameter is given, a random float
 * from (0, low-1) inclusive.
 * @param {number} low - Lower bound on range of random int.
 * @param {number} high - Upper bound on range of random int.
 * @returns {number} Random number between low and high, inclusive.
*/
var nextFloat = function(low, high) {
    if(typeof high == 'undefined'){
        high = low;
        low = 0;
    }
    return low + (high - low) * Math.random();
};

/**
 * Generates a random number in range (0,255) in hexadecimal.
 * @returns {string} Random number in hexadecimal form.
*/
var nextHex = function() {
    var val = nextInt(0, 255);
    if (val < 16) return '0' + val.toString(16);
    return val.toString(16);
};

/**
 * Generate a random hexadecimal color code of the format #RRGGBB.
 * @returns {string} Hexadecimal representation of random color.
*/
var nextColor = function() {
    var r = nextHex();
    var g = nextHex();
    var b = nextHex();
    return "#" + r + g + b;
};

/**
 * Generate a random boolean via fair probability coin toss.
 * If `probabilityTrue` is supplied, the coin toss is skewed by that value.
 * @param {number} probabilityTrue - Skewed probability of true.
 * @returns {boolean} Result of coin flip skewed toward `probabilityTrue`.
*/
var nextBoolean = function(probabilityTrue) {
    if(typeof probabilityTrue == 'undefined'){
        probabilityTrue = 0.5;
    }

    return Math.random() < probabilityTrue;
};

module.exports = {
    nextInt: nextInt,
    nextFloat: nextFloat,
    nextHex: nextHex,
    nextColor: nextColor,
    nextBoolean: nextBoolean,
};
