'use strict';

/**
 * @constructor
 */
function Thing() {
    this.x = 0;
    this.y = 0;
    this.color = '#000000';
    this.stroke = '#000000';
    this.type = 'Thing';
    this.lineWidth = 1;
    this.filled = true;
    this.hasBorder = false;
    this.rotation = 0;
}

Thing.DEGREES = 0;
Thing.RADIANS = 1;

/**
 * Sets a Thing object to filled.
 * Throws an error if an argument is not passed.
 *
 * @param {bool} filled - A boolean of whether or not Thing is filled.
 */
Thing.prototype.setFilled = function(filled) {
    if (arguments.length !== 1) {
        throw new Error('You should pass exactly 1 argument to ' +
            '<span class="code">setFilled</span>');
    }
    if (typeof filled !== 'boolean') {
        throw new Error('Invalid value passed to <span class="code">' +
            'setFilled</span>. Make sure you are passing a ' +
            'boolean value.');
    }
    this.filled = filled;
};

/**
 * Returns if a Thing is filled.
 *
 * @returns {boolean} True if the Thing is filled.
 */
Thing.prototype.isFilled = function() {
    return this.filled;
};

/**
 * Sets a Thing object to filled.
 * Throws an error if an argument is not passed.
 *
 * @param {bool} hasBorder - A boolean of whether or not Thing has a border.
 */
Thing.prototype.setBorder = function(hasBorder) {
    if (arguments.length !== 1) {
        throw new Error('You should pass exactly 1 argument to <span class=' +
            '"code">setBorder</span>');
    }
    if (typeof hasBorder !== 'boolean') {
        throw new Error('Invalid value passed to <span class="code">' +
            'setBorder</span>. Make sure you are passing a ' +
            'boolean value.');
    }
    this.hasBorder = hasBorder;
};

/**
 * Returns if a Thing has a border.
 *
 * @returns {boolean} True if the Thing has a border.
 */
Thing.prototype.hasBorder = function() {
    return this.hasBorder;
};

/**
 * Sets a Thing object's type.
 * Questionable of whether or not this method is used.
 *
 * @param {type} type - A type to set the Thing to.
 */
Thing.prototype.setType = function(type) {
    if (arguments.length !== 1) {
        throw new Error('You should pass exactly 1 argument to <span ' +
            'class="code">setType</span>');
    }
    this.type = type;
};

/**
 * Returns the type of a Thing.
 *
 * @returns {type} The type of the Thing.
 */
Thing.prototype.getType = function() {
    return this.type;
};

/**
 * Sets the position of a Thing.
 * Throws an error if there are fewer than 2 params or if
 * they are not numbers.
 *
 * @param {number} x - The destination x coordinate of this Thing.
 * @param {number} y - The destination y coordinate of this Thing.
 */
Thing.prototype.setPosition = function(x, y) {
    if (arguments.length !== 2) {
        throw new Error('You should pass exactly 2 arguments to <span ' +
            'class="code">setPosition(x, y)</span>');
    }
    if (typeof x !== 'number' || !isFinite(x)) {
        throw new TypeError('Invalid value for x-coordinate. ' +
            'Make sure you are passing finite numbers to <span ' +
            'class="code">setPosition(x, y)</span>. Did you ' +
            'forget the parentheses in <span class="code">getWidth()</span> ' +
            'or <span class="code">getHeight()</span>? Or did you perform a ' +
            'calculation on a variable that is not a number?');
    }
    if (typeof y !== 'number' || !isFinite(y)) {
        throw new TypeError('Invalid value for y-coordinate. ' +
            'Make sure you are passing finite numbers to <span ' +
            'class="code">setPosition(x, y)</span>. Did you ' +
            'forget the parentheses in <span class="code">getWidth()</span> ' +
            'or <span class="code">getHeight()</span>? Or did you perform a ' +
            'calculation on a variable that is not a number?');
    }
    this.x = x;
    this.y = y;
};

/**
 * Sets the rotation of a Thing in degrees.
 * Throws an error if there are fewer than 1 params or if they
 * are not numbers.
 *
 * @param {number} degrees - The degrees to rotate degrees.
 * @param {number} angleUnit - Whether it is degrees or radians. Defaults to
 *                             degrees.
 */
Thing.prototype.setRotation = function(degrees, angleUnit) {
    if (arguments.length < 1 || arguments.length > 2) {
        throw new Error('You should pass 1 or 2 arguments to <span ' +
            'class="code">setRotation(degrees, angleUnit)</span>');
    }
    if (typeof degrees !== 'number' || !isFinite(degrees)) {
        throw new TypeError('Invalid value for degrees. ' +
            'Make sure you are passing finite numbers to <span ' +
            'class="code">setRotation(degrees, angleUnit)</span>. Did you ' +
            'perform a calculation on a variable that is not a number?');
    }
    if (!angleUnit) {
        angleUnit = Thing.DEGREES;
    }
    if (typeof angleUnit !== 'number' || !isFinite(angleUnit)) {
        throw new TypeError('Invalid value for <span class="code">angleUnit' +
            '</span>. Make sure you are passing finite numbers to <span ' +
            'class="code">setRotation(degrees, angleUnit)</span>');
    }
    if (angleUnit == Thing.DEGREES) {
        this.rotation = degrees * Math.PI / 180;
    } else {
        this.rotation = degrees;
    }
};

