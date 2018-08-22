export default class LessonVoicePlayer {
    constructor() {
        this.context = new AudioContext();
        this.audioElement = new Audio();
        this.durationSec = 0;

        return this.context.audioWorklet.addModule('audioPlayProcessor.js')
            .then(() => {
                this.audioProcessor = new AudioWorkletNode(this.context, 'audioPlayProcessor');
                this.audioProcessor.connect(this.context.destination);

                const source = this.context.createMediaElementSource(this.audioElement);
                source.connect(this.audioProcessor);
/*
                this.audioProcessor.port.onmessage = () => {
                    console.log('voice stoppped by duration order.');
                };
*/
                return this;
            });
    }

    setAndPlay(url, durationSec, currentSec=0) {
        this.durationSec = durationSec;
        this.audioElement.src = url;
        this.audioElement.addEventListener('loadstart', () => {
            this.play(true, currentSec);
        });
    }

    play(isStart, startSec=0) {
        if (isStart) {
            this.audioProcessor.port.postMessage({
                currentTime: this.audioElement.currentTime,
                durationSec: this.durationSec,
            });
            this.audioElement.play(startSec);
        } else {
            this.audioElement.pause();
        }
    }
}