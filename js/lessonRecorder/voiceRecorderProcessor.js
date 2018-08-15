class Recorder extends AudioWorkletProcessor {

    constructor() {
        super();

        this.isRecording             = false;
        this.silenceSecondThreshold  = 1.0;
        this.durationSecondThreshold = 2.0;
        this.silenceVolumeThreshold  = 0.05;
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
                this.saveRecord();
            }
        };
    }

    process(allInputs) {
        if (!this.isRecording) return true;

        let inputs = allInputs[0][0]; // recording monoral only

        if (this.isSilence(inputs)) {
            if (this.shouldSaveRecording()) {
                this.saveRecord();
                return true;
            }

            if (this.silenceBeginSecond == 0) {
                this.silenceBeginSecond = this.elapsedSecondFromStart();
            }
            if (this.buffers.length > 0) {
                this.recordInput(inputs);
            }
        } else {
            this.silenceBeginSecond = 0;
            this.recordInput(inputs);
        }

        return true;
    }

    elapsedSecondFromStart() {
        return currentTime - this.recordingStartSecond;
    }

    durationSecond() {
        return this.elapsedSecondFromStart() - this.voiceBeginSecond;
    }

    shouldSaveRecording() {
        const hasSilenceTime         = this.silenceBeginSecond > 0;
        const hasEnoughSilenceTime   = (this.elapsedSecondFromStart() - this.silenceBeginSecond) > this.silenceSecondThreshold;
        const hasEnoughRecordingTime = this.durationSecond() > this.durationSecondThreshold;
        const hasRecordBuffer        = this.buffers.length > 0;
        return hasSilenceTime && hasEnoughSilenceTime && hasEnoughRecordingTime && hasRecordBuffer;
    }

    saveRecord() {
        this.port.postMessage({
            speechedAt:   this.voiceBeginSecond,
            durationSec:  this.durationSecond(),
            buffers:      this.buffers,
            bufferLength: this.bufferLength,
        });
        this.clearRecord();
    }

    isSilence(inputs) {
        return this.volumeLevel(inputs) < this.silenceVolumeThreshold;
    }

    volumeLevel(inputs) {
        let sum = 0.0;
        inputs.forEach((input) => {
            sum += Math.pow(input, 2);
        });

        return Math.sqrt(sum / inputs.length);
    }

    recordInput(inputs) {
        if (this.voiceBeginSecond == 0) {
            this.voiceBeginSecond = this.elapsedSecondFromStart();
        }

        this.buffers.push(inputs);
        this.bufferLength += inputs.length;
    }

    clearRecord() {
        this.buffers            = [];
        this.bufferLength       = 0;
        this.voiceBeginSecond   = 0;
        this.silenceBeginSecond = 0;
    }
  }

registerProcessor('recorder', Recorder);