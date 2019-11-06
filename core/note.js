const _timer = require('./timer.js');

/**
 * Note, contains data + timestamp info.
 */
class Note {

	constructor(data) {
		this.data = data;

		this._timestamp = _timer.now();
		this._duration = 0;
		this._listeners = {
			start: [],
			end: []
		};
	}

	get id() {
		if (this.data.id)
			return this.data.id;
		else if (typeof this.data === "object")
			return JSON.stringify(this.data);
		else return "" + this.data;
	}

	get isPlaying() {
		return this.timestamp < _timer.now() &&
			(!this.isFinite || this.timestampEnd > _timer.now());
	}

	get isFinite() {
		return this.duration > 0;
	}

	clone() {
		return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
	}

	mutate(obj) {
		let copy = this.clone();
		copy.data = Object.assign({}, this.data);
		copy._listeners = { start: [], end: [] };
		Object.assign(copy.data, obj);
		return copy;
	}

	get timestamp() {
		return this._timestamp;
	}

	get timestampEnd() {
		return this._timestamp + this._duration;
	}

	get duration() {
		return this._duration;
	}

	start(time) {
		time = time ? time : _timer.now();
		this._timestamp = time;

		_timer.at(this.timestamp).then(() => {
			this._listeners.start.forEach(f => f(this));
		});

		return this;
	}

	for(duration) {
		this._duration = duration;

		_timer.at(this.timestampEnd).then(() => {
			this._listeners.end.forEach(f => f(this));
		});

		return this;
	}

	end(time) {
		time = time ? time : _timer.now();
		this._duration = time - this.timestamp;

		_timer.at(this.timestampEnd).then(() => {
			this._listeners.end.forEach(f => f(this));
		});

		return this;
	}

	shift(time) {
		let copy = this.mutate();
		copy._timestamp += time;
		return copy;
	}

	flatten() {
		return [ this ];
	}

	on(event, cb) {
		this._listeners[event].push(cb);
		
		//if (event == 'start' && this.timestamp < _timer.now())
		//	cb();
		
		//if (event == 'end' && this.timestampEnd < _timer.now())
		//	cb();
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
		return notes.map(note => note.shift(this.timestamp));
	}

}

function note(obj) {
	if (obj instanceof Note)
		return obj;
	else return new Note(obj);
}

module.exports = { Note, NoteSequence, note };
