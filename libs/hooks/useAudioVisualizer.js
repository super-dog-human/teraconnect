import { useEffect } from 'react'
import useMicrophone from './useMicrophone'

let canvasCtx
let analyser

export default function useAudioVisualizer(micDeviceID, canvasRef) {
  const { audioCtx, setNode } = useMicrophone(micDeviceID)

  useEffect(() => {
    canvasCtx = canvasRef.current.getContext('2d')
    canvasCtx.clearRect(0, 0, canvasRef.clientWidth, canvasRef.clientHeight)
    canvasCtx.fillStyle = 'rgb(200, 200, 200)'
    canvasCtx.fillRect(0, 0, canvasRef.clientWidth, canvasRef.clientHeight)
  }, [])

  useEffect(() => {
    if (!audioCtx) return

    analyser = audioCtx.createAnalyser()
    analyser.fftSize = 2048

    requestAnimationFrame(drawVisual)

    function drawVisual() {
      requestAnimationFrame(drawVisual)

      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      analyser.getByteFrequencyData(dataArray)

      canvasCtx.fillStyle = 'rgb(0, 0, 0)'
      canvasCtx.fillRect(0, 0, canvasRef.clientWidth, canvasRef.clientHeight)
    }
  }, [audioCtx])

  useEffect(() => {
    if (!micDeviceID) return
    setNode(analyser)
  }, [micDeviceID])
}
