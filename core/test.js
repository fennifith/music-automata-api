const Block = require('./block.js');

//         1
//       2   3
//      4 5   6

const piano = new Block()
    .on('note', (note) => {
        console.log(note);
        note.test = "HELLO THERE, HUMAN";
    })
    .on('play', (note) => {
        console.log(note);
    });

const keyboard = new Block().to(piano);

keyboard.note({midi: 1, timestamp: Date.now() + 12});
keyboard.note({midi: 1, timestamp: Date.now() + 123});
keyboard.note({midi: 5, timestamp: Date.now() + 3452});
keyboard.note({midi: 89, timestamp: Date.now() + 12});
