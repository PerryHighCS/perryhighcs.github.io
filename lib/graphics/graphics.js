'use strict';

// Adding Array Methods
Array.prototype.remove = function(idx) {
    return this.splice(idx, 1)[0];
};

// import the npm-hosted editor utils only if the other is not available
var editorUtils = require('codehs-js-utils');

// import graphics utilities functions
var graphicsUtils = require('./graphics-utils.js');

// How often to redraw the display
var DEFAULT_FRAME_RATE = 40;

// String list of methods that will be accessible
// to the user
var PUBLIC_METHODS = [];
var PUBLIC_CONSTRUCTORS = [];

// Pressed keys are actually maintained acorss all
// graphics instances since there is only one keyboard.
var pressedKeys = [];

// Keep track of all graphics instances.
var allGraphicsInstances = [];
var graphicsInstanceId = 0;

// init sound
var analyser;
var dataArray;
var gainNode;
var source;
var audioCtx;

/**
 * Set up an instance of the graphics library.
 * @constructor
 * @param {dictionary} options - Options, primarily .canvas, the selector
 *      string for the canvas.
 *      If multiple are returned, we'll take the first one.
 *      If none is passed, we'll look for any canvas
 *      tag on the page.
 */
function CodeHSGraphics(options) {
    options = options || {};
    this.resetAllState();

    this.globalTimer = true;
    this.currentCanvas = null;
    this.setCurrentCanvas(options.canvas);

    // Are we in debug mode? The default is false.
    this.debugMode = options.debug || false;

    // Since we now have multiple instances of the graphics object
    // give each one a unique id
    this.instanceId = graphicsInstanceId;
    graphicsInstanceId++;

    // override any graphics instance that is already using this ID.
    // if there aren't any, just push this instance onto the end.
    var existingId = this.canvasHasInstance(options.canvas);
    if (existingId !== null) {
        var existingGraphics = allGraphicsInstances[existingId];
        existingGraphics.stopTimer('MAIN_TIMER');
        allGraphicsInstances[existingId] = this;
    } else {
        allGraphicsInstances.push(this);
    }
}

/**
 * Adds a method to the public methods constant.
 * @param {string} name - Name of the method.
 */
CodeHSGraphics.registerPublicMethod = function(name) {
    PUBLIC_METHODS.push(name);
};

/**
 * Adds a constructor to the public constructors constant.
 * @param {string} name - Name of the object to be constructed.
 */
CodeHSGraphics.registerConstructorMethod = function(name) {
    PUBLIC_CONSTRUCTORS.push(name);
};

/**
 * Generate strings for the public methods to bring them to the
 * public namespace without having to call them with the graphics instance.
 * @returns {string} Line broken function definitions.
 */
CodeHSGraphics.getNamespaceModifcationString = function() {
    var result = '\n';
    for (var i = 0; i < PUBLIC_METHODS.length; i++) {
        var curMethod = PUBLIC_METHODS[i];

        // Actually create a method in this scope with the name of the
        // method so the student can easily access it. For example, we
        // might have a method like CodeHSGraphics.prototype.add, but we
        // want the student to be able to access it with just `add`, but
        // the proper context for this.
        result +=
            'function ' +
            curMethod +
            '(){\n' +
            '\treturn __graphics__.' +
            curMethod +
            '.apply(__graphics__, arguments);\n' +
            '}\n';

        // result += 'var ' +  curMethod + ' = __graphics__.' + curMethod + ';\n';
    }
    return result;
};

/**
 * Generate strings for the public constructors to bring them to the
 * public namespace without having to call them with the graphics instance.
 * @returns {string} Line broken constructor declarations.
 */
CodeHSGraphics.getConstructorModificationString = function() {
    var result = '';
    for (var i = 0; i < PUBLIC_CONSTRUCTORS.length; i++) {
        var curMethod = PUBLIC_CONSTRUCTORS[i];

        result += 'var ' + curMethod + ' = __graphics__.' + curMethod + ';\n';
    }
    return result;
};

/*************** PUBLIC METHODS *******************/
// NOTE: if you add a public method, you MUST fix linenumber calc for errors:
// function getCorrectLineNumber in editorErrors.js
// adding a public method will add 3 lines to the program.

