class AudioPlayer extends AudioWorkletProcessor {
    constructor() {
        super();
        this.isPlaying         = false;
        this.startTimeSec      = 0;
        this.currentSourceTime = 0;
        this.sourceDurationSec = 0;

        this.port.onmessage = (event) => {
            this.isPlaying         = true;
            this.startTimeSec      = currentTime;
            this.currentSourceTime = event.data.currentTime;
            this.sourceDurationSec = event.data.durationSec;
        };
    }

    process(inputs, outputs) {
        if (!this.isPlaying) return true;

        if (this.isPlayingComplete()) {
            this.port.postMessage({ isCompleted: true });
            this.isPlaying = false;
            return true;
        }

        const input  = inputs[0];
        const output = outputs[0];

        if (input.length == 1) {
            [...Array(output.length)].map((_, i) => {
                output[i].set(input[0]); // set monoral source to left and right ch.
            });
        } else {
            [...Array(output.length)].map((_, i) => {
                output[i].set(input[i]);
            });
        }

        return true;
    }

    isPlayingComplete() {
        if (!this.isPlaying) return false;

        if (currentTime - this.startTimeSec > this.sourceDurationSec - this.currentSourceTime) {
            return true;
        }

        return false;
    }
}

registerProcessor('audioPlayProcessor', AudioPlayer);