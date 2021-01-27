import { useEffect } from 'react'
import useMicrophone from './useMicrophone'

let canvasCtx
let analyser
let bufferLength
let dataArray

export default function useAudioVisualizer(micDeviceID, canvasRef) {
  const { setNode } = useMicrophone()

  useEffect(() => {
    canvasCtx = canvasRef.current.getContext('2d')
    canvasCtx.canvas.width = canvasRef.current.clientWidth
    canvasCtx.canvas.height = canvasRef.current.clientHeight
    canvasCtx.clearRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height)
    canvasCtx.strokeStyle = 'white'
    canvasCtx.lineWidth = 5
  }, [])

  useEffect(() => {
    if (!micDeviceID) return

    setNode(micDeviceID, (ctx, micInput) => {
      analyser = ctx.createAnalyser()
      analyser.fftSize = 2048
      micInput.connect(analyser)

      bufferLength = analyser.frequencyBinCount
      dataArray = new Uint8Array(bufferLength)

      requestAnimationFrame(drawVisual)
    })

    function drawVisual() {
      requestAnimationFrame(drawVisual)
      analyser.getByteFrequencyData(dataArray)
      canvasCtx.clearRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height)
      canvasCtx.beginPath()

      const sliceWidth = canvasCtx.canvas.width * 1.0 / bufferLength
      let x = 0

      for(var i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0
        const y = v * canvasCtx.canvas.height / 2

        if (i === 0) {
          canvasCtx.moveTo(x, canvasCtx.canvas.height - y)
        } else {
          canvasCtx.lineTo(x, canvasCtx.canvas.height - y)
        }

        x += sliceWidth
      }

      canvasCtx.stroke()
    }
  }, [micDeviceID])
}
