import { useState, useEffect } from 'react'
import useMicrophone from '../../useMicrophone'

let recorder
let uploader

export default function useVoiceRecorder(id, token, isRecording, setRecord) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [micDeviceID, setMicDeviceID] = useState()
  const [silenceThresholdSec, setSilenceThresholdSec] = useState(0.6)
  const { isMicReady, setNode } = useMicrophone()

  function switchRecording() {
    if (!recorder) return
    recorder.port.postMessage({ isRecording })
  }

  function terminalCurrentRecorder() {
    if (!recorder) return
    recorder.port.postMessage({ isTerminal: true })
  }

  function handleRecorderMessage(command) {
    Object.keys(command).forEach(k => {
      switch(k) {
      case 'isSpeaking':
        setIsSpeaking(command[k])
        return
      case 'saveRecord':
        /*
        uploader.postMessage({
          url: Const.RAW_VOICE_API_URL,
          lessonID: id,
          time: result.speechedAt,
          buffers: result.buffers,
          bufferLength: result.bufferLength,
          currentSampleRate: this._audioCtx.sampleRate
        })
      */
        return
      }
    })

    /*
    const callback = (voice => {
      setRecord('voice', voice)
    }, talking => {
      setIsSpeaking(talking)
    )

    const voice = {
      timeSec: result.speechedAt,
      durationSec: result.durationSec
    }
    callback(voice)

    uploader.onmessage = (event => {
        voice.fileID = event.data.fileID
        callback(voice)
        uploader.terminate()
    })
    */
  }

  function updateSilenceThresholdSec() {
    if(!recorder) return
    recorder.port.postMessage({ changeThreshold: silenceThresholdSec })
  }

  useEffect(() => {
    uploader = new Worker('/voiceUploader.js')
    return () => {
      // uploaderもreturn falseさせる)
      terminalCurrentRecorder()
    }
  }, [])

  useEffect(() => {
    if (!micDeviceID) return

    terminalCurrentRecorder()

    setNode(micDeviceID, async(ctx, micInput) => {
      await ctx.audioWorklet.addModule('/voiceRecorderProcessor.js')

      recorder = new AudioWorkletNode(ctx, 'recorder')
      recorder.port.onmessage = e => {
        handleRecorderMessage(e.data)
      }
      updateSilenceThresholdSec()
      micInput.connect(recorder)
      recorder.connect(ctx.destination)

      if (isRecording) switchRecording()
    })
  }, [micDeviceID])

  useEffect(() => {
    switchRecording()
  }, [isRecording])

  useEffect(() => {
    updateSilenceThresholdSec()
  }, [silenceThresholdSec])

  return { isMicReady, isSpeaking, micDeviceID, setMicDeviceID, silenceThresholdSec, setSilenceThresholdSec }
}