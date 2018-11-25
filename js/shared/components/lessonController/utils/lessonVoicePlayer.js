export default class LessonVoicePlayer {
    constructor() {
        this._audioElement = new Audio()
        this._startAtSec = 0
        this._stopAtSec = 0
        this._stopTimeoutID
    }

    setAndPlay(url, startAtSec = 0, stopAtSec) {
        this._audioElement.src = url
        this._startAtSec = startAtSec
        this._stopAtSec = stopAtSec

        this._setStoppingTimeout()
        this.play()
    }

    set(url, startAtSec = 0, stopAtSec) {
        this._audioElement.src = url
        this._startAtSec = startAtSec
        this._stopAtSec = stopAtSec

        this._setStoppingTimeout()
    }

    play() {
        if (!this._audioElement.src) return

        if (this._startAtSec > 0) {
            // avoid set 0 to currentTime, it cause error.
            this._audioElement.currentTime = this._startAtSec
        }
        this._audioElement.play()
    }

    stop() {
        this._audioElement.pause()
        clearTimeout(this._stopTimeoutID)
        this._stopTimeoutID = null
    }

    reset() {
        this._audioElement.pause()
        this._audioElement = new Audio()
    }

    _setStoppingTimeout() {
        const elapsedPlayingSec =
            this._stopAtSec - this._audioElement.currentTime

        if (elapsedPlayingSec < 0) return

        clearTimeout(this._stopTimeoutID)
        this._stopTimeoutID = setTimeout(() => {
            this.reset()
        }, elapsedPlayingSec * 1000)
    }
}
