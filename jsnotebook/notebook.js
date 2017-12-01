/* global _testResponses */

'use strict';

// Display text in a textArea console
function print(text) {
  // Get a reference to the console
  var con = document.getElementById('Console');

  // Get the current console text
  var conTxt = con.textContent;

  // Append the new text
  conTxt += text;

  // Set the console text
  con.textContent = conTxt;

  // Make sure the console is visible
  con.style.display = "block";
}

// Display text in a textArea console, followed by a newline
function println(text) {
  print(text + '\n');
}

// Display javascript errors in a slightly more friendly manner
function jserror(messageOrEvent, source, lineno, colno, error) {
    // If there is no source, create one with the given line number
    if (source === '') {
        source = ' at line ' + lineno;
    }
    // If the source shows up as notebook.js, hide that fact (this code is perfect! /s)
    else if (source.includes('notebook.js')) {
        source = '';
    }
    // Otherwise use the source file and line number
    else {
        source = ' in ' + source + ' at line ' + lineno;
    }
    
    // Print out the error message
    if (typeof error === 'string') {
        console.error(error + source);
    }
    else {
        console.error(error.message + source);
    }
}

// Redirect javascript console error, log, and warning messages to println
if (!("_notebooklog" in console)) {
    console._notebooklog = console.log;
    console._notebookerror = console.error;
    console._notebookwarn = console.warn;
    console._notebookinfo = console.info;
    
    console.log = function(x) {println(x); console._notebooklog(x);};
    console.error =  function(x) {println('\u26D4 ' + x); console._notebookerror(x);};
    console.warn =  function(x) {println('\u26A0 ' + x); console._notebookwarn(x);};
    console.info =  function(x) {println('\u2139 ' + x); console._notebookinfo(x);};
    
    window.onerror = jserror;
}

function ask(promptText) {
    // If there are no test responses defined
    if (typeof _testResponses === 'undefined' || _testResponses === null) {
        // Popup a prompt window
        return prompt(promptText);
    }
    else {
        if(typeof(_testResponses) === 'string') {
            // IF there are, check if there are multiple lines of responses
            let end = _testResponses.indexOf('\n');
            let resp;

            // If there are multiple lines
            if (end >= 0) {
                // the current response goes up to the next newline
                resp = _testResponses.substring(0, end);

                // remove it from the future responses
                _testResponses = _testResponses.substring(end+1);
            }
            else {
                // get the (last) response
                resp = _testResponses;

                // and clear out the responses
                _testResponses = 0;
            }

            // Return the response
            return resp;
        }
        else {
            throw "Reading input when none available";
        }
    }
}

// Read a line of user input
function readLine(promptTxt) {
  // Prompt the user for input
  let rval = ask(promptTxt);

  // If the user clicks Cancel, throw an exception
  if (rval === null) {
    throw 'Exception: User Cancelled Input';
  }

  // Otherwise, return the input
  return rval;
}

// Ask the user for a number
function readInt(promptTxt) {
  // Store the user prompt
  var text = promptTxt;

  // Loop until we get our input
  while (true) {
    // Ask the user for the number
    var rval = ask(text);

    // If the user clicks cancel, throw an exception
    if (rval === null) {
      throw 'Exception: User Cancelled Input';
    }

    // Parse out the number the user entered
    rval = parseInt(rval);

    // If the user didn't enter a number, ask again
    if (isNaN(rval)) {
      text = promptTxt + "\nPlease enter an integer.";
    } else {
      // If they did enter a number, return it
      return rval;
    }
  }
}

// Ask the user for a number
function readFloat(promptTxt) {
  // Store the user prompt
  var text = promptTxt;

  // Loop until we get our input
  while (true) {
    // Ask the user for the number
    var rval = ask(text);

    // If the user clicks cancel, throw an exception
    if (rval === null) {
      throw 'Exception: User Cancelled Input';
    }

    // Parse out the number the user entered
    rval = parseFloat(rval);

    // If the user didn't enter a number, ask again
    if (isNaN(rval)) {
      text = promptTxt + "\nPlease enter a number.";
    } else {
      // If they did enter a number, return it
      return rval;
    }
  }
}

