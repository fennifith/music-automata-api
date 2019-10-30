const Block = require('../core/block.js');
const NodeSynth = require('nodesynth');
const _timer = require('../core/timer.js');

module.exports = function({ opts = {bitDepth:16,sampleRate:44100} } = {}) {
	let synth = new NodeSynth.Synth(opts);
	synth.play();

	let block = new Block()
		.on('play', (note) => {
			if (!note.data || !note.data.midi) {
				synth.source = null;
				return;
			}
			
			synth.source = new NodeSynth.Oscillator('sq', () => Math.pow(2, (note.data.midi - 69) / 12) * 440);

			if (note.duration > 0) {
				_timer.at(note.timestampEnd).then(() => {
					synth.source = null;
				});
			}
		});
	
	return block;
};
