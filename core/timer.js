const startTime = Date.now();

function now() {
	return Date.now() - startTime;
}

module.exports = { now };
