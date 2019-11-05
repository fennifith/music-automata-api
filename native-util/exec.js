const Block = require('../core/block.js');
const { exec } = require('child_process');

module.exports = function({ command = "play", template = (note) => `${command} ${note.data.sound}` } = {}) {
	let block = new Block()
		.on('note', (note) => {
			if (!note.data || !note.data.sound)
				throw "Not a soundboard note...";
			
			note.on('start', () => {
				exec(template(note));
			});
		});
	
	return block;
};