/**
 * Add an element to the graphics instance.
 * @param {Thing} elem - A subclass of Thing to be added to the graphics instance.
 */
CodeHSGraphics.prototype.add = function(elem) {
    this.elements.push(elem);
};
CodeHSGraphics.registerPublicMethod('add');

/**
 * Wrapper around Audio so we have reference to all Audio objects created.
 * @param{String} url - url of the audio file.
 */
window.oldAudio = window.Audio;
CodeHSGraphics.prototype.Audio = function(url) {
    var audioElem = new oldAudio(url);
    this.audioElements.push(audioElem);
    return audioElem;
};
CodeHSGraphics.prototype.Audio.constructor = window.oldAudio;
CodeHSGraphics.registerPublicMethod('Audio');

/**
 * Record a click.
 */
CodeHSGraphics.prototype.waitForClick = function() {
    this.clickCount++;
};
CodeHSGraphics.registerPublicMethod('waitForClick');

/**
 * Assign a function as a callback for click (mouse down, mouse up) events.
 * @param {function} fn - A callback to be triggered on click events.
 */
CodeHSGraphics.prototype.mouseClickMethod = function(fn) {
    this.clickCallback = editorUtils.safeCallback(fn);
};
CodeHSGraphics.registerPublicMethod('mouseClickMethod');

/**
 * Assign a function as a callback for mouse move events.
 * @param {function} fn - A callback to be triggered on mouse move events.
 */
CodeHSGraphics.prototype.mouseMoveMethod = function(fn) {
    this.moveCallback = editorUtils.safeCallback(fn);
};
CodeHSGraphics.registerPublicMethod('mouseMoveMethod');

/**
 * Assign a function as a callback for mouse down events.
 * @param {function} fn - A callback to be triggered on mouse down.
 */
CodeHSGraphics.prototype.mouseDownMethod = function(fn) {
    this.mouseDownCallback = editorUtils.safeCallback(fn);
};
CodeHSGraphics.registerPublicMethod('mouseDownMethod');

/**
 * Assign a function as a callback for mouse up events.
 * @param {function} fn - A callback to be triggered on mouse up events.
 */
CodeHSGraphics.prototype.mouseUpMethod = function(fn) {
    this.mouseUpCallback = editorUtils.safeCallback(fn);
};
CodeHSGraphics.registerPublicMethod('mouseUpMethod');

/**
 * Assign a function as a callback for drag events.
 * @param {function} fn - A callback to be triggered on drag events.
 */
CodeHSGraphics.prototype.mouseDragMethod = function(fn) {
    this.dragCallback = editorUtils.safeCallback(fn);
};
CodeHSGraphics.registerPublicMethod('mouseDragMethod');

/**
 * Assign a function as a callback for keydown events.
 * @param {function} fn - A callback to be triggered on keydown events.
 */
CodeHSGraphics.prototype.keyDownMethod = function(fn) {
    this.keyDownCallback = editorUtils.safeCallback(fn);
};
CodeHSGraphics.registerPublicMethod('keyDownMethod');

/**
 * Assign a function as a callback for key up events.
 * @param {function} fn - A callback to be triggered on key up events.
 */
CodeHSGraphics.prototype.keyUpMethod = function(fn) {
    this.keyUpCallback = editorUtils.safeCallback(fn);
};
CodeHSGraphics.registerPublicMethod('keyUpMethod');

/**
 * Assign a function as a callback for device orientation events.
 * @param {function} fn - A callback to be triggered on device orientation
 *                        events.
 */
CodeHSGraphics.prototype.deviceOrientationMethod = function(fn) {
    this.deviceOrientationCallback = editorUtils.safeCallback(fn);
};
CodeHSGraphics.registerPublicMethod('deviceOrientationMethod');

/**
 * Assign a function as a callback for device motion events.
 * @param {function} fn - A callback to be triggered device motion events.
 */
CodeHSGraphics.prototype.deviceMotionMethod = function(fn) {
    this.deviceMotionCallback = editorUtils.safeCallback(fn);
};
CodeHSGraphics.registerPublicMethod('deviceMotionMethod');

