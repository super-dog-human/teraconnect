class Recorder extends AudioWorkletProcessor {
  constructor() {
    super()

    this.isRecording = false
    this.isSpeaking = false
    this.isRunnning = true
    this.silenceLipSyncThreshold = 0.2
    this.silenceSecondThreshold     // changeThresholdメッセージで外部から設定される
    this.durationSecondThreshold = 2.0
    this.silenceVolumeThreshold = 0.05
    this.quietHistoryDurationSec = 0.2
    this.quietBuffers = []
    this.buffers = []
    this.elapsedSeconds = 0         // 直近の録音停止までの収録時間累計
    this.recordingStartTime = 0     // 直近の録音開始操作を行なった時間
    this.beginningSilenceTime = 0   // 直近の静寂が始まった時間
    this.beginningBufferingTime = 0 // 直近の録音データの記録開始時間

    this.port.onmessage = e => {
      Object.keys(e.data).forEach(k => {
        switch(k) {
        case 'isRecording':
          this.isRecording = e.data[k]
          if (this.isRecording) {
            this.recordingStartTime = currentTime
          } else {
            if (this.buffers.length > 0) this._saveRecord()
            this.elapsedSeconds += currentTime - this.recordingStartTime
          }
          return
        case 'changeThreshold':
          this.silenceSecondThreshold = e.data[k]
          return
        case 'isTerminal':
          if (this.buffers.length > 0) {
            this._saveRecord()
          }
          this.isRunnning = false
          return
        }
      })
    }
  }

  process(allInputs) {
    const inputs = allInputs[0][0] // モノラル録音
    const isSilence = this._isSilence(inputs)

    if (isSilence && this.beginningSilenceTime === 0) {
      this.beginningSilenceTime = currentTime
    }

    if (!isSilence && this.beginningSilenceTime != 0) {
      this.beginningSilenceTime = 0
    }

    if (isSilence && this.isSpeaking && this._shouldStopLipSync()) {
      this.isSpeaking = false
      this.port.postMessage({ isSpeaking: false })
    } else if (!isSilence && !this.isSpeaking) {
      this.isSpeaking = true
      this.port.postMessage({ isSpeaking: true })
    }

    if (!this.isRecording) {
      return this.isRunnning
    }

    if (isSilence) {
      if (this._shouldSaveRecording()) {
        this._saveRecord()
        this._heapQuietInput(inputs)
      } else {
        if (this.buffers.length > 0) {
          this._recordInput(inputs)    // 発声中の一瞬の静寂なら通常のバッファに音声を記録
        } else {
          this._heapQuietInput(inputs) // 静寂が続いているなら静寂用バッファに音声を記録
        }
      }
    } else {
      this._recordQuietInput()
      this._recordInput(inputs)
    }

    return this.isRunnning
  }

  _elapsedSeconds(nowTime) {
    return this.elapsedSeconds + nowTime - this.recordingStartTime
  }

  _shouldStopLipSync() {
    return currentTime - this.beginningSilenceTime > this.silenceLipSyncThreshold
  }

  _shouldSaveRecording() {
    const nowTime = currentTime

    const hasSilenceTime = this.beginningSilenceTime > 0
    if (!hasSilenceTime) return false

    const hasEnoughSilenceTime = nowTime - this.beginningSilenceTime > this.silenceSecondThreshold
    if (!hasEnoughSilenceTime) return false

    const hasEnoughRecordingTime = this._elapsedSeconds(nowTime) > this.durationSecondThreshold
    if (!hasEnoughRecordingTime) return false

    const hasRecordBuffer = this.buffers.length > 0
    if (!hasRecordBuffer) return false

    return true
  }

  _saveRecord() {
    this.port.postMessage({
      saveRecord: {
        speeched: this._elapsedSeconds(this.beginningBufferingTime),
        durationSec: currentTime - this.beginningBufferingTime,
        buffers: this.buffers,
      }
    })

    this.buffers = []
    this.beginningBufferingTime = 0
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

  _heapQuietInput(inputs) {
    const time = currentTime

    this.quietBuffers = this.quietBuffers.filter(q => (
      q.time >= time - this.quietHistoryDurationSec
    ))

    if (this.quietBuffers.length > 0) {
      this.beginningBufferingTime = this.quietBuffers[0].time
    }

    const copyInputs = new Float32Array(inputs.length)
    copyInputs.set(inputs)

    this.quietBuffers.push({
      time: time,
      inputs: copyInputs
    })
  }

  _recordQuietInput() {
    this.quietBuffers.forEach(qBuffer => {
      this.buffers.push(qBuffer.inputs)
    })
    this.quietBuffers = []
  }

  _recordInput(inputs) {
    if (this.beginningBufferingTime === 0) {
      this.beginningBufferingTime = currentTime
    }

    const copyInputs = new Float32Array(inputs.length)
    copyInputs.set(inputs)

    this.buffers.push(copyInputs)
  }
}

registerProcessor('recorder', Recorder)