const Block = require('../core/block.js');
const NodeSynth = require('nodesynth');
const _timer = require('../core/timer.js');

module.exports = function({ opts = {bitDepth:16,sampleRate:44100} } = {}) {
	const synth = new NodeSynth.Synth(opts);
	synth.play();

	const osc = {};

	function sourceSynth() {
		let arr = Object.values(osc);
		if (arr.length > 0) {
			let osc = null;
			arr.forEach((o) => {
				osc = osc ? osc.mix(o) : o;
			});

			synth.source = osc;
		} else synth.source = null;
	}

	let block = new Block()
		.on('play', (note) => {
			if (!note.data || !note.data.midi) {
				return;
			}

			if (!osc[note.id])
				osc[note.id] = new NodeSynth.Oscillator('sin', () => Math.pow(2, (note.data.midi - 69) / 12) * 440).multiply(0.5);
			else delete osc[note.id];

			sourceSynth();
		});
	
	return block;
};