// Ask the user for a boolean
function readBoolean(promptTxt) {
  // Store the user prompt
  var text = promptTxt;

  // Loop until we get our input
  while (true) {
    // Ask the user for the boolean
    var rval = ask(text).toLowerCase();

    // If the user clicks cancel, throw an exception
    if (rval === null) {
      throw 'Exception: User Cancelled Input';
    } else if (rval === 'true' || rval === 'yes') {
      return true;
    } else if (rval === 'false' || rval === 'no') {
      return false;
    } else {
      // If they did not enter a boolean, loop
      text = promptTxt + "\nPlease enter true or false.";
    }
  }
}

// Create a canvas singleton to control drawing
var canvas = new class {
    constructor () {
        this._setup = false;
                       
        this._shapes = [];
        this._background = "#fff";
    }
    
    /**
     * Set the background color for the canvas
     * 
     * @param {String} color HTML color
     */
    setBackground(color) { this._background = color; }
    
    /**
     * Add a shape to the canvas
     * 
     * @param {Shape} shape
     */
    add(shape) {         
        this.remove(shape); // If the shape is already on the canvas, remove it
        this._shapes.push(shape); // Add the shape to the list of shapes
        this._canvas.style.display = 'block'; // Display the canvas if it isn't
    }
    
    /**
     * Remove a shape from the canvas
     * 
     * @param {Shape} shape
     */
    remove(shape) { this._shapes = this._shapes.filter(s => s !== shape); }
    
    /**
     * Draw all shapes on the canvas
     */
    draw() {     
        // Make sure the canvas has been prepared
        if (!this._setup) {
            this.prepare();
        }
        
        // Get the drawing context
        let ctx = this._canvas.getContext("2d");
        
        // Clear the canvas by displaying only the background color
        ctx.fillStyle = this._background;
        ctx.fillRect(0, 0, this._width, this._height);
        
        // Loop through all of the shapes, asking them to draw theirselves
        // on the drawing context
        this._shapes.forEach(s => s.draw(ctx));
    }
    
    /**
     * Prepare the canvas for drawing
     * 
     * @param {Number} width the width to make the canvas (optional)
     * @param {Number} height the height to make the canvas (optional)
     */
    prepare(width, height) {   
        // Clear out the shapes list
        this._shapes = [];
        this._setup = true;
        
        // Select the drawing canvas
        let canvas = document.getElementById("Drawing");
        this._canvas = canvas;
        
        // Calculate the size of the canvas
        this._width = width || window.innerWidth ||
                      document.documentElement.clientWidth ||
                      document.body.clientWidth ||
                      document.body.offsetWidth;
        this._height = height || this._width / 2;
        
        // Make the canvas the proper height
        canvas.setAttribute('width', this._width);
        canvas.setAttribute('height', this._height);
        canvas.addEventListener('mousemove', function(evt){mouseInfo._mouseEvent(evt, this);});
        canvas.addEventListener('mouseup', function(evt){mouseInfo._mouseEvent(evt, this);});
        canvas.addEventListener('mousedown', function(evt){mouseInfo._mouseEvent(evt, this);});
        canvas.addEventListener('mouseout', function(evt){mouseInfo._mouseEvent(null, this);});
        canvas.addEventListener('contextmenu', (evt) => evt.preventDefault());
    }
    
    /**
     * Determine the width of the canvas
     * 
     * @returns {Number} the width of the canvas
     */
    getWidth() { return this._width; }
    
    /**
     * Determeine the height of the canvas
     * 
     * @returns {Number} the height of the canvas
     */
    getHeight() { return this._height; }
    
    /**
     * Get the list of shapes drawn on the canvas
     * 
     * @returns {Shape[]} the array of shape objects
     */
    getShapes() { return this._shapes; }
    
    /**
     * Get the topmost shape at a given location on the canvas
     * 
     * @param {Number} x
     * @param {Number} y
     * @returns {Shape|undefined} the shape at the location or undefined if none
     */
    getObjectAt(x, y) {
        let shapes = getObjectsAt(x, y);    
        return shapes[shapes.length - 1];
    }
    
    /**
     * Get all shapes at a given location on the canvas
     * 
     * @param {Number} x
     * @param {Number} y
     * @returns {Shape[]} the shapes at the location
     */
    getObjectsAt(x, y) {
        let shapes = [];
        
        this._shapes.forEach(function(shape){ 
            if (shape.contains(x, y)) {
                shapes.push(shape);
            }
        });
        
        return shapes;
    }
    
};

/**
 * A generic shape that can be drawn on a canvas, with optional text label
 * @type Shape
 */
