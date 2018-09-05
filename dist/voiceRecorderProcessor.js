class Recorder extends AudioWorkletProcessor {
    constructor() {
        super();

        this.isRecording             = false;
        this.isSpeaking              = false;
        this.silenceSecondThreshold  = 1.0;
        this.durationSecondThreshold = 2.0;
        this.silenceVolumeThreshold  = 0.05;
        this.quietHistoryDurationSec = 0.2;
        this.quietBuffers            = [];
        this.buffers                 = [];
        this.bufferLength            = 0;
        this.recordingStartSecond    = 0;
        this.silenceBeginSecond      = 0;
        this.voiceBeginSecond        = 0;

        this.port.onmessage = (event) => {
            this.isRecording = event.data.isRecording;
            if (this.isRecording) {
                this.recordingStartSecond = currentTime;
            } else if (this.buffers.length > 0) {
                this._saveRecord();
            }
        };
    }

    process(allInputs) {
        if (!this.isRecording) return true;

        const inputs = allInputs[0][0]; // recording monoral only

        if (this._isSilence(inputs)) {
            if (this._shouldStopLipSync()) {
                this._lipSync(false);
                this.isSpeaking = false;
            }

            if (this._shouldSaveRecording()) {
                this._saveRecord();
                return true;
            }

            if (this.silenceBeginSecond == 0) {
                this.silenceBeginSecond = this._elapsedSecondFromStart();
            }
            if (this.buffers.length > 0) {
                this._recordInput(inputs);
            } else {
                this._heapQuietInput(inputs);
            }
        } else {
            this.silenceBeginSecond = 0;
            this._recordQuietInput();
            this._recordInput(inputs);
            if (!this.isSpeaking) {
                this._lipSync(true);
                this.isSpeaking = true;
            }
        }

        return true;
    }

    _elapsedSecondFromStart() {
        return currentTime - this.recordingStartSecond;
    }

    _durationSecond() {
        return this._elapsedSecondFromStart() - this.voiceBeginSecond;
    }

    _shouldStopLipSync() {
        if (!this.isSpeaking) return false;
        return (this._elapsedSecondFromStart() - this.silenceBeginSecond) > this.silenceSecondThreshold;
    }

    _shouldSaveRecording() {
        const hasSilenceTime         = this.silenceBeginSecond > 0;
        const hasEnoughSilenceTime   = (this._elapsedSecondFromStart() - this.silenceBeginSecond) > this.silenceSecondThreshold;
        const hasEnoughRecordingTime = this._durationSecond() > this.durationSecondThreshold;
        const hasRecordBuffer        = this.buffers.length > 0;
        return hasSilenceTime && hasEnoughSilenceTime && hasEnoughRecordingTime && hasRecordBuffer;
    }

    _lipSync(isSpeaking) {
        this.port.postMessage({
            shouldUpload: false,
            isSpeaking:   isSpeaking,
        });
    }

    _saveRecord() {
        this.port.postMessage({
            shouldUpload: true,
            speechedAt:   this.voiceBeginSecond,
            durationSec:  this._durationSecond(),
            buffers:      this.buffers,
            bufferLength: this.bufferLength,
        });
        this._clearRecord();
    }

    _isSilence(inputs) {
        return this._volumeLevel(inputs) < this.silenceVolumeThreshold;
    }

    _volumeLevel(inputs) {
        let sum = 0.0;
        inputs.forEach((input) => {
            sum += Math.pow(input, 2);
        });

        return Math.sqrt(sum / inputs.length);
    }

    _recordQuietInput() {
        this.quietBuffers.forEach((qBuffer) => {
            this.buffers.push(qBuffer.inputs);
            this.bufferLength += qBuffer.inputs.length;
        });
        this.quietBuffers = [];
    }

    _recordInput(inputs) {
        if (this.voiceBeginSecond == 0) {
            this.voiceBeginSecond = this._elapsedSecondFromStart();
        }

        this.buffers.push(inputs);
        this.bufferLength += inputs.length;
    }

    _heapQuietInput(inputs) {
        const time = currentTime;

        this.quietBuffers = this.quietBuffers.filter((q) => {
            return q.time >= time - this.quietHistoryDurationSec;
        });

        this.quietBuffers.push({
            time:   time,
            inputs: inputs,
        });
    }

    _clearRecord() {
        this.buffers            = [];
        this.bufferLength       = 0;
        this.voiceBeginSecond   = 0;
        this.silenceBeginSecond = 0;
    }
}

registerProcessor('recorder', Recorder);