/**
 * Assign a function as a callback for when audio data changes for audio
 * being played in a graphics program.
 * @param {object} tag - Audio element playing sound to analyze
 * @param {function} fn - A callback to be triggered on audio data change.
 */
CodeHSGraphics.prototype.audioChangeMethod = function(tag, fn) {
    // get new audio context and create analyser
    audioCtx = new window.AudioContext();
    analyser = audioCtx.createAnalyser();
    // set fft -- used to set the number of slices we break our frequency range
    // in to.
    analyser.fftSize = 128;
    // gt bugger length and create a new array in that size
    var bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    // create media source from student's audio tag
    source = audioCtx.createMediaElementSource(tag);
    // should allow cors
    source.crossOrigin = 'anonymous';
    // connect analyzer to sound
    source.connect(analyser);
    // create gain node and connect to sound (makes speaker output possuble)
    var gainNode = audioCtx.createGain();
    source.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    // create callback fn and assign attach to timer
    this.audioChangeCallback = editorUtils.safeCallback(fn);
    this.setGraphicsTimer(this.updateAudio.bind(this), DEFAULT_FRAME_RATE, null, 'updateAudio');
};
CodeHSGraphics.registerPublicMethod('audioChangeMethod');

/**
 * Check if a key is currently pressed
 * @param {integer} keyCode - Key code of key being checked.
 * @returns {boolean} Whether or not that key is being pressed.
 */
CodeHSGraphics.prototype.isKeyPressed = function(keyCode) {
    return pressedKeys.indexOf(keyCode) != -1;
};
CodeHSGraphics.registerPublicMethod('isKeyPressed');

/**
 * Get the width of the entire graphics canvas.
 * @returns {float} The width of the canvas.
 */
CodeHSGraphics.prototype.getWidth = function() {
    var canvas = this.getCanvas();
    return parseFloat(canvas.getAttribute('width'));
};
CodeHSGraphics.registerPublicMethod('getWidth');

/**
 * Get the height of the entire graphics canvas.
 * @returns {float} The height of the canvas.
 */
CodeHSGraphics.prototype.getHeight = function() {
    var canvas = this.getCanvas();
    return parseFloat(canvas.getAttribute('height'));
};
CodeHSGraphics.registerPublicMethod('getHeight');

/**
 * Remove a timer associated with a function.
 * @param {function} fn - Function whose timer is removed.
 * note 'fn' may also be the name of the function.
 */
CodeHSGraphics.prototype.stopTimer = function(fn) {
    var key = typeof fn === 'function' ? fn.name : fn;
    clearInterval(this.timers[key]);
};
CodeHSGraphics.registerPublicMethod('stopTimer');

/**
 * Stop all timers.
 */
CodeHSGraphics.prototype.stopAllTimers = function() {
    for (var i = 1; i < 99999; i++) {
        window.clearInterval(i);
    }
    this.setMainTimer();
};
CodeHSGraphics.registerPublicMethod('stopAllTimers');

/**
 * Create a new timer
 * @param {function} fn - Function to be called at intervals.
 * @param {integer} time - Time interval to call function `fn`
 * @param {dictionary} data - Any data associated with the timer.
 * @param {string} name - Name of this timer.
 */
CodeHSGraphics.prototype.setTimer = function(fn, time, data, name) {
    if (arguments.length < 2) {
        throw new Error(
            '2 parameters required for <span class="code">' +
                'setTimer</span>, ' +
                arguments.length +
                ' found. You must ' +
                'provide a callback function and ' +
                'a number representing the time delay ' +
                'to <span class="code">setTimer</span>'
        );
    }
    if (typeof fn !== 'function') {
        throw new TypeError(
            'Invalid callback function. ' +
                'Make sure you are passing an actual function to ' +
                '<span class="code">setTimer</span>.'
        );
    }
    if (typeof time !== 'number' || !isFinite(time)) {
        throw new TypeError(
            'Invalid value for time delay. ' +
                'Make sure you are passing a finite number to ' +
                '<span class="code">setTimer</span> for the delay.'
        );
    }

    var self = this;

    // Safety, set a min frequency
    if (isNaN(time) || time < 15) {
        time = 15;
    }

    if (this.waitingForClick()) {
        this.delayedTimers.push({
            fn: fn,
            time: time,
            data: data,
            clicks: self.clickCount,
            name: name,
        });
    } else {
        this.setGraphicsTimer(fn, time, data, name);
    }
};
CodeHSGraphics.registerPublicMethod('setTimer');

