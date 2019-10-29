const Block = require('../core/block.js');
const _soundboard = require('../soundboard-util/soundboard.js');

const instrument = _soundboard();

const log = new Block()
    .on('play', (note) => {
        console.log(note);
    })
    .to(instrument);

const beat = new Block()
	.on('play', (note) => {
		beat.note(Object.assign(note, {
			timestamp: Date.now() + 1000
		}));
	})
	.to(log);

const rand = new Block()
	.on('play', (note) => {
		rand.note(Object.assign(note, {
			timestamp: Date.now() + 200 + Math.round(Math.random() * 10) * 50
		}))
	})
	.to(log);

beat.note({ sound: 'soundboard/boof.mp3', timestamp: Date.now() });
beat.note({ sound: 'soundboard/smack.mp3', timestamp: Date.now() + 500 });
rand.note({ sound: 'soundboard/tink.mp3', timestamp: Date.now() + 750 });
