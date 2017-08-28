'use strict';

var Thing = require('./thing.js');
var Color = require('./color.js');
var graphicsUtils = require('./graphics-utils.js');

/**
 * @class Circle
 * @augments Thing
 * @param {number} radius - Desired radius
 */
function Circle(radius) {
    if (arguments.length !== 1) {
        throw new Error('You should pass exactly 1 argument to <span ' +
            'class="code">new Circle(radius)</span>');
    }
    if (typeof radius !== 'number' || !isFinite(radius)) {
        throw new TypeError('You must pass a finite number to <span class=' +
            '"code">new Circle(radius)</span>. Did you forget the ' +
            'parentheses in <span class="code">getWidth()</span> or <span ' +
            'class="code">getHeight()</span>? Or did you perform a ' +
            'calculation on a variable that is not a number?');
    }

    Thing.call(this);
    this.radius = Math.max(0, radius);
    this.color = Color.black;
    this.lineWidth = 3;
    this.type = 'Circle';
}

Circle.prototype = new Thing();
Circle.prototype.constructor = Circle;

/**
 * Draws the circle in the canvas.
 * @param {CodeHSGraphics} __graphics__ - Instance of the Graphics module.
 */
Circle.prototype.draw = function(__graphics__) {
    var context = __graphics__.getContext();
    context.beginPath();

    if (this.hasBorder) {
        context.strokeStyle = this.stroke.toString();
        context.lineWidth = this.lineWidth;
    }
    context.fillStyle = this.color.toString();
    context.arc(this.x,this.y,this.radius,0,Math.PI * 2,true);
    context.closePath();

    if (this.hasBorder) {
        context.stroke();
    }
    context.fill();
};

/**
 * Gets the radius of the circle
 * @returns {number} Radius of the circle.
 */
Circle.prototype.getRadius = function() {
    return this.radius;
};

/**
 * Gets the height (diamter) of the circle.
 * @returns {number} Height (diameter) of the circle.
 */
Circle.prototype.getHeight = function() {
    return this.radius * 2;
};

/**
 * Gets the width (diamter) of the circle.
 * @returns {number} Width (diameter) of the circle.
 */
Circle.prototype.getWidth = function() {
    return this.radius * 2;
};

/**
 * Sets the radius of the circle.
 * @param {number} radius - Desired resulting radius of the circle.
 */
Circle.prototype.setRadius = function(radius) {
    if (arguments.length !== 1) {
        throw new Error('You should pass exactly 1 argument to <span ' +
            'class="code">setRadius(radius)</span>');
    }
    if (typeof radius !== 'number' || !isFinite(radius)) {
        throw new TypeError('You must pass a finite number to <span class=' +
            '"code">setRadius(radius)</span>. Did you forget the ' +
            'parentheses in <span class="code">getWidth()</span> or <span ' +
            'class="code">getHeight()</span>? Or did you perform a ' +
            'calculation on a variable that is not a number?');
    }

    this.radius = Math.max(0, radius);
};

/**
 * Checks if the passed point is contained in the circle.
 * @param {number} x - The x coordinate of the point being tested.
 * @param {number} y - The y coordinate of the point being tested.
 * @returns {boolean} Whether the passed point is contained in the circle.
 */
Circle.prototype.containsPoint = function(x, y) {
    var circleEdge = this.radius;
    if (this.hasBorder) {
        circleEdge += this.lineWidth;
    }
    var dist = graphicsUtils.getDistance(this.x, this.y, x, y);
    return dist < circleEdge;
};

module.exports = Circle;