/**
 * Set the background color of the canvas.
 * @param {Color} color - The desired color of the canvas.
 */
CodeHSGraphics.prototype.setBackgroundColor = function(color) {
    this.backgroundColor = color;
};
CodeHSGraphics.registerPublicMethod('setBackgroundColor');

/**
 * Clear everything from the canvas.
 */
CodeHSGraphics.prototype.clear = function(context) {
    var ctx = context || this.getContext();
    ctx.clearRect(0, 0, this.getWidth(), this.getHeight());
};
CodeHSGraphics.registerPublicMethod('clear');

/**
 * Get an element at a specific point.
 * If several elements are present at the position, return the one put there first.
 * @param {number} x - The x coordinate of a point to get element at.
 * @param {number} y - The y coordinate of a point to get element at.
 * @returns {Thing|null} The object at the point (x, y), if there is one (else null).
 */
CodeHSGraphics.prototype.getElementAt = function(x, y) {
    for (var i = this.elements.length - 1; i >= 0; i--) {
        if (this.elements[i].containsPoint(x, y, this)) {
            return this.elements[i];
        }
    }
    return null;
};
CodeHSGraphics.registerPublicMethod('getElementAt');

/**
 * Check if an element exists with the given paramenters.
 * @param {object} params - Dictionary of parameters for the object.
 *      Includes x, y, heigh, width, color, radius, label and type.
 * @returns {boolean}
 */
CodeHSGraphics.prototype.elementExistsWithParameters = function(params) {
    for (var i = this.elements.length - 1; i >= 0; i--) {
        var elem = this.elements[i];
        try {
            if (
                params.x !== undefined &&
                this.runCode('return ' + params.x).result.toFixed(0) != elem.getX().toFixed(0)
            ) {
                continue;
            }
            if (
                params.y !== undefined &&
                this.runCode('return ' + params.y).result.toFixed(0) != elem.getY().toFixed(0)
            ) {
                continue;
            }

            if (
                params.width !== undefined &&
                this.runCode('return ' + params.width).result.toFixed(0) !=
                    elem.getWidth().toFixed(0)
            ) {
                continue;
            }

            if (
                params.height !== undefined &&
                this.runCode('return ' + params.height).result.toFixed(0) !=
                    elem.getHeight().toFixed(0)
            ) {
                continue;
            }

            if (
                params.radius !== undefined &&
                this.runCode('return ' + params.radius).result.toFixed(0) !=
                    elem.getRadius().toFixed(0)
            ) {
                continue;
            }

            if (
                params.color !== undefined &&
                this.runCode('return ' + params.color).result != elem.getColor()
            ) {
                continue;
            }

            if (params.label !== undefined && params.label != elem.getLabel()) {
                continue;
            }

            if (params.type !== undefined && params.type != elem.getType()) {
                continue;
            }
        } catch (err) {
            continue;
        }
        return true;
    }
    return false;
};
CodeHSGraphics.registerPublicMethod('elementExistsWithParameters');

/**
 * Remove all elements from the canvas.
 */
CodeHSGraphics.prototype.removeAll = function() {
    this.elements = [];
};
CodeHSGraphics.registerPublicMethod('removeAll');

/**
 * Remove a specific element from the canvas.
 * @param {Thing} elem - The element to be removed from the canvas.
 */
CodeHSGraphics.prototype.remove = function(elem) {
    for (var i = 0; i < this.elements.length; i++) {
        if (this.elements[i] == elem) {
            this.elements.splice(i, 1); // Remove from list
        }
    }
};
CodeHSGraphics.registerPublicMethod('remove');

/**
 * Set the size of the canvas.
 * @param {number} w - Desired width of the canvas.
 * @param {number} h - Desired height of the canvas.
 */
CodeHSGraphics.prototype.setSize = function(w, h) {
    var canvas = this.getCanvas();
    canvas.width = w;
    canvas.height = h;
    // this.setSize(w, h);
};
CodeHSGraphics.registerPublicMethod('setSize');

