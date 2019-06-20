const {Subject, merge, of} = require('rxjs');
const {mergeMap, delay} = require('rxjs/operators');

/**
 * @typedef {{midi: number, timestamp: number}} noteType
 * @prop {} val
 */
module.exports = class Block {
    constructor() {
        this._notes = new Subject();
        this._sendTo = [];
        this._listeners = {
            note: [],
            play: []
        };

        // Immediately forward derivative notes to consecutive blocks
        this._notes.subscribe((note) => {
            this._listeners.note.forEach(noteListener => noteListener(note));
        });

        // Send notes to own 'play' event
        this._notes.pipe(
            mergeMap(noteObj => {
                let offset = noteObj.timestamp - Date.now(); // TODO: replace with own timing
                // If offset is 0, run right away
                offset = offset <= 0 ? 0 : offset;
                return of(noteObj).pipe(delay(offset));
            })
        ).subscribe((note) => {
            this._listeners.play.forEach(playListener => playListener(note));
        });
    }

    /**
     * @prop {noteType} val
     */
    note(val) {
        if (val) this._notes.next(val);
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
    to(block) {
        this._sendTo.push(block);
        return this;
    }

    /**
     * Forwards a note to all consecutive blocks.
     *
     * @prop {noteType} note
     */
    forward(note) {
        this._sendTo.forEach((block) => block.note(note));
    }
}