class Shape {
    /**
     * Create a shape centered on a point on the canvas
     * 
     * @param {Number} centerX
     * @param {Number} centerY
     * @returns {Shape}
     */
    constructor (centerX, centerY) {
        this._centerX = centerX;
        this._centerY = centerY;
        this._x = centerX;
        this._y = centerY;
        this._labelColor  = "white";
        this._labelFont = "sans-serif";
        this._fontHeight = 20;
        this._fillColor = "#000";
        this._text = "";
        this._measureLabel();
    }
    
    /**
     * Set the x coordinate for the center of the shape
     * @param {Number} x
     */
    setX(x) {
        this._x = x;
        this._centerX = x;
    }
    
    /**
     * Determine the x coordinate for the center of the shape
     * @returns {Number}
     */
    getX() { return this._x; }
    
    /**
     * Set the y coordinate for the center of the shape
     * @param {Number} y
     */
    setY(y) {
        this._y = y;
        this._centerY = y;
    }
    
    /**
     * Determine the y coordinate for the center of the shape
     * @returns {Number}
     */
    getY() { return this._y; }
    
    /**
     * Set the text to label this shape with
     * 
     * @param {String} text the new text to display on the shape
     */
    setLabel (text) {
        this._text = "" +  text;
        this._measureLabel();
    }
    
    setLabelColor (color) { this._labelColor = color; }
    
    setLabelOutline (color) { this._labelOutline = color; }
    
    setLabelFont (font) { this._labelFont = font; }
    
    setLabelFontSize (pixels) {this._fontHeight = pixels; }
    
    setColor (color) { this._fillColor = color; }
    
    setOutline (color) { this._outlineColor = color; }
    
    /**
     * Draw this shape on a drawing context
     * @param {Context2D} drawContext the canvas drawing context to draw on
     */
    draw (drawContext) {
        drawContext.save();
        
        if (this.text !== "") {
            this._setupText(drawContext);

            drawContext.fillText(this._text, this._centerX, this._centerY);
            
            if (this._labelOutline) {            
                drawContext.strokeStyle = this._labelOutline;
                drawContext.strokeText(this._text, this._centerX, this._centerY);
            }
        }
        
        drawContext.restore();
    }
    
    /**
     * Prepare the drawing context to display the text label
     * @private
     * 
     * @param {Context2D} drawContext
     */
    _setupText(drawContext) {
        drawContext.fillStyle = this._labelColor;
        drawContext.textBaseline = "middle";
        drawContext.textAlign = "center";
        drawContext.font = this._fontHeight + "px " + this._labelFont;
    }
    
    /**
     * Calculate the size of the label on the canvas
     * @private
     */
    _measureLabel() {
        let drawContext = canvas._canvas.getContext("2d");
        
        drawContext.save();
        this._setupText(drawContext);
        let measurements = drawContext.measureText(this._text);
        drawContext.restore();
        
        let numLines = 1 + (this._text.match(new RegExp("\n", "g")) || []).length;
        
        this._textWidth = measurements.width;
        this._textHeight = this._fontHeight * numLines;
    }
}

/**
 * A rectangle that can be drawn on a canvas
 * @type Rect
 */
class Rect extends Shape {
    /**
     * Create a rectangle at a given location with a specified size
     * @param {Number} x
     * @param {Number} y
     * @param {Number} width
     * @param {Number} height
     * @returns {Rect}
     */
    constructor (x, y, width, height) {
        let centerX = x + (width/2);
        let centerY = y + (height/2);
        super (centerX, centerY);
        
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
    }
    
    setX(x) {
        this._x = x;
        this._centerX = x + (this._width / 2);
    }
    
    setY(y) {
        this._y = y;
        this._centerY = y + (this._height / 2);
    }
    
    setWidth(width) {
        this._width = width;
    }
    
    getWidth() { return this._width; }
    
    setHeight(height) {
        this._height = height;
    }
    
    getHeight() { return this._height; }
    
    /**
     * Determine if a point falls within the rectangle
     * 
     * @param {Number} x
     * @param {Number} y
     * @returns {Boolean}
     */
    contains(x, y) {
        if ((x >= this._x) && (x <= (this._x + this._width)) &&
            (y >= this._y) && (y <= (this._y + this._width))) {
            return true;
        }
        
        return false;
    }
    