/****************** SHAPE CONSTRUCTORS **************/

// Insertion point for graphics modules.

CodeHSGraphics.prototype.Rectangle = require('./rectangle.js');
CodeHSGraphics.registerConstructorMethod('Rectangle');

CodeHSGraphics.prototype.Circle = require('./circle.js');
CodeHSGraphics.registerConstructorMethod('Circle');

CodeHSGraphics.prototype.Line = require('./line.js');
CodeHSGraphics.registerConstructorMethod('Line');

CodeHSGraphics.prototype.Grid = require('./grid.js');
CodeHSGraphics.registerConstructorMethod('Grid');

CodeHSGraphics.prototype.Line = require('./line.js');
CodeHSGraphics.registerConstructorMethod('Line');

CodeHSGraphics.prototype.Polygon = require('./polygon.js');
CodeHSGraphics.registerConstructorMethod('Polygon');

CodeHSGraphics.prototype.Text = require('./text.js');
CodeHSGraphics.registerConstructorMethod('Text');

CodeHSGraphics.prototype.Oval = require('./oval.js');
CodeHSGraphics.registerConstructorMethod('Oval');

CodeHSGraphics.prototype.Arc = require('./arc.js');
CodeHSGraphics.registerConstructorMethod('Arc');

CodeHSGraphics.prototype.Color = require('./color.js');
CodeHSGraphics.registerConstructorMethod('Color');

CodeHSGraphics.prototype.WebImage = require('./webimage.js');
CodeHSGraphics.registerConstructorMethod('WebImage');

CodeHSGraphics.prototype.ImageLibrary = require('./imagelibrary.js');
CodeHSGraphics.registerConstructorMethod('ImageLibrary');

// CodeHSGraphics.prototype.Sound = require('./sound.js');
// CodeHSGraphics.registerConstructorMethod('Sound');

/****************** PRIVATE METHODS *****************/

/**
 * This is how you run the code, but get access to the
 * state of the graphics library. The current instance
 * becomes accessible in the code.
 * @param {string} code - The code from the editor.
 */
CodeHSGraphics.prototype.runCode = function(code) {
    var getPublicMethodString = CodeHSGraphics.getNamespaceModifcationString();
    var getConstructorModificationString = CodeHSGraphics.getConstructorModificationString();

    var wrap = '';

    // Give the user easy access to public graphics methods
    // in the proper context.
    wrap += getPublicMethodString;
    wrap += getConstructorModificationString;

    // Text objects need access to some 2d graphics context to compute
    // height and width. This might be done before a draw call.
    wrap += '\nText.giveDefaultContext(__graphics__);\n';

    // User code.
    wrap += code;

    // Call the start function
    wrap += "\n\nif(typeof start == 'function') {start();} ";

    return editorUtils.safeEval(wrap, this, '__graphics__');
};

/**
 * Resets all the timers to time 0.
 */
CodeHSGraphics.prototype.resetAllTimers = function() {
    for (var cur in this.timers) {
        clearInterval(this.timers[cur]);
    }
};

CodeHSGraphics.prototype.stopAllAudio = function() {
    this.audioElements.forEach(function(audio) {
        audio.pause();
    });
};

/**
 * Resets the graphics instance to a clean slate.
 */
CodeHSGraphics.prototype.resetAllState = function() {
    this.backgroundColor = null;
    this.elements = [];
    this.audioElements = [];
    this.clickCallback = null;
    this.moveCallback = null;
    this.mouseDownCallback = null;
    this.mouseUpCallback = null;
    this.dragCallback = null;
    this.keyDownCallback = null;
    this.keyUpCallback = null;
    this.deviceOrientationCallback = null;
    this.deviceMotionCallback = null;
    this.audioChangeCallback = null;
    // if audio context exists, close it
    if (audioCtx) {
        audioCtx.close();
    }
    // if audio source exists, disconnect it
    if (source) {
        source.disconnect();
    }
    // A fast hash from timer key to timer interval #
    this.timers = {};

    // A useful list to store information about all timers.
    this.timersList = [];

    this.clickCount = 0;
    this.delayedTimers = [];
};

/**
 * Reset all timers to 0 and clear timers and canvas.
 */
