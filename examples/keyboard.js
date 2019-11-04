const Block = require('../core/block.js');
const _synth = require('../native-util/synth.js');
const _exec = require('../native-util/exec.js');
const _keyboard = require('../core/keyboard.js');
const _readline = require('readline');
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
	
// read keypress from stdin
_readline.emitKeypressEvents(process.stdin);
const _stdin = process.openStdin();
_stdin.setRawMode(true);

_stdin.on('keypress', function(chunk, key) {
	if (key && key.ctrl && key.name == 'c') {
		process.exit();
	} else {
		input.note({ id: key.sequence, key: key.sequence });
	}
});
