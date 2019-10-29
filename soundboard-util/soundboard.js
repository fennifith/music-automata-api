const Block = require('../core/block.js');
const { exec } = require('child_process');

module.exports = function() {
	let block = new Block()
		.on('play', (note) => {
			if (!note || !note.sound)
				throw "Not a soundboard note...";
			
			exec("play " + note.sound);
		});
	
	return block;
};
