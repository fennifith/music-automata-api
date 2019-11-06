const Block = require('../core/block.js');
const _synth = require('../native-util/synth.js');
const _exec = require('../native-util/exec.js');
const _keyboard = require('../native-util/keyboard.js');
const { note } = require('../core/note.js');

let synth = _synth();
	
const log = new Block()
	.on('play', (note) => {
		console.log(note);
	});

let random = new Block()
	.to(log)
	.to(synth);

function randomNote() {
	let midi = Math.floor(Math.random() * 50) + 40;
	let n = note({ id: midi, midi });
	random.note(n);
	n.for(500).on('end', () => {
		randomNote();
	});
}

randomNote();
