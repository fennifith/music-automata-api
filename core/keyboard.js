const Block = require('./block.js');

const _mapping = {
    '1': 37, // 1: C#
    'd': 38, // q: D
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
    'a': 54, // a: F#
    'z': 55, // z: G
    's': 56, // s: G#
    'x': 57, // x: A
    'd': 58, // d: A#
    'c': 59, // c: B
    'v': 60, // v: C
    'g': 61, // g: C#
    'b': 62, // b: D
    'h': 63, // h: D#
    'n': 64, // n: E
    'm': 65, // m: F
    'k': 66, // k: F#
    ',': 67, // ,: G
    'l': 68, // l: G#
    '.': 69, // .: A
    ';': 70, // ;: A#
};

module.exports = function() {
    return new Block()
    	.on('note', function(note) {
			// TODO: support duration on keypress/release
			if (_mapping[note.key]) {
				return Object.assign({
					midi: _mapping[note.key]
				}, note);
			} else return note;
		});
};
