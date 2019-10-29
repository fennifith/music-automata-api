const _timer = require('./timer.js');

/**
 * Note, contains data + timestamp info.
 */
class Note {

	constructor(data) {
		this.data = data;
		this.timestamp = _timer.now();
		this.duration = 0;
	}

	clone() {
		return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
	}

	mutate(obj) {
		let copy = this.clone();
		copy.data = Object.assign({}, this.data);
		Object.assign(copy.data, obj);
		return copy;
	}

	shift(time) {
		this.timestamp += time;
		return this;
	}

	get timestampEnd() {
		return this.timestamp + this.duration;
	}

	flatten() {
		return [ this ];
	}

}

class NoteSequence extends Note {

	constructor(...notes) {
		super(notes || []);
	}

	add(note) {
		this.data.push(note);
	}

	get duration() {
		let duration = 0;
		this.data.forEach((note) => {
			if (note.timestampEnd > duration)
				duration = note.timestampEnd;
		});

		return duration;
	}

	flatten() {
		return notes.map(note => note.clone().shift(this.timestamp));
	}

}

function note(obj) {
	if (obj instanceof Note)
		return obj;
	else return new Note(obj);
}

module.exports = { Note, NoteSequence, note };
