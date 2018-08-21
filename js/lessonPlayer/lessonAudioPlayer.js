export default class LessonAudioPlayer {
    constructor() {
        this.context = new AudioContext();
        this.audioElement;
        this.durationSec = 0;

        return this.context.audioWorklet.addModule('audioPlayProcessor.js')
            .then(() => {
                this.audioProcessor = new AudioWorkletNode(this.context, 'audioPlayProcessor');
                this.audioProcessor.connect(this.context.destination);
                this.audioProcessor.port.onmessage = () => {
                    this.audioElement.pause();
                    this.audioElement = null;
                };

                return this;
            });
    }

    setAudio(url, durationSec, currentSec=0) {
        this.durationSec = durationSec;

        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement = null;
        }

        this.audioElement = new Audio(url);
        this.audioElement.addEventListener('loadstart', () => {
            const source = this.context.createMediaElementSource(this.audioElement);
            source.connect(this.audioProcessor);
            this.play(true, currentSec);
        });
    }

    play(isStart, startSec=0) {
        if (!this.audioElement) return;

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