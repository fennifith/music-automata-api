const Block = require('./core/block.js');

const instrument = require('./util/midi.js')();

const log = new Block()
    .on('note', (note) => {
        note.test = "HELLO THERE, HUMAN";
        return note;
    })
    .on('play', (note) => {
        console.log(note);
    })
    .to(instrument);

const keyboard = require('./util/keyboard.js')()
    .to(log);

/*keyboard.note({midi: 1, timestamp: Date.now() + 12});
keyboard.note({midi: 1, timestamp: Date.now() + 123});
keyboard.note({midi: 5, timestamp: Date.now() + 452});
keyboard.note({midi: 9, timestamp: Date.now() + 12});*/
