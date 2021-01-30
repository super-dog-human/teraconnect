class Recorder extends AudioWorkletProcessor {
  constructor() {
    super()

    this.isRecording = false
    this.isSpeaking = false
    this.isTerminal = false
    this.silenceLipSyncThreshold = 0.2
    this.silenceSecondThreshold
    this.durationSecondThreshold = 2.0
    this.silenceVolumeThreshold = 0.05
    this.quietHistoryDurationSec = 0.2
    this.quietBuffers = []
    this.buffers = []
    this.bufferLength = 0
    this.recordingStartSecond = 0
    this.recordingStopSecond = 0
    this.silenceBeginSecond = 0
    this.speakingEndSecond = 0
    this.voiceBeginSecond = 0

    this.port.onmessage = e => {
      Object.keys(e.data).forEach(k => {
        switch(k) {
        case 'isRecording':
          this.isRecording = e.data[k]
          if (this.isRecording) {
            this.recordingStartSecond = currentTime
            return
          }

          if (this.buffers.length > 0) this._saveRecord()
          this.recordingStopSecond += this._elapsedSecondFromStart()
          return
        case 'changeThreshold':
          this.silenceSecondThreshold = e.data[k]
          return
        case 'isTerminal':
          this.isTerminal = e.data[k]
          return
        }
      })
    }
  }

  process(allInputs) {
    const inputs = allInputs[0][0] // モノラル録音
    const isSilence = this._isSilence(inputs)

    if (isSilence && this.speakingEndSecond === 0) {
      this.speakingEndSecond = currentTime
    }

    if (isSilence && this.isSpeaking && this._shouldStopLipSync()) {
      this.isSpeaking = false
      this.port.postMessage({ isSpeaking: false })
    } else if (!isSilence && !this.isSpeaking) {
      this.isSpeaking = true
      this.port.postMessage({ isSpeaking: true })
      this.speakingEndSecond = 0
    }

    if (!this.isRecording){
      return !this.isTerminal
    }

    if (isSilence) {
      if (this._shouldSaveRecording()) {
        this._saveRecord()
        return !this.isTerminal
      }

      if (this.silenceBeginSecond === 0) {
        this.silenceBeginSecond = this._elapsedSecondFromStart()
      }
      if (this.buffers.length > 0) {
        this._recordInput(inputs)
      } else {
        this._heapQuietInput(inputs)
      }
    } else {
      this.silenceBeginSecond = 0
      this._recordQuietInput()
      this._recordInput(inputs)
    }

    return !this.isTerminal
  }

  _elapsedSecondFromStart() {
    return this.recordingStopSecond + currentTime - this.recordingStartSecond
  }

  _durationSecond() {
    return this._elapsedSecondFromStart() - this.voiceBeginSecond
  }

  _shouldStopLipSync() {
    return currentTime - this.speakingEndSecond > this.silenceLipSyncThreshold
  }

  _shouldSaveRecording() {
    const hasSilenceTime = this.silenceBeginSecond > 0
    const hasEnoughSilenceTime = this._elapsedSecondFromStart() - this.silenceBeginSecond > this.silenceSecondThreshold
    const hasEnoughRecordingTime = this._durationSecond() > this.durationSecondThreshold
    const hasRecordBuffer = this.buffers.length > 0
    return (
      hasSilenceTime && hasEnoughSilenceTime && hasEnoughRecordingTime && hasRecordBuffer
    )
  }

  _saveRecord() {
    this.port.postMessage({
      saveRecord: {
        time: this.voiceBeginSecond,
        durationSec: this._durationSecond(),
        buffers: this.buffers,
        bufferLength: this.bufferLength,
      }
    })
    this._clearRecord()
  }

  _isSilence(inputs) {
    return this._volumeLevel(inputs) < this.silenceVolumeThreshold
  }

  _volumeLevel(inputs) {
    let sum = 0.0
    inputs.forEach(input => {
      sum += Math.pow(input, 2)
    })

    return Math.sqrt(sum / inputs.length)
  }

  _recordQuietInput() {
    this.quietBuffers.forEach(qBuffer => {
      this.buffers.push(qBuffer.inputs)
      this.bufferLength += qBuffer.inputs.length
    })
    this.quietBuffers = []
  }

  _recordInput(inputs) {
    if (this.voiceBeginSecond === 0) {
      this.voiceBeginSecond = this._elapsedSecondFromStart()
    }

    const copyInputs = new Float32Array(inputs.length)
    copyInputs.set(inputs)

    this.buffers.push(copyInputs)
    this.bufferLength += inputs.length
  }

  _heapQuietInput(inputs) {
    const time = currentTime

    this.quietBuffers = this.quietBuffers.filter(q => {
      return q.time >= time - this.quietHistoryDurationSec
    })

    const copyInputs = new Float32Array(inputs.length)
    copyInputs.set(inputs)

    this.quietBuffers.push({
      time: time,
      inputs: copyInputs
    })
  }

  _clearRecord() {
    this.buffers = []
    this.bufferLength = 0
    this.voiceBeginSecond = 0
    this.silenceBeginSecond = 0
  }
}

registerProcessor('recorder', Recorder)