export default class LessonVoicePlayer {
    constructor() {
        this._audioElement = new Audio()
        this._canPlay = false
        this._durationSec = 0 // it's will use seeking in lesson.
    }

    setAndPlay(url, orderDurationSec, currentSec = 0) {
        this._durationSec = orderDurationSec // this not use for now.
        this._audioElement.src = url
        this._audioElement.addEventListener('canplay', () => {
            this._canPlay = true
            this.play(true, currentSec)
        })
        this._audioElement.addEventListener('ended', () => {
            this._canPlay = false
        })
    }

    play(startSec = 0) {
        if (this._canPlay) {
            this._audioElement.play(startSec)
        }
    }

    stop() {
        this._audioElement.pause()
    }

    reset() {
        this._canPlay = false
    }
}