/**
 * Rotates a Thing an additional amount of degrees.
 *
 * @param {number} degrees - The degrees to rotate degrees.
 * @param {number} angleUnit - Whether it is degrees or radians. Defaults to
 *                             degrees.
 */
Thing.prototype.rotate = function(degrees, angleUnit) {
    if (arguments.length < 1 || arguments.length > 2) {
        throw new Error('You should pass exactly 1 argument to <span ' +
            'class="code">rotate(degrees, angleUnit)</span>');
    }
    if (typeof degrees !== 'number' || !isFinite(degrees)) {
        throw new TypeError('Invalid value for degrees. ' +
            'Make sure you are passing finite numbers to <span ' +
            'class="code">rotate(degrees, angleUnit)</span>. Did you perform ' +
            'a calculation on a variable that is not a number?');
    }
    if (!angleUnit) {
        angleUnit = Thing.DEGREES;
    }
    if (typeof angleUnit !== 'number' || !isFinite(angleUnit)) {
        throw new TypeError('Invalid value for <span class="code">angleUnit' +
            '</span>. Make sure you are passing finite numbers to <span ' +
            'class="code">rotate(degrees, angleUnit)</span>');
    }
    if (angleUnit == Thing.DEGREES) {
        this.rotation += degrees * Math.PI / 180;
    } else {
        this.rotation += degrees;
    }
};

/**
 * Sets the color of a Thing.
 * Throws an error if there are fewer than 1 params or if
 * the param is undefined.
 *
 * @param {Color} color - The resulting color of Thing.
 */
Thing.prototype.setColor = function(color) {
    if (arguments.length !== 1) {
        throw new Error('You should pass exactly 1 argument to <span ' +
            'class="code">setColor</span>');
    }
    if (color === undefined) {
        throw new TypeError('Invalid color');
    }
    this.color = color;
};

/**
 * Gets the color of a Thing.
 *
 * @returns {Color} The destination y coordinate of this Thing.
 */
Thing.prototype.getColor = function() {
    return this.color;
};

/**
 * Sets the border color of a Thing.
 * Throws an error if there are fewer than 1 params or if
 * the param is undefined.
 *
 * @param {Color} color - The resulting color of the Thing's border.
 */
Thing.prototype.setBorderColor = function(color) {
    if (arguments.length !== 1) {
        throw new Error('You should pass exactly 1 argument to <span ' +
            'class="code">setBorderColor</span>');
    }
    if (color === undefined) {
        throw new TypeError('Invalid color.');
    }
    this.stroke = color;
    this.hasBorder = true;
};


/**
 * Gets the border color of a Thing.
 *
 * @returns {Color} The color of the Thing's border.
 */
Thing.prototype.getBorderColor = function() {
    return this.stroke;
};

/**
 * Sets the width of a Thing's border.
 * Throws an error if there is not 1 argument.
 *
 * @param {number} width - The resulting width of the Thing's border.
 */
Thing.prototype.setBorderWidth = function(width) {
    if (arguments.length !== 1) {
        throw new Error('You should pass exactly 1 argument to <span ' +
            'class="code">setBorderWidth</span>');
    }
    if (typeof width !== 'number' || !isFinite(width)) {
        throw new Error('Invalid value for border width. Make sure you are ' +
            'passing a finite number to <span class="code">' +
            'setBorderWidth</span>');
    }
    this.lineWidth = width;
    this.hasBorder = true;
};

/**
 * Gets the width of the Thing's border.
 *
 * @returns {number} The width of the Thing's border.
 */
Thing.prototype.getBorderWidth = function() {
    return this.lineWidth;
};

/**
 * Changes the possition of a thing by a specified x and y amount.
 *
 * @param {number} dx - The resulting change in the Thing's x position.
 * @param {number} dy - The resulting change in the Thing's y position.
 */
Thing.prototype.move = function(dx, dy) {
    if (arguments.length !== 2) {
        throw new Error('You should pass exactly 2 arguments to <span ' +
            'class="code">move</span>');
    }
    if (typeof dx !== 'number' || !isFinite(dx)) {
        throw new TypeError('Invalid number passed for <span class="code">' +
            'dx</span>. Make sure you are passing finite numbers to <span ' +
            'class="code">move(dx, dy)</span>');
    }
    if (typeof dy !== 'number' || !isFinite(dy)) {
        throw new TypeError('Invalid number passed for <span class="code">' +
            'dy</span>. Make sure you are passing finite numbers to <span ' +
            'class="code">move(dx, dy)</span>');
    }
    this.x += dx;
    this.y += dy;
};

/**
 * Gets the x position of the Thing.
 *
 * @returns {number} The x position of the Thing.
 */
Thing.prototype.getX = function() {
    return this.x;
};

/**
 * Gets the y position of the Thing.
 *
 * @returns {number} The y position of the Thing.
 */
Thing.prototype.getY = function() {
    return this.y;
};

/**
 * This function is overridden in subclasses of Thing.
 */
Thing.prototype.draw = function() {

};

/**
 * Check if a given point is within the Thing.
 * This function only works in subclasses of Thing.
 *
 * @param {number} x - The x coordinate of the point being checked.
 * @param {number} y - The y coordinate of the point being checked.
 * @returns {boolean} Whether the point x, y is within the Thing.
 */
Thing.prototype.containsPoint = function(x, y) {
    return false;
};

module.exports = Thing;
