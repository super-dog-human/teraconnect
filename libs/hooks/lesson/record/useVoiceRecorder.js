import { useState, useEffect } from 'react'
import useMicrophone from '../../useMicrophone'

let recorder

export default function useVoiceRecorder(id, token, isRecording, setRecord) {
  const [isTalking, setIsTalking] = useState(false)
  const [micDeviceID, setMicDeviceID] = useState()
  const [silenceThresholdSec, setSilenceThresholdSec] = useState(0.6)
  const { isMicReady, setNode } = useMicrophone()

  function switchMicRecording() {
    if (isMicReady) {
      recorder.port.postMessage({ isRecording })
    } else {
      setTimeout(() => {
        switchMicRecording()
      }, 1000)
    }
  }

  function handleRecorderMessage(result) {
    console.log('voice upload: ', result)


    /*
    const callback = (voice => {
      setRecord('voice', voice)
    }, talking => {
      setIsTalking(talking)
    )

    const voice = {
      timeSec: result.speechedAt,
      durationSec: result.durationSec
    }
    callback(voice)

    const uploader = new Worker('voiceUploader.js')
    uploader.postMessage({
        url: Const.RAW_VOICE_API_URL,
        lessonID: id,
        time: result.speechedAt,
        buffers: result.buffers,
        bufferLength: result.bufferLength,
        currentSampleRate: this._audioCtx.sampleRate
    })

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
    if (!micDeviceID) return

    setNode(micDeviceID, async(ctx, micInput) => {
      await ctx.audioWorklet.addModule('/voiceRecorderProcessor.js')

      recorder = new AudioWorkletNode(ctx, 'recorder')
      recorder.port.onmessage = e => {
        handleRecorderMessage(e.data)
      }
      updateSilenceThresholdSec()
      micInput.connect(recorder)
      recorder.connect(ctx.destination)
    })
  }, [micDeviceID])

  useEffect(() => {
    switchMicRecording()
  }, [isRecording, isMicReady])

  useEffect(() => {
    updateSilenceThresholdSec()
  }, [silenceThresholdSec])

  return { isTalking, micDeviceID, setMicDeviceID, silenceThresholdSec, setSilenceThresholdSec }
}