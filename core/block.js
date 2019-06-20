const {Subject, merge, of} = require('rxjs');
const {mergeMap, delay} = require('rxjs/operators');

/**
 * @typedef {{midi: number, timestamp: number}} noteType
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

        this._notes.subscribe((note) => {
            console.log('hi');
            console.log(this._listeners.note);
            this._listeners.note.forEach((noteListener) => noteListener(note));
        });

        this._notes.pipe(
            mergeMap(noteObj => {
                let offset = noteObj.timestamp - Date.now(); // TODO: replace with own timing
                // If offset is 0, run right away
                offset = noteObj.offset <= 0 ? 0 : noteObj.offset;
                return of(noteObj).pipe(delay(offset));
            })
        ).subscribe((note) => {
            console.log("hi");
            this._listeners.play.forEach(playListener => playListener(note));
        });

        // repeatUntil, pause/stop, BehaviorSubject
        // This will merge the RxJS subjects from notes and playFrom `_notes` subjects
        /*merge(this._notes, ...this._playFrom.map(block => block._notes))
            .pipe(
                mergeMap(noteObj => {
                    // If offset is 0, run right away
                    const offset = noteObj.offset <= 0 ? 0 : noteObj.offset;
                    return of(noteObj).pipe(delay(offset));
                })
            )
            .subscribe((note) => {
                this._listeners.play.forEach(playListener => playListener(note));
            });*/
    }

    /**
     * @prop {noteType} val
     */
    note(val) {
        /*const noteValue = this._listeners.note.reduce((prev, listenerCB) => {
            return listenerCB(prev);
        }, val);*/
        this._notes.next(val);
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
        console.log(this._listeners[string]);
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
