const {Subject, merge, of} = require('rxjs');
const {mergeMap, delay} = require('rxjs/operators');
const {Note, note} = require('./note.js');
const _timer = require('./timer.js');

/**
 * Block class; represents any arbitrary source/receiver
 * of notes.
 */
module.exports = class Block {
	constructor() {
		this._notes = new Subject();
		this._sendTo = [];
		this._listeners = {
			note: [],
			play: [],
			stop: [] // TODO: stop event
		};

		// Immediately forward derivative notes to consecutive blocks
		this._notes.subscribe((note) => {
			let noteDeriv = note;
			this._listeners.note.forEach(noteListener => {
				noteDeriv = noteListener(noteDeriv);
			});

			if (noteDeriv)
				this.forward(noteDeriv);
		});

		// Send notes to own 'play' event
		this._notes.pipe(
			mergeMap(noteObj => {
				let offset = noteObj.timestamp - _timer.now();
				// If offset is 0, run right away
				offset = offset <= 0 ? 0 : offset;
				return of(noteObj).pipe(delay(offset));
			})
		).subscribe((note) => {
			this._listeners.play.forEach(playListener => playListener(note));
			this.map[note.id] = true; // TODO: timeout note value
		});

		this.map = {};
	}

	/**
	 * @prop {Note|Object} val
	 */
	note(val) {
		if (!val) return;
		val = note(val);

		let array = Array.from(val);
		if (array.length)
			array.forEach(v => this._notes.next(v));
		else this._notes.next(val); // TODO: check duplicate notes/updates in `this.map`
		
		return this;
	}

	/**
	 * Create a listener that will be called  when an event
	 * is triggered.
	 *
	 * Events:
	 * - note: triggered when a note is added to the queue
	 * - play: when a note is played
	 * - playEnd: (optional) when the duration of a note is over
	 */
	on(string, cb) {
		if (!Object.keys(this._listeners).includes(string)) {
			throw "This is not a valid listener type";
		}

		this._listeners[string].push(cb);
		return this;
	}

	/**
	 * Sets a block to send mutated notes to when they are added.
	 *
	 * @prop {Block} to
	 * @see {@link http://reactivex.io/documentation/subject.html|Rx Subject Docs}
	 */
	to(...blocks) {
		blocks.forEach((block) => this._sendTo.push(block));
		return this;
	}

	/**
	 * Forwards a note to all consecutive blocks.
	 *
	 * @prop {Note|Object} note
	 */
	forward(val) {
		this._sendTo.forEach((block) => block.note(note(val)));
	}
}