CodeHSGraphics.prototype.fullReset = function() {
    this.stopAllAudio();
    this.resetAllTimers();
    this.resetAllState();

    /* THIS LINE OF CODE. Leave it commented out.
     * If we override this setting ( like we do in karel)
     * it shouldn't be reset to true. */
    // this.globalTimer = true;
    this.setMainTimer();
};

/**
 * Return if the graphics canvas exists.
 * @returns {boolean} Whether or not the canvas exists.
 */
CodeHSGraphics.prototype.canvasExists = function() {
    return this.getCanvas() !== null;
};

/**
 * Return the current canvas we are using. If there is no
 * canvas on the page this will return null.
 * @returns {object} The current canvas.
 */
CodeHSGraphics.prototype.getCanvas = function() {
    return this.currentCanvas;
};

/**
 * Set the current canvas we are working with. If no canvas
 * tag matches the selectorv then we will just have the current
 * canvas set to null.
 * @param {string} canvasSelector - String representing canvas class or ID.
 *      Selected with jQuery.
 */
CodeHSGraphics.prototype.setCurrentCanvas = function(canvasSelector) {
    /* If we were passed a selector, get the first matching
     * element. */
    if (canvasSelector) {
        this.currentCanvas = $(canvasSelector)[0];
    } else {
        this.currentCanvas = document.getElementsByTagName('canvas')[0];
    }

    // If it is a falsey value like undefined, set it to null.
    if (!this.currentCanvas) {
        this.currentCanvas = null;
    }

    // On changing the canvas reset the state.
    this.fullReset();
    this.setup();
};

/**
 * Stop the global timer
 */
CodeHSGraphics.prototype.stopGlobalTimer = function() {
    this.globalTimer = false;
};

/**
 * Draw the background color for the current object.
 */
CodeHSGraphics.prototype.drawBackground = function() {
    if (this.backgroundColor) {
        var context = this.getContext();
        context.fillStyle = this.backgroundColor;
        context.beginPath();
        context.rect(0, 0, this.getWidth(), this.getHeight());
        context.closePath();
        context.fill();
    }
};

/**
 * Return the 2D graphics context for this graphics
 * object, or null if none exists.
 * @returns {context} The 2D graphics context.
 */
CodeHSGraphics.prototype.getContext = function() {
    var drawingCanvas = this.getCanvas();
    // Check the element is in the DOM and the browser supports canvas
    if (drawingCanvas && drawingCanvas.getContext) {
        // Initaliase a 2-dimensional drawing context
        var context = drawingCanvas.getContext('2d');
        return context;
    }
    return null;
};

/**
 * Redraw this graphics canvas.
 */
CodeHSGraphics.prototype.redraw = function() {
    this.clear();
    this.drawBackground();
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].draw(this);
    }
};

/**
 * Set the main timer for graphics.
 */
CodeHSGraphics.prototype.setMainTimer = function() {
    var self = this;
    /* Refresh the screen every 40 ms */
    if (this.globalTimer) {
        this.setTimer(
            function() {
                self.redraw();
            },
            DEFAULT_FRAME_RATE,
            null,
            'MAIN_TIMER'
        );
    }
};

/**
 * Set the size of the canvas.
 * This is a re-declaration so I'm leaving it commented out.
CodeHSGraphics.prototype.setSize = function(width, height) {
    var canvas = this.getCanvas();
    canvas.width = width;
    canvas.height = height;
};
*/

/**
 * Whether the graphics instance is waiting for a click.
 * @returns {boolean} Whether or not the instance is waiting for a click.
 */
CodeHSGraphics.prototype.waitingForClick = function() {
    return this.clickCount !== 0;
};

/**
 * Whether the selected canvas already has an instance associated.
 */
CodeHSGraphics.prototype.canvasHasInstance = function(canvas) {
    var instance;
    for (var i = 0; i < allGraphicsInstances.length; i++) {
        instance = allGraphicsInstances[i];
        if (instance.instanceId !== this.instanceId && instance.getCanvas() === canvas) {
            return instance.instanceId;
        }
    }
    return null;
};

/**
 * Get the distance between two points, (x1, y1) and (x2, y2)
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {number} Distance between the two points.
 */
