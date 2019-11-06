const _keyboard = require('../core/keyboard.js');
const { note } = require('../core/note.js');
const _io = require('iohook');

module.exports = function() {
	let keyboard = _keyboard();

	let map = {};

	_io.on('keydown', (e) => {
		let key = String.fromCharCode(e.rawcode);
		if (!map[key]) {
			map[key] = note({ id: key, key }).start();
			keyboard.note(map[key]);
		}
	});

	_io.on('keyup', (e) => {
		let key = String.fromCharCode(e.rawcode);
		map[key].end();
		delete map[key];
	});

	return keyboard;
};

_io.start();
