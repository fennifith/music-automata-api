const Block = require('../core/block.js');
const _soundboard = require('../soundboard-util/soundboard.js');
const _keyboard = require('../core/keyboard.js');
const _readline = require('readline');

const instrument = _soundboard();

const log = new Block()
    .on('note', function(note) {
		note.test = "HELLO THERE, HUMAN";
        return note;
    })
    .on('play', (note) => {
        console.log(note);
    })
    .to(instrument);

const input = _keyboard().to(log);
	
// read keypress from stdin
_readline.emitKeypressEvents(process.stdin);
const _stdin = process.openStdin();
_stdin.setRawMode(true);

_stdin.on('keypress', function(chunk, key) {
    if (key && key.ctrl && key.name == 'c') {
        process.exit();
    } else {
        input.note({ sound: "soundboard/tink.mp3", timestamp: Date.now() })
    }
});

/*input.note({midi: 1, timestamp: Date.now() + 12});
input.note({midi: 1, timestamp: Date.now() + 123});
input.note({midi: 5, timestamp: Date.now() + 452});
input.note({midi: 9, timestamp: Date.now() + 12});*/
