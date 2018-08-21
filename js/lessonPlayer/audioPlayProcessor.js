class AudioPlayer extends AudioWorkletProcessor {
    constructor() {
        super();

        this.port.onmessage = event => {
            this.durationSec = event.data;
        };
    }

    process(inputs, outputs) {
        if (this.durationSec > currentTime) {
            return true;
        }

        const input  = inputs[0];
        const output = outputs[0];

        [...Array(output.length)].map((_, i) => {
            output[i].set(input[i])
        });

        return true;
    }
}

registerProcessor('audioPlayProcessor', AudioPlayer);