const _objects = require('./objects.js');

const _env = {
    speed: 1,
    time: require('./time.js'),
    blocks: {}
};

function toArray(category) {
    let arr = [];
    for (let i in category) {
        arr.push(category[i]);
    }

    return arr;
}

function add(category, block) {
    for (let i = 1, id = block.id; block.id in category; i++) {
        block.id = id + "-" + i;
    }

    category[block.id] = block;
}

module.exports.setSpeed = function(speed) {
    _env.speed = speed;
};

module.exports.addBlock = function(block) {
    add(_env.blocks, block);
};

module.exports.removeBlock = function(id) {
    for (let i in _env.blocks) {
        if (id in _env.blocks[i].attachments)
            delete _env.blocks[i].attachments[id];
    }

    delete _env.blocks[id];
};

module.exports.getBlock = function(id) {
    return _env.blocks[id];
};

module.exports.getBlocks = function() {
    return toArray(_env.blocks);
};

module.exports.start = function(options) {
    Object.assign(_objects, options.objects);
};

module.exports.Instrument = require('./classes/instrument.js');
module.exports.Provider = require('./classes/provider.js');
module.exports.Mutator = require('./classes/mutator.js');
module.exports.objects = _objects;
