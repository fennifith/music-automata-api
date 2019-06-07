const Music = require('./api/index.js');
const audio = require('some-audio-plugin');
const Rx = require('rxjs');

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