    /**
     * Draw the rectangle on a canvas's drawing context
     * @param {Context2d} drawContext
     */
    draw(drawContext) {
        drawContext.save();

        if (this._fillColor) {
            drawContext.fillStyle = this._fillColor;
            drawContext.fillRect(this._x, this._y, this._width, this._height);
        }
        
        if (this._outlineColor) {
            drawContext.strokeStyle = this._outlineColor;
            drawContext.strokeRect(this._x, this._y, this._width, this._height);
        }
        
        super.draw(drawContext);
        
        drawContext.restore();
    }
}

/**
 * A circle that can be drawn on a canvas
 * 
 * @type Circle
 */
class Circle extends Shape {
    /**
     * Create a circle centered on a given point with a specified radius
     * 
     * @param {Number} x
     * @param {Number} y
     * @param {Number} radius
     * @returns {Circle}
     */
    constructor(x, y, radius) {
        radius = radius | 5;
        super(x, y);
        this._radius = radius;
    }
    
    setRadius(radius) {
        this._radius = radius;
    }
    
    getRadius() {
        return this._radius;
    }
    
    /**
     * Determine if the circle contains a given point
     * 
     * @param {Number} x
     * @param {Number} y
     * @returns {Boolean}
     */
    contains(x, y) {
        let distx = Math.abs(x - this._x);
        let disty = Math.abs(y - this._y);
        
        let dist = Math.sqrt((distx * distx) + (disty * disty));
        
        if (dist <= this._radius) {
            return true;
        }
        
        return false;
    }
    
    /**
     * Draw the circle on a canvas's drawing context
     * @param {Context2D} drawContext
     */
    draw(drawContext) {
        drawContext.save();
        
        if (this._fillColor) {
            drawContext.fillStyle = this._fillColor;
        }
        
        if (this._outlineColor) {
            drawContext.strokeStyle = this._outlineColor;           
        }
        
        drawContext.beginPath();
        drawContext.arc(this._x, this._y,  this._radius, 0, 2*Math.PI);
        
        if (this._fillColor) {
            drawContext.fill(); 
        }
        
        if (this._outlineColor) {
            drawContext.stroke();
        }
        drawContext.closePath();
        
        super.draw(drawContext);
        
        drawContext.restore();
    }
}

/**
 * A line that can be drawn on a canvas
 * @type Line
 */
class Line extends Shape {
    /**
     * Create a line segment that extends from (x,y) to (x2, y2)
     * 
     * @param {Number} x
     * @param {Number} y
     * @param {Number} x2
     * @param {Number} y2
     * @returns {Line}
     */
    constructor (x, y, x2, y2) {
        let centerX = (x + x2) /2;
        let centerY = (y + y2) /2;
        super (centerX, centerY);
        
        this._x = x;
        this._y = y;
        this._x2 = x2;
        this._y2 = y2;
        this._width = 1;
    }
    
    setX(x) {
        this._x = x;
        this._centerX = x + (this._width / 2);
    }
    
    setY(y) {
        this._y = y;
        this._centerY = y + (this._height / 2);
    }
    
    setEndX(x) { this._x2 = x; }
    
    getEndX() { return this._x2; }
    
    setEndY(y) { this._y2 = y; }
    
    getEndY() { return this._y2; }
        
    setColor (color) { this._outlineColor = color; }
    
    setOutline (color) { this._outlineColor = color; }
    
    setWeight(weight) { this._weight = weight; }
    
    /**
     * Determine if a point falls (nearly) on the line
     * @param {Number} x
     * @param {Number} y
     * @returns {Boolean}
     */
    contains(x, y) {
        let a1 = this._x - x;
        let b1 = this._y - y;
        let a2 = this._x2 - x;
        let b2 = this._y2 - y;
        let a3 = this._x - this._x2;
        let b3 = this._y - this._y2;
        
        let d1 = Math.sqrt((a1 * a1) + (b1 * b1));
        let d2 = Math.sqrt((a2 * a2) + (b2 * b2));
        let d3 = Math.sqrt((a3 * a3) + (b3 * b3));
        
        return Math.abs((d1 + d2) - d3) < 0.005;
    }
       
    /**
     * Draw the line on a canvas's drawing context
     * 
     * @param {Context2D} drawContext
     */
    draw(drawContext) {
        drawContext.save();

        drawContext.strokeStyle = this._outlineColor;           

        drawContext.lineWidth = this._width;
        
        drawContext.beginPath();
        drawContext.moveTo(this._x, this._y);
        drawContext.lineTo(this._x2, this._y2);
        
        drawContext.stroke();
                
        super.draw(drawContext);
        
        drawContext.restore();
    }

}

