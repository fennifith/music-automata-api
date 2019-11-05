const Block = require('../core/block.js');
const _synth = require('../native-util/synth.js');
const _exec = require('../native-util/exec.js');
const _keyboard = require('../native-util/keyboard.js');
const { note } = require('../core/note.js');

let synth = _synth();
let exec = _exec();

const log = new Block()
	.on('note', function(note) {
		return note.mutate({
			test: "HELLO THERE, HUMAN"
		});
	})
	.on('play', (note) => {
		console.log(note);
	});

const input = _keyboard()
	.to(log)
	.to(synth);

