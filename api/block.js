const {Subject, merge, of} = require('rxjs');
const {mergeMap, delay} = require('rxjs/operators');

/**
 * @typedef {{midi: number, offset: number}} noteType
 * @prop {} val
 */
module.exports = class Block {
    constructor() {
        this._notes = new Subject();
        this._playFrom = [];
        this._sendTo = [];
        this._listeners = {
            note: [],
            play: []
        };

        // repeatUntil, pause/stop, BehaviorSubject
        // This will merge the RxJS subjects from notes and playFrom `_notes` subjects
        merge(this._notes, ...this._playFrom.map(block => block._notes))
            .pipe(
                mergeMap(noteObj => {
                    // If offset is 0, run right away
                    const offset = noteObj.offset <= 0 ? 0 : noteObj.offset;
                    return of(noteObj).pipe(delay(offset));
                })
            )
            .subscribe((note) => {
                this._listeners.play.forEach(playListener => playListener(note));
            });
    }

    /**
     * @prop {noteType} val
     */
    note(val) {
        const noteValue = this._listeners.note.reduce((prev, listenerCB) => {
            return listenerCB(prev);
        }, val);
        this._notes.next(noteValue);


        // If there are `to` fields, just send to those, don't play themselves
        this._sendTo.forEach(blockToSend => {
            blockToSend.play();
        });
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
        block._playFrom.push(this);
        this._sendTo.push(block);
        return this;
    }
}
