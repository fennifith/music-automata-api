const Block = require('../core/block.js');
const _synth = require('../native-util/synth.js');
const _exec = require('../native-util/exec.js');
const _keyboard = require('../core/keyboard.js');
const _readline = require('readline');
const { note } = require('../core/note.js');

let synth = _synth();
	
const log = new Block()
	.on('play', (note) => {
		console.log(note);
	});

let arpeggiator = new Block()
    .on('note', (note) => {
        arpeggiator.forward(note);
        arpeggiator.forward(note.mutate({ id: note.data.midi + 4, midi: note.data.midi + 4 }).shift(250));
        arpeggiator.forward(note.mutate({ id: note.data.midi + 7, midi: note.data.midi + 7 }).shift(500));
    })
	.to(log)
	.to(synth);

const input = _keyboard()
	.to(arpeggiator);
	
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
