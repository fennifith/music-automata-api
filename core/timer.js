const startTime = Date.now();

function now() {
	return Date.now() - startTime;
}

function at(time, strict) {
	return after(time - now(), strict);
}

function after(time, strict) {
	return new Promise((resolve, reject) => {
		if (time >= 0)
			setTimeout(resolve, time - now());
		else strict ? reject() : resolve();
	});
}

module.exports = { now, at, after };