CodeHSGraphics.prototype.getDistance = function(x1, y1, x2, y2) {
    return graphicsUtils.getDistance(x1, y1, x2, y2);
};

/**
 * Set up the graphics instance to prepare for interaction
 */
CodeHSGraphics.prototype.setup = function() {
    var self = this;

    var drawingCanvas = this.getCanvas();

    // self.setMainTimer();

    drawingCanvas.onclick = function(e) {
        if (self.waitingForClick()) {
            self.clickCount--;

            for (var i = 0; i < self.delayedTimers.length; i++) {
                var timer = self.delayedTimers[i];
                timer.clicks--;
                if (timer.clicks === 0) {
                    self.setGraphicsTimer(timer.fn, timer.time, timer.data);
                }
            }
            return;
        }

        if (self.clickCallback) {
            self.clickCallback(e);
        }
    };

    var mouseDown = false;

    drawingCanvas.onmousemove = function(e) {
        if (self.moveCallback) {
            self.moveCallback(e);
        }
        if (mouseDown && self.dragCallback) {
            self.dragCallback(e);
        }
    };

    drawingCanvas.onmousedown = function(e) {
        mouseDown = true;
        if (self.mouseDownCallback) {
            self.mouseDownCallback(e);
        }
    };

    drawingCanvas.onmouseup = function(e) {
        mouseDown = false;
        if (self.mouseUpCallback) {
            self.mouseUpCallback(e);
        }
    };

    // TOUCH EVENTS!
    drawingCanvas.ontouchmove = function(e) {
        e.preventDefault();
        if (self.dragCallback) {
            self.dragCallback(e);
        } else if (self.moveCallback) {
            self.moveCallback(e);
        }
    };

    drawingCanvas.ontouchstart = function(e) {
        e.preventDefault();
        if (self.mouseDownCallback) {
            self.mouseDownCallback(e);
        } else if (self.clickCallback) {
            self.clickCallback(e);
        }

        if (self.waitingForClick()) {
            self.clickCount--;

            for (var i = 0; i < self.delayedTimers.length; i++) {
                var timer = self.delayedTimers[i];
                timer.clicks--;
                if (timer.clicks === 0) {
                    self.setGraphicsTimer(timer.fn, timer.time, timer.data);
                }
            }
            return;
        }
    };

    drawingCanvas.ontouchend = function(e) {
        e.preventDefault();
        if (self.mouseUpCallback) {
            self.mouseUpCallback(e);
        }
    };
};

/**
 * Set a graphics timer.
 * @param {function} fn - The function to be executed on the timer.
 * @param {number} time - The time interval for the function.
 * @param {object} data - Any arguments to be passed into `fn`.
 * @param {string} name - The name of the timer.
 */
CodeHSGraphics.prototype.setGraphicsTimer = function(fn, time, data, name) {
    if (typeof name === 'undefined') {
        name = fn.name;
    }

    this.timers[name] = editorUtils.safeSetInterval(fn, data, time);

    this.timersList.push({
        name: name,
        fn: fn,
        data: data,
        time: time,
    });
};

/** AUDIO EVENTS **/

/**
 * This function is called on a timer. Calls the student's audioChangeCallback
 * function and passes it the most recent audio data.
 */
CodeHSGraphics.prototype.updateAudio = function() {
    analyser.getByteFrequencyData(dataArray);
    if (this.audioChangeCallback) {
        /* this is the one strange thing. Up above, we set analyser.fftSize. That
        * determines how man 'buckets' we split our file into (fft size / 2).
        * For some reason, the top 16 'buckets' were always coming out 0, so we
        * used .slice() to cut out the last 18 items out of the array. In the
        * future, if you want to experiment with different FFT sizes, it will
        * be necessary to adjust this slice call (the size of the array will
        * definitely change, and number of empty indexes will probably change).
        */
        var numBuckets = 46;
        this.audioChangeCallback(dataArray.slice(0, numBuckets));
    }
};

