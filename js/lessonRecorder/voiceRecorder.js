export default class VoiceRecorder {
    constructor(lessonID, callback, lipSyncCallback) {
        this.lessonID = lessonID;
        this.callback = callback;
        this.lipSyncCallback = lipSyncCallback;
        this.isReady  = false;
        this.recorder;
        this.context;

        this._initRecorder();
    }

    start(isRecording) {
        if (this.isReady) {
            this.recorder.port.postMessage({ isRecording: isRecording });
        } else {
            console.log('is not ready in voice recorder');
            setTimeout(() => { this.start(isRecording); }, 1000);
        }
    }

    async _initRecorder() {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                autoGainControl:  true,
                noiseSuppression: true,
            },
            video: false
        });
        this.context = new AudioContext();
        await this.context.audioWorklet.addModule('/voiceRecorderProcessor.js').catch((err) => {
            console.error(err);
        });
        const micInput = this.context.createMediaStreamSource(stream);
        this.recorder = new AudioWorkletNode(this.context, 'recorder');
        micInput.connect(this.recorder);
        this.recorder.connect(this.context.destination);
        this.isReady = true;

        this.recorder.port.onmessage = (event) => {
            if (event.data.shouldUpload) {
                this._uploadVoice(event.data);
            } else {
                this.lipSyncCallback(event.data.isSpeaking);
            }
        }
    }

    _uploadVoice(result) {
        const callback = this.callback;
        const voice = {
            timeSec:     result.speechedAt,
            durationSec: result.durationSec,
        };
        callback(voice);

        const uploader = new Worker('voiceUploader.js');
        uploader.postMessage({
            lessonID:          this.lessonID,
            time:              result.speechedAt,
            buffers:           result.buffers,
            bufferLength:      result.bufferLength,
            currentSampleRate: this.context.sampleRate,
        });

        uploader.onmessage = function(event) {
            voice.fileID = event.data.fileID;
            callback(voice);
            uploader.terminate();
        };
    }
}