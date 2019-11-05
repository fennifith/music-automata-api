const Block = require('./block.js');

const _mapping = {
	'1': 37, // 1: C#
	'q': 38, // q: D
	'2': 39, // 2: D#
	'w': 40, // w: E
	'e': 41, // e: F
	'4': 42, // 4: F#
	'r': 43, // r: G
	'5': 44, // 5: G#
	't': 45, // t: A
	'6': 46, // 6: A#
	'y': 47, // y: B
	'u': 48, // u: C
	'8': 49, // 8: C#
	'i': 50, // i: D
	'9': 51, // 9: D#
	'o': 52, // o: E
	'p': 53, // p: F
	'-': 54, // -: F#
	'[': 55, // [: G
	'=': 56, // =: G#
	']': 57, // ]: A
	'a': 58, // a: A#
	'z': 59, // z: B
	'x': 60, // x: C
	'd': 61, // d: C#
	'c': 62, // c: D
	'f': 63, // f: D#
	'v': 64, // v: E
	'b': 65, // b: F
	'h': 66, // h: F#
	'n': 67, // n: G
	'j': 68, // j: G#
	'm': 69, // m: A
	'k': 70, // k: A#
	',': 71, // ,: B
	'.': 72, // .: C
	';': 73, // ;: C#
	'/': 74, // /: D
	"'": 75  // ': D#
};

module.exports = function() {
	return new Block()
		.on('note', function(note) {
			// TODO: support duration on keypress/release
			if (_mapping[note.data.key])
				note.data.midi = _mapping[note.data.key];
			
			return note;
		});
};
