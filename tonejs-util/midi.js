const Block = require('../core/block.js');

const Tone = require('tone');
const _synth = new Tone.Synth().toMaster();

function playTone(tone) {
    if (tone > 61 || tone < 1) {
        console.log('undefined tone', tone);
        return;
    }

    _synth.triggerAttackRelease(midiToHertz(tone), 0.4);
}

function midiToHertz(midi) {
    return Math.pow(2, (midi - 69) / 12) * 440;
}

const _midiBlock = new Block()
    .on('play', note => {
        if (!note || !note.midi) {
            throw "Not a midi note...";
        }

        playTone(note.midi);
    });

module.exports = function() {
    return _midiBlock;
};