/** KEY EVENTS ****/
window.onkeydown = function(e) {
    var index = pressedKeys.indexOf(e.keyCode);
    if (index === -1) {
        pressedKeys.push(e.keyCode);
    }

    var toReturn;
    // Any graphics instance might need to respond to key events.
    for (var i = 0; i < allGraphicsInstances.length; i++) {
        var curInstance = allGraphicsInstances[i];

        if (curInstance.keyDownCallback) {
            curInstance.keyDownCallback(e);
            // Override the default behavior of certain keys
            // Jeremy: Unfortunately, I'm not sure what the default behavior
            // was, or what this update does... or what depends on this.
            toReturn = true;
            if (e.keyCode == Keyboard.SPACE) {
                toReturn = false;
            }
            if (e.keyCode >= Keyboard.LEFT && e.keyCode <= Keyboard.DOWN) {
                toReturn = false;
            }
        }
    }

    return toReturn;
};

window.onkeyup = function(e) {
    var index = pressedKeys.indexOf(e.keyCode);
    if (index !== -1) {
        pressedKeys.splice(index, 1);
    }

    // Any graphics instance might need to respond to key events.
    for (var i = 0; i < allGraphicsInstances.length; i++) {
        var curInstance = allGraphicsInstances[i];
        if (curInstance.keyUpCallback) {
            curInstance.keyUpCallback(e);
        }
    }
};

/** MOBILE DEVICE EVENTS ****/
if (window.DeviceOrientationEvent) {
    window.ondeviceorientation = function(e) {
        for (var i = 0; i < allGraphicsInstances.length; i++) {
            var curInstance = allGraphicsInstances[i];
            if (curInstance.deviceOrientationCallback) {
                curInstance.deviceOrientationCallback(e);
            }
        }
    };
}

if (window.DeviceMotionEvent) {
    window.ondevicemotion = function(e) {
        for (var i = 0; i < allGraphicsInstances.length; i++) {
            var curInstance = allGraphicsInstances[i];
            if (curInstance.deviceMotionCallback) {
                curInstance.deviceMotionCallback(e);
            }
        }
    };
}

/* Mouse and Touch Event Helpers */

// Same for MouseEvent or TouchEvent given the event and target
// Method based on: http://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element

CodeHSGraphics.getBaseCoordinates = function(e, target) {
    var x;
    var y;
    if (e.pageX || e.pageY) {
        x = e.pageX;
        y = e.pageY;
    } else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    var offset = target.offset();
    x -= offset.left;
    y -= offset.top;

    return {x: x, y: y};
};

CodeHSGraphics.getMouseCoordinates = function(e) {
    var baseCoordinates = CodeHSGraphics.getBaseCoordinates(e, $(e.currentTarget));
    var x = baseCoordinates.x;
    var y = baseCoordinates.y;

    // at zoom levels != 100%, x and y are floats.
    x = Math.round(x);
    y = Math.round(y);

    return {x: x, y: y};
};

CodeHSGraphics.getTouchCoordinates = function(e) {
    var baseCoordinates = CodeHSGraphics.getBaseCoordinates(e, $(e.target));
    var x = baseCoordinates.x;
    var y = baseCoordinates.y;

    // canvas almost always gets scaled down for mobile screens, need to figure
    // out the x and y in terms of the unscaled canvas size in pixels otherwise
    // touch coordinates are off
    var screenCanvasWidth = $('#game').width();
    var fullCanvasWidth = $('#game').attr('width');
    var ratio = fullCanvasWidth / screenCanvasWidth;
    x = x * ratio;
    y = y * ratio;

    // at zoom levels != 100%, x and y are floats.
    x = Math.round(x);
    y = Math.round(y);

    return {x: x, y: y};
};

MouseEvent.prototype.getX = function() {
    return CodeHSGraphics.getMouseCoordinates(this).x;
};

MouseEvent.prototype.getY = function() {
    return CodeHSGraphics.getMouseCoordinates(this).y;
};

if (typeof TouchEvent != 'undefined') {
    TouchEvent.prototype.getX = function() {
        return CodeHSGraphics.getTouchCoordinates(this.touches[0]).x;
    };

    TouchEvent.prototype.getY = function() {
        return CodeHSGraphics.getTouchCoordinates(this.touches[0]).y;
    };
}

module.exports = {
    CodeHSGraphics: CodeHSGraphics,
    PUBLIC_METHODS: PUBLIC_METHODS,
    PUBLIC_CONSTRUCTORS: PUBLIC_CONSTRUCTORS,
};
