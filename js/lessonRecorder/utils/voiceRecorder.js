import 'audioworklet-polyfill'
import * as Const from '../../common/constants'

export default class VoiceRecorder {
    constructor(lessonID, callback) {
        this._lessonID = lessonID
        this._callback = callback
        this._isReady = false
        this._recorder
        this._stream
        this._context

        this._initRecorder()
    }

    start(isRecording) {
        if (this._isReady) {
            this._recorder.port.postMessage({ isRecording: isRecording })
        } else {
            console.log('is not ready in voice recorder')
            setTimeout(() => {
                this.start(isRecording)
            }, 1000)
        }
    }

    turnOff() {
        this._stream.getAudioTracks().forEach(track => {
            track.stop()
        })
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
        this._context = new AudioContext()
        await this._context.audioWorklet
            .addModule('/voiceRecorderProcessor.js')
            .catch(err => {
                console.error(err)
            })
        const micInput = this._context.createMediaStreamSource(this._stream)
        this._recorder = new AudioWorkletNode(this._context, 'recorder')
        micInput.connect(this._recorder)
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
