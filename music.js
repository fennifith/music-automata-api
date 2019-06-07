class Music {
	constructor(data) {
		this.data = data;
	}

	/**
	 * Creates a "Music" class from a json file.
	 *
	 * @param dataUrl       The URL to a json file containing the
	 *                      music "data" - notes, "keys", etc.
	 * @return              A promise that returns a created Music
	 *                      object.
	 */
	static fromURL(dataUrl) {
		return new Promise(function(resolve, reject) {
			const request = new XMLHttpRequest();
			
			request.onload = function() {
				if (request.readyState === 4) {
					if (request.status === 200 || request.status == 0)
						resolve(new Music(JSON.parse(request.responseText)));
					else reject();
				}
			};

			request.onerror = function() {
				reject();
			};
		
			request.open("GET", dataUrl, true);
			request.send();
		});
	}

	/**
	 * Determines if the note index is within the
	 * specified 'key'.
	 * 
	 * @param key           The "key" name, ex: "C Major".
	 * @param noteIndex     The index (int) of the note to check.
	 * @return              True if the note index is in the key.
	 */
	isNoteInKey(key, noteIndex) {
		noteIndex %= this.data.notes.length;
		
		for (let i in this.data.keys[key]) {
			if (this.data.notes[noteIndex].labels.includes(this.data.keys[key][i]))
				return true;
		}

		return false;
	}

	/**
	 * Get a specific note in a key, ex. the fifth note of C
	 * Major. 
	 * 
	 * @param key           The "key" name, ex: "C Major".
	 * @param i             The index of the key to obtain.
	 * @return              A note object - {labels:[], midi:int}.
	 *                      Or null.
	 */
	getNoteOfKey(key, i) {
		i %= this.data.keys[key].length;
		let noteLabel = this.data.keys[key][i].labels[0];
	
		for (let i in this.data.notes) {
			if (this.data.notes[i].labels.includes(noteLabel))
				return this.data.notes[i];
		}

		return null;
	}

	/**
	 * Pretty simple function. Returns the first label of a note.
	 * Useful for mappings or stuff where octaves don't matter or
	 * something idk.
	 *
	 * @param note          The index of the note to get the label
	 *                      of (modulated by the length of the array).
	 * @return              The first label of the note at the specified
	 *                      index.
	 */
	getNoteLabel(note) {
		note %= this.data.notes.length;
		return this.data.notes[note].labels[0];
	}

	/**
	 * Determine a set of possible chord choices from a
	 * specified bar. This creates a "probability" object
	 * of note labels mapped to integers specifying how
	 * "good" a particular note is in relation to the
	 * rest of the bar.
	 * 
	 * @param bar          The bar. It's basically just
	 *                     an integer array of note positions.
	 * @return             An object of note labels mapped
	 *                     to integers.
	 */
	determineChordChoices(bar) {
		let choices = {};
		for (let note in this.data.notes)
			choices[this.getNoteLabel(note)] = 1;

		for (let note in bar) {
			if (!bar[note])
				continue;
		
			let label = this.getNoteLabel(note);

			// augmented
			choices[this.getNoteLabel(note+4)]++;
			choices[this.getNoteLabel(note+8)]++;

			// major
			choices[this.getNoteLabel(note+4)]++;
			choices[this.getNoteLabel(note+7)]++;

			// minor
			choices[this.getNoteLabel(note+3)]++;
			choices[this.getNoteLabel(note+7)]++;

			// diminshed
			choices[this.getNoteLabel(note+3)]++;
			choices[this.getNoteLabel(note+6)]++;
		}

		return choices;
	}

	/**
	 * Determine the most likely 'key' of an Instance.
	 * 
	 * Iterates through all the bars checking which keys
	 * each note is in and finds the key matching the most
	 * notes.
	 * 
	 * @param instance     The instance to find the key of.
	 * @return             The key's string identifier, ex: "C Major".
	 */
	determineKey(instance) {
		let keys = {};
		for (let key in this.data.keys)
			keys[key] = 0;

		for (let i in instance.bars) {
			for (let note in instance.bars[i]) {
				if (instance.bars[i][note]) {
					for (let key in this.data.keys) {
						if (this.isNoteInKey(key, note))
							keys[key]++;
					}
				}
			}
		}

		let arr = Object.keys(this.data.keys);
		let key = arr[0];
		for (let i in arr) {
			if (keys[arr[i]] > keys[key])
				key = arr[i];
		}

		return key;
	}

	/**
	 * Mutate the notes of a particular instance according
	 * to a set of rules.
	 * 
	 * @param instance     The instance to mutate.
	 */
	mutate(instance) {
		if (!instance.key) {
			instance.key = this.determineKey(instance);
			console.log("New key for instance", _instances.indexOf(instance), "-", instance.key);
		}

		let b = function(i, i2) {
			while (i < 0) i += instance.bars.length;
			i %= instance.bars.length;

			while (i2 < 0) i2 += instance.bars[i].length;
			i2 %= instance.bars[i].length;
		
			return instance.bars[i] && instance.bars[i][i2];
		};

		let label = function(note) {
			
		}

		for (let i in instance.bars) {
			let notes = instance.bars[i].slice();
			let count = 12;
			
			for (let note in instance.bars[i]) {
				let choices = this.determineChordChoices(notes);
				
				if (b(i, note)) {
					if (notes[note-1] || notes[note+1])
						notes[note] = false;
					else if (b(i+1, note) || b(i-1, note))
						notes[note] = false;
					else if (Math.floor(Math.random() * choices[this.getNoteLabel(note)] * (this.data.notes.length - count)) == 0)
						notes[note] = false;
					else if (!this.isNoteInKey(instance.key, note))
						notes[note] = false;
					else if (notes[note+1] || notes[note-1])
						notes[note] = false;
					else count++;
				} else if (this.isNoteInKey(instance.key, note)) {
					if (Math.floor(Math.random() * count) == 0 && !(notes[note+1] || notes[note-1])) {
						count++;
						notes[note] = true;
					} else if (b(i+1, note) == (Math.floor(Math.random() * 2) == 0)) {
						continue;
					} else if (b(i-1, note) != b(i, note+1) || b(i-1, note) != b(i, note-1)) {
						//notes[note] = true;
						count++;
					}
				}
			}

			instance.bars[i] = notes;
		}
	}
}
