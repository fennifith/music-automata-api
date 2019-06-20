const Block = require('../core/block.js');
const readline = require('readline');
readline.emitKeypressEvents(process.stdin);

module.exports = new Block()
    .on('note', note => note);

const _stdin = process.openStdin();
_stdin.setRawMode(true);

_stdin.on('keypress', function(chunk, key) {
    if (key && key.ctrl && key.name == 'c') {
        process.exit();
    } else module.exports.note({ char: key.name, timestamp: 0 });
});
