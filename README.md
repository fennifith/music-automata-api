The goal of this project is to create an API that can be used to schedule and
organize automated music generation using [ReactiveX](http://reactivex.io/)
and the observable pattern.

## Inspiration

This was mainly inspired by the work of [Lars Dietrich](https://www.youtube.com/channel/UCznARY34-PH2Yv4jFxj3SUA).
I can only speculate as to how it was put together, but (with the exception of
[Titan](https://www.youtube.com/watch?v=t3zha5WAY3w)) a large amount of it does
appear to be scripted, and most of the work seems to have been put into the
visualization rather than automating the music itself. Which is perfectly fine.

[65 Days of Static](https://decompositiontheory.info/) is also doing work that
is perhaps closer to what this project hopes to accomplish.
[This video](https://www.youtube.com/watch?v=oW_lK9yWsCA) shows a lot of what
they have achieved, and [many](https://twitter.com/65dos/status/1115956359470690305)
[of](https://twitter.com/65dos/status/1115258013059821570)
[their](https://twitter.com/65dos/status/1115583157913493504)
[tweets](https://twitter.com/65dos/status/1114917016438226945)
show this in practical use.

Some of the actual music generation strategies are based on
[this article](https://web.archive.org/web/20160312060120/http://www.ibm.com/developerworks/library/j-camusic/index.html)
by Paul D. Reiners about the relationship between cellular automata and music.
Huge thanks to the [Wayback Machine](https://archive.org/) for keeping copies of
these things so that they aren't completely lost to the void when
[IBM redesigns their developer site and removes a bunch of useful information](https://twitter.com/fennifith/status/1118354510643191808).

## Design

To gain some insight into how this can be used, think of music generation as a
series of mutations upon an existing set of data. For example, a random integer
value could be transformed into a chord, and made to conform to a specific beat
pattern before then being passed to an instrument to play. While it may be
common to do so, these are not mutations that need to happen at the exact time
that the note is played, and should happen independently.

In this API, something that can accept or output a note is referred to as a
"Block". Blocks are notified when a note is sent to them, and have the ability
to modify the note, remove it, or create new notes before passing them along.
Together, the blocks build a sort of tree structure along which notes are
passed. For example, consider a set of blocks that are organized like below:

```
       [keyboard]
        /      \
    [piano]  [arpeggiator]
                 \
                [synth]
```

Here, all notes are created from keyboard input. They are then passed directly
to the blocks "piano" and "arpeggiator". The "piano" block simply plays the
notes it receives. The "arpeggiator" mutates them - into an arpeggio - and
passes the result of that mutation to the "synth" block which, again, plays
them.

Using this API, here is an example of what such a structure might look like:

```js
let synth = new Block()
    .on('noteStart', (note) => {
        audioApi.playMidiNote(note.midi, synthInstrument);
    });

let arpeggiator = new Block()
    .on('note', (note) => {
        arpeggiator.forward(note);
        arpeggiator.forward(note.mutate({ midi: note.midi + 4 }));
        arpeggiator.forward(note.mutate({ midi: note.midi + 7 }));
    })
    .to(synth);

let piano = new Block()
    .on('noteStart', (note) => {
        audioApi.playMidiNote(note.midi, pianoInstrument);
    });

let keyboard = new Block()
    .to(piano)
    .to(arpeggiator);
```
