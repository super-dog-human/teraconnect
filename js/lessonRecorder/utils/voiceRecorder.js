import 'audioworklet-polyfill'
import * as Const from '../../shared/utils/constants'

export default class VoiceRecorder {
    constructor(lessonID, callback) {
        this._lessonID = lessonID
        this._callback = callback
        this._isReady = false
        this._recorder
        this._stream
        this._context
        this._micInput

        this._initRecorder()
    }

    start(isRecording) {
        if (this._isReady) {
            this._recorder.port.postMessage({ isRecording: isRecording })
        } else {
            setTimeout(() => {
                this.start(isRecording)
            }, 1000)
        }
    }

    turnOff() {
        this._stream.getAudioTracks().forEach(track => {
            track.stop()
        })

        this._micInput.disconnect()
        this._micInput = null
    }

    async _initRecorder() {
        this._stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                autoGainControl: true,
                noiseSuppression: true
            },
            video: false
        })
        this._context =
            typeof webkitAudioContext != 'undefined'
                ? new webkitAudioContext() // for safari
                : new AudioContext()
        await this._context.audioWorklet.addModule('/voiceRecorderProcessor.js')
        this._micInput = this._context.createMediaStreamSource(this._stream)
        this._recorder = new AudioWorkletNode(this._context, 'recorder')
        this._micInput.connect(this._recorder)
        this._recorder.connect(this._context.destination)
        this._isReady = true

        this._recorder.port.onmessage = event => {
            this._uploadVoice(event.data)
        }
    }

    _uploadVoice(result) {
        const callback = this._callback
        const voice = {
            timeSec: result.speechedAt,
            durationSec: result.durationSec
        }
        callback(voice)

        const uploader = new Worker('voiceUploader.js')
        uploader.postMessage({
            url: Const.RAW_VOICE_API_URL,
            lessonID: this._lessonID,
            time: result.speechedAt,
            buffers: result.buffers,
            bufferLength: result.bufferLength,
            currentSampleRate: this._context.sampleRate
        })

        uploader.onmessage = function(event) {
            voice.fileID = event.data.fileID
            callback(voice)
            uploader.terminate()
        }
    }
}
