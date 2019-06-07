class Time {
    constructor() {
        this.running = false;
        this.startMillis = millis();
        this.playTime = 0;
    }

    get now() {
        if (this.running)
            return millis() - this.startMillis;
        else return this.playTime;
    }

    play() {
        this.startMillis = millis() - this.playTime;
        this.running = true;
    }

    pause() {
        this.playTime = this.now;
        this.running = false;
    }
}

module.exports = Time;