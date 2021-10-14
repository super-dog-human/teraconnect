import { useRef, useState, useCallback, useEffect } from 'react'
import useMicrophone from '../useMicrophone'
import { bufferToWavFile }  from '../../audioUtils'

export default function useVoiceRecorder({ needsUpload=true, lessonID, isRecording, realElapsedTime, createAnalyzer }) {
  const recorderRef = useRef()
  const uploaderRef = useRef()
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [shouldSetupMic, setShouldUpdateMic] = useState(false)
  const [micDeviceID, setMicDeviceID] = useState()
  const [silenceThresholdSec, setSilenceThresholdSec] = useState(1.0)
  const [voiceFile, setVoiceFile] = useState()
  const { isMicReady, setNode } = useMicrophone()

  const switchRecording = useCallback(() => {
    if (!recorderRef.current) return
    recorderRef.current.port.postMessage({ isRecording })
  }, [isRecording])

  const terminalCurrentRecorder = useCallback(() => {
    if (!recorderRef.current) return
    recorderRef.current.port.postMessage({ isTerminal: true })
  }, [])

  const terminalUploader = useCallback(() => {
    uploaderRef.current.postMessage({ isTerminal: true })
  }, [])

  const handleRecorderMessage = useCallback(command => {
    Object.keys(command).forEach(async k => {
      switch(k) {
      case 'isSpeaking':
        setIsSpeaking(command[k])
        return
      case 'saveRecord':
        // データコピーが発生するが、AudioWorklet内でDedicated Workerを扱えないのでここから受け渡しをする
        if (needsUpload) {
          uploadVoice(command[k])
        } else {
          setVoiceFile(bufferToWavFile(command[k]))
        }
        return
      }
    })
  }, [needsUpload])

  async function uploadVoice(body) {
    uploaderRef.current.postMessage({ newVoice: body })
  }

  const updateSilenceThresholdSec = useCallback(() => {
    if(!recorderRef.current) return
    recorderRef.current.port.postMessage({ changeThreshold: silenceThresholdSec })
  }, [silenceThresholdSec])

  useEffect(() => {
    uploaderRef.current = new Worker('/voiceUploader.js')
    uploaderRef.current.postMessage({ initialize: { lessonID, apiURL: process.env.NEXT_PUBLIC_TERACONNECT_API_URL } })

    return () => {
      terminalCurrentRecorder()
      terminalUploader()
    }
  }, [lessonID, terminalCurrentRecorder, terminalUploader])

  useEffect(() => {
    if(!micDeviceID) return
    setShouldUpdateMic(true)
  }, [micDeviceID])

  useEffect(() => {
    if (!shouldSetupMic) return

    terminalCurrentRecorder()
    setNode(micDeviceID, async(ctx, micInput) => {
      await ctx.audioWorklet.addModule('/voiceRecorderProcessor.js')
      recorderRef.current = new AudioWorkletNode(ctx, 'recorder')
      if (needsUpload) {
        recorderRef.current.port.postMessage({ setElapsedTime: realElapsedTime() })
      } else {
        recorderRef.current.port.postMessage({ setIsSimpleMode: true })
      }
      recorderRef.current.port.onmessage = e => {
        handleRecorderMessage(e.data)
      }
      updateSilenceThresholdSec()

      if (createAnalyzer) {
        const analyzer = createAnalyzer(ctx)
        micInput.connect(analyzer).connect(recorderRef.current).connect(ctx.destination)
      } else {
        micInput.connect(recorderRef.current).connect(ctx.destination)
      }

      if (isRecording) switchRecording()

      setShouldUpdateMic(false)
    })
  }, [shouldSetupMic, micDeviceID, needsUpload, isRecording, realElapsedTime, createAnalyzer, terminalCurrentRecorder, setNode, handleRecorderMessage, updateSilenceThresholdSec, switchRecording])

  useEffect(() => {
    switchRecording()
  }, [isRecording, switchRecording])

  useEffect(() => {
    updateSilenceThresholdSec()
  }, [silenceThresholdSec, updateSilenceThresholdSec])

  return { isMicReady, isSpeaking, setMicDeviceID, silenceThresholdSec, setSilenceThresholdSec, voiceFile }
}