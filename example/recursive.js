const Block = require('../core/block.js');
const _exec = require('../native-util/exec.js');
const { note } = require('../core/note.js');

const instrument = _exec();

const log = new Block()
    .on('play', (note) => {
        console.log(note);
    })
    .to(instrument);

const beat = new Block()
	.on('play', (note) => {
		beat.note(note.mutate().shift(1000));
	})
	.to(log);

const rand = new Block()
	.on('play', (note) => {
		rand.note(note.mutate().shift(Math.round(Math.random() * 5) * 250))
	})
	.to(log);

let sound = note(); // get initial timestamp
beat.note(sound.mutate({ sound: 'soundboard/boof.mp3' }));
beat.note(sound.mutate({ sound: 'soundboard/smack.mp3' }).shift(500));
rand.note(sound.mutate({ sound: 'soundboard/tink.mp3' }).shift(750));
