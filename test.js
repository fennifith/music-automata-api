const Block = require('./core/block.js');

const piano = new Block()
    .on('note', (note) => {
        note.test = "HELLO THERE, HUMAN";
    })
    .on('play', (note) => {
        console.log(note);
    });

const keyboard = require('./util/keyboard.js')
    .to(piano);

/*keyboard.note({midi: 1, timestamp: Date.now() + 12});
keyboard.note({midi: 1, timestamp: Date.now() + 123});
keyboard.note({midi: 5, timestamp: Date.now() + 452});
keyboard.note({midi: 9, timestamp: Date.now() + 12});*/