/**
 * A Text object that displays a string on a canvas
 * @type Text
 */
class Text extends Shape {
    /**
     * Create a text object displaying a given string centered on (x, y)
     * @param {String} text
     * @param {Number} x
     * @param {Number} y
     * @returns {Text}
     */
    constructor (text, x, y) {
        super(x, y);        
        super.setLabel(text);
        this._labelColor = "#000";
        this._fillColor = null;
    }
    
    setText(text) {
        super.setLabel(text);
    }
    
    setFont (font) { this._labelFont = font; }
    
    setFontSize (pixels) {this._fontHeight = pixels; }
    
    getWidth() { return this._textWidth; }
    
    getHeight() { return this._textHeight; }
    
    setTextColor (color) { this._labelColor = color; }
    
    setTextOutline (color) { this._labelOutline = color; }
        
    /**
     * Determine if a point falls inside of the text display
     * 
     * @param {Number} x
     * @param {Number} y
     * @returns {Boolean}
     */
    contains(x, y) {
        this._measureLabel();
        
        let w = this._textWidth / 2;
        let h = this._textHeight / 2;
        
        if ((x >= this._x - w) && (x <= (this._x + w)) &&
            (y >= this._y - h) && (y <= (this._y + h))) {
            return true;
        }
        
        return false;
    }
    
    /**
     * Draw the text on a canvas's drawing context
     * @param {Context2D} drawContext
     */
    draw(drawContext) {
        this._measureLabel();
        
        let w = this._textWidth;
        let h = this._textHeight ;
        
        drawContext.save();
        
        if (this._fillColor) {
            drawContext.fillStyle = this._fillColor;
            drawContext.fillRect(this._x - w / 2, this._y - h / 2, w, h);
        }
       
        if (this._outlineColor) {
            drawContext.strokeStyle = this._outlineColor;
            drawContext.strokeRect(this._x - w / 2, this._y - h / 2, w, h);
        }
        
        super.draw(drawContext);
        
        drawContext.restore();
    }
}

class Sprite extends Rect {
    constructor (x, y, url) {
        super (x, y);
        
        this._x = x;
        this._y = y;
        this._img = new Image();
        this._url = url;
        
        let that = this;
        
        this._loader = new Promise((resolve, reject)=>{
            that._img.onload = () => {
                that._width = that._img.width;
                that._height = that._img.height;
                that._centerX = (that._x + that._width) / 2;
                that._centerY = (that._y + that._height) / 2;
                resolve(that._img);
            };
            that._img.onerror = () => {
                console.error("Couldn't load image: " + url);
                reject(that._img);
            };
        });
        
        this._img.src = url;        
    }
    
    /**
     * Draw the text on a canvas's drawing context
     * @param {Context2D} drawContext
     */
    draw(drawContext) {
        let that = this;
        
        this._loader.then(() => {
            drawContext.save();

            drawContext.drawImage(that._img, that._x, that._y);

            drawContext.restore();
        });
    }    
}

/**
 * Information about the mouse in the canvas
 * 
 * @type MouseInfo
 */
var mouseInfo = new class {
    /**
     * 
     */
    constructor () {
        this._x = -1;
        this._y = -1;
        this._buttons = [];
    }
    
    set x(x) { this._x = x; }
    
    get x() { return this._x; }
    
    set y(y) { this._y = y; }
    
    get y() {return this._y; }
    
    setButton(num, pressed) {this._buttons[num] = pressed;}
    
    button(num) { return this._buttons[num];}
    
    
    _mouseEvent(evt, el) {
        if (evt !== null) {
            evt.preventDefault();
            let rect = el.getBoundingClientRect();

            mouseInfo.x = Math.floor((evt.clientX-rect.left)/(rect.right-rect.left)*el.width);
            mouseInfo.y = Math.floor((evt.clientY-rect.top)/(rect.bottom-rect.top)*el.height);

            mouseInfo.setButton(0, (evt.buttons & 1) === 1);        
            mouseInfo.setButton(1, (evt.buttons & 2) === 2);        
            mouseInfo.setButton(2, (evt.buttons & 4) === 4);
        }
        else {
            mouseInfo.x = -1;
            mouseInfo.y = -1;
            
            mouseInfo.setButton(0, false);
            mouseInfo.setButton(1, false);
            mouseInfo.setButton(2, false);
        }
    }
};