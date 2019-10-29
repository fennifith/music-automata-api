const Block = require('../core/block.js');
const _sound = require('sound-play');

module.exports = function() {
	let block = new Block()
		.on('play', (note) => {
			if (!note || !note.sound)
				throw "Not a soundboard note...";
			
			_sound.play(note.sound);
			console.log(note.sound);
		});
	
	return block;
};
