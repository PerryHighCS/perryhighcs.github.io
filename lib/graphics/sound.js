'use strict';


// requires the ToneJS library
var Tone = require('tone');

/*
 * Construct a new Sound.
 * Optionally set the frequency and the oscillator type.
 *
 * @param frequency - Either a number (Hertz) or note ("C#4" for middle C Sharp)
 * @param oscillatorType {String} - sine, triangle, square, or sawtooth
 */
function Sound(frequency, oscillatorType) {
    frequency = frequency || 440;
    oscillatorType = oscillatorType || 'sine';

    this.oscillator = new Tone.Oscillator(frequency, oscillatorType).toMaster();
}

/*
 * Set the Sound's frequency
 *
 * @param frequency - Either a number (Hertz) or note ("C#4" for middle C Sharp)
 */
Sound.prototype.setFrequency = function(frequency) {
    this.oscillator.frequency.value = frequency;
};

/*
 * Set the Sound's volume
 *
 * @param {float} - the volume in decibels
 */
Sound.prototype.setVolume = function(volume) {
    this.oscillator.volume.value = volume;
};

/*
 * Get the Sound's frequency
 *
 * @returns The Sound's frequency
 */
Sound.prototype.getFrequency = function() {
    return this.oscillator.frequency.value;
};

/*
 * Get the Sound's volume
 *
 * @returns the volume
 */
Sound.prototype.getVolume = function() {
    return this.oscillator.volume.value;
};

/*
 * Set the Sound's oscillator type
 *
 * @param oscillatorType {string} - sine, triangle, square, or sawtooth
 */
Sound.prototype.setOscillatorType = function(oscillatorType) {
    this.oscillator.type = oscillatorType;
};

/*
 * Get the Sound's oscillator type
 *
 * @returns a String representing the oscillator type
 */
Sound.prototype.getOscillatorType = function() {
    return this.oscillator.type;
};

/*
 * Play the sound indefinitely
 */
Sound.prototype.play = function() {
    this.oscillator.start();
};

/*
 * Play the sound for a given number of seconds
 *
 * @param {float} - the number of seconds to play the sound for
 */
Sound.prototype.playFor = function(duration) {
    this.oscillator.start();
    this.oscillator.stop('+' + duration);
};

/*
 * Stop playing the sound immediately.
 */
Sound.prototype.stop = function() {
    this.oscillator.stop();
};


/*
 * Add an effect to this sound
 *
 * @param effectName {String} - the name of the prepackaged effect, ie "echo"
 * @param effectValue {float} - value from 0 to 1 defining how heavily the
 *                              effect applies
 */
Sound.prototype.setEffect = function(effectName, effectValue) {
    switch (effectName) {
        case 'distortion':
            var distortion = new Tone.Distortion(effectValue).toMaster();
            this.oscillator.connect(distortion);
            return;
        case 'chebyshev':
            var chebyshev = new Tone.Chebyshev(effectValue * 100).toMaster();
            this.oscillator.connect(chebyshev);
            return;
        case 'reverb':
            var reverb = new Tone.Freeverb().toMaster();
            reverb.wet.value = effectValue;
            this.oscillator.connect(reverb);
            return;
        case 'tremolo':
            var tremolo = new Tone.Tremolo().toMaster().start();
            tremolo.wet.value = effectValue;
            this.oscillator.connect(tremolo);
            return;
        case 'vibrato':
            var vibrato = new Tone.Vibrato().toMaster();
            vibrato.wet.value = effectValue;
            this.oscillator.connect(vibrato);
            return;
        default:
            return;
    }
};

module.exports = Sound;
