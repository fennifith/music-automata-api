const Block = require('../core/block.js');
const { exec } = require('child_process');

module.exports = function() {
	let block = new Block()
		.on('play', (note) => {
			if (!note.data || !note.data.sound)
				throw "Not a soundboard note...";
			
			exec("play " + note.data.sound);
		});
	
	return block;
};
