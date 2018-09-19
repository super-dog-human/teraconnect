export default class LessonVoicePlayer {
    constructor(avatar) {
        this.avatar = avatar; // for update avatar lip-sync exact.
        this.audioElement = new Audio();
        this.durationSec = 0;
    }

    setAndPlay(url, durationSec, currentSec=0) {
        this.durationSec = durationSec; // this not use for now.
        this.audioElement.src = url;
        this.audioElement.addEventListener('canplay', () => {
            this.play(true, currentSec);
        });
        this.audioElement.addEventListener('ended', () => {
            this.avatar.playLipSync(false);
        });
    }

    play(isStart, startSec=0) {
        if (isStart) {
            this.audioElement.play(startSec);
            this.avatar.playLipSync(true);
        } else {
            this.audioElement.pause();
            this.avatar.playLipSync(false);
        }
    }
}