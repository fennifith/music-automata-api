const {ReplaySubject, merge, of, operators: {mergeMap, delay}} = require('rxjs');

// keyboard -> arpeggio -> synth
//          -> piano
//

/**
 * @typedef {{midi: number, offset: number}} noteType
 * @prop {} val
 */
class Block {
    constructor() {
        this._notes = new ReplaySubject();
        this._playFrom = [];
        this._sendTo = [];
        this._listeners = {
            note: [],
            play: []
        };
    }

      /**
       * @prop {noteType} val
       */
    note(val) {
        const noteValue = this._listeners.note.reduce((prev, listenerCB) => {
            return listenerCB(prev);
        }, val);
        this._notes.next(noteValue);
    }

    on(string, cb) {
        if (!Object.keys(this._listeners).includes(string)) {
            throw "This is not a valid listener type";
        }
        this._listeners[string].push(cb);
        return this;
    }

    /**
     * @prop {Block} to
     * @see {@link http://reactivex.io/documentation/subject.html|Rx Subject Docs}
     */
    to(block) {
        block._playFrom.push(this);
        this._sendTo.push(block);
        return this;
    }

    play() {
        this._listeners.play.forEach(playListener => playListener());
        // If there are `to` fields, just send to those, don't play themselves
        if (this._sendTo.length) {
            this._sendTo.forEach(blockToSend => {
                blockToSend.play();
            });
        } else {
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
                    console.log(note);
                });
        }
    }
}

const piano = new Block()
    .on('note', (note) => {
      note.test = "HELLO THERE, HUMAN";
    })
    .on('play', (note) => {
        console.log(note);
    });

const keyboard = new Block().to(piano);

keyboard.note({midi: 1, offset: 12});
keyboard.note({midi: 1, offset: 123});
keyboard.note({midi: 5, offset: 123452});
keyboard.note({midi: 89, offset: 12});

keyboard.play();
