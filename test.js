const expect = require('chai').expect;
const Block = require('./api/block.js');

//         1
//       2   3
//      4 5   6

const piano = new Block()
    .on('note', (note) => {
      note.test = "HELLO THERE, HUMAN";
    })
    .on('play', (note) => {
        console.log(note);
    });

const keyboard = new Block().to(piano);

keyboard.note({midi: 1, offset: 12});
keyboard.note({midi: 1, offset: 123});
keyboard.note({midi: 5, offset: 3452});
keyboard.note({midi: 89, offset: 12});
