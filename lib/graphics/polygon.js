'use strict';

var Thing = require('./thing.js');

/**
 * @class Polygon
 * @augments Thing
 * @param {number} width - Desired width of resulting polygon.
 * @param {number} height - Desired height of resulting polygon.
 */
function Polygon(width, height) {
    if (arguments.length !== 2) {
        throw new Error('You should pass exactly 2 arguments to <span ' +
            'class="code">new Polygon(width, height)</span>');
    }
    if (typeof width !== 'number' || !isFinite(width)) {
        throw new TypeError('Invalid value for <span class="code">width' +
            '</span>. Make sure you are passing finite numbers to <span ' +
            'class="code">new Polygon(width, height)</span>. Did you ' +
            'forget the parentheses in <span class="code">getWidth()</span> ' +
            'or <span class="code">getHeight()</span>? Or did you perform a ' +
            'calculation on a variable that is not a number?');
    }
    if (typeof height !== 'number' || !isFinite(height)) {
        throw new TypeError('Invalid value for <span class="code">height' +
            '</span>. Make sure you are passing finite numbers to <span ' +
            'class="code">new Polygon(width, height)</span>. Did you ' +
            'forget the parentheses in <span class="code">getWidth()</span> ' +
            'or <span class="code">getHeight()</span>? Or did you perform a ' +
            'calculation on a variable that is not a number?');
    }

    Thing.call(this);
    this.points = [];
    this.width = Math.max(0, width);
    this.height = Math.max(0, height);
    this.type = 'Polygon';
}

Polygon.prototype = new Thing();
Polygon.prototype.constructor = Polygon;

/**
 * Draws the polygon in the canvas.
 *
 * @param {CodeHSGraphics} __graphics__ - Instance of the __graphics__ module.
 */
Polygon.prototype.draw = function(__graphics__) {
    if (this.points.length === 0) {
        return;
    }

    var context = __graphics__.getContext();
    context.fillStyle = this.color.toString();
    context.beginPath();

    var first = this.points[0];
    context.moveTo(first.x, first.y);
    for (var i = 1; i < this.points.length; i++) {
        var cur = this.points[i];
        context.lineTo(cur.x, cur.y);
    }
    context.closePath();
    context.fill();
};

/**
 * Checks if the passed point is contained in the polygon.
 *
 * @param {number} x - The x coordinate of the point being tested.
 * @param {number} y - The y coordinate of the point being tested.
 * @returns {boolean} Whether the passed point is contained in the polygon.
 */
Polygon.prototype.containsPoint = function(x, y) {
    return x >= this.x && x <= this.x + this.width &&
           y >= this.y && y <= this.y + this.height;
};

/**
 * Gets the width of the rectangle.
 *
 * @returns {number} Width of the rectangle.
 */
Polygon.prototype.getWidth = function() {
    return this.width;
};

/**
 * Gets the height of the rectangle.
 *
 * @returns {number} Height of the rectangle.
 */
Polygon.prototype.getHeight = function() {
    return this.height;
};

/**
 * Adds a vertex to the polygon.
 *
 * @param {number} x - The x coordinate of the desired new vertex.
 * @param {number} y - The y coordinate of the desired new vertex.
 */
Polygon.prototype.addPoint = function(x, y) {
    if (arguments.length !== 2) {
        throw new Error('You should pass exactly 2 arguments to <span ' +
            'class="code">addPoint(x, y)</span>');
    }
    if (typeof x !== 'number' || !isFinite(x)) {
        throw new TypeError('Invalid value for x-coordinate. ' +
            'Make sure you are passing finite numbers to ' +
            '<span class="code">addPoint(x, y)</span>.');
    }
    if (typeof y !== 'number' || !isFinite(y)) {
        throw new TypeError('Invalid value for y-coordinate. ' +
            'Make sure you are passing finite numbers to ' +
            '<span class="code">addPoint(x, y)</span>.');
    }

    this.points.push({x: x, y: y});
};

module.exports = Polygon;
