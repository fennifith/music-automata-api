const Music = require('./api/index.js');
const audio = require('some-audio-plugin');

/*
let note = {
    midi: 12,
    otherAttribute: 4,
    something: "what"
};

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array

https://developer.mozilla.org/en-US/docs/Web/API/NodeList

---
note.midi += 4;
arpeggio.push(note);
---
arpeggio.push(Object.assign(note, { midi: note.midi + 4 }));
---
*/

let piano = Music.block()
    .on('play', (note) => {
        audio.play(note.midi, "piano");
    });

class Music {
  _notes = ReplaySubject();

  /**
   * @prop {{midi: number, offset: number}} val
   */
  set note(val) {
    // FIXME: API is wrong
    this._notes.add(val)
  }

  /**
   * @prop {Subject} to
   * @see {@link http://reactivex.io/documentation/subject.html|Rx Subject Docs}
   */
  to(subj) {
    // FIXME: I don't handle any of the notes modifications
    this._notes = this._notes.pipe(map(subj))
  }

  play() {
    this._notes.subscribe(() => {})
  }

  remove() {
    this._notes.unsubscribe(() => {})
  }
}


ReplaySubject.add({
    midi: 12,
    offset: 914782164 // Can be negative
})

let arpeggio = Music.block()
    .on('note', (note) => {
        arpeggio.push(note);
        arpeggio.push(Object.assign(note, { midi: note.midi + 4 }));
        arpeggio.push(Object.assign(note, { midi: note.midi + 7 }));
    })
    .on('play', (note) => {

    })
    .to(piano);

let keyboard = Music.block()
    .to(arpeggio)
    .to(aaaaaa);

arpeggio.note({
    midi: 12,
    offset: 914782164 // Can be negative
});
