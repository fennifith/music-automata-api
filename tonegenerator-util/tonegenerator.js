const Block = require('../core/block.js');
const _tone = require('tonegenerator');

module.exports = function() {
    return new Block()
    	.on('play', function(note) {
			let tonedata = tone({
				frequency: note.midi, // convert midi->freq.
				lengthInSecs: 0.2,
				volume: 30,
				rate: 44100,
				shape: 'triangle'
			})
		});
};
