import { useRef, useEffect } from 'react'
import useMicrophone from './useMicrophone'

export default function useAudioVisualizer(micDeviceID, canvasRef) {
  const canvasCtxRef = useRef()
  const { setNode } = useMicrophone()

  useEffect(() => {
    canvasCtxRef.current = canvasRef.current.getContext('2d')
    canvasCtxRef.current.canvas.width = canvasRef.current.clientWidth
    canvasCtxRef.current.canvas.height = canvasRef.current.clientHeight
    canvasCtxRef.current.clearRect(0, 0, canvasCtxRef.current.canvas.width, canvasCtxRef.current.canvas.height)
    canvasCtxRef.current.strokeStyle = 'white'
    canvasCtxRef.current.lineWidth = 5
  }, [])

  useEffect(() => {
    if (!micDeviceID) return

    let analyser
    let dataArray
    let bufferLength
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
      canvasCtxRef.current.clearRect(0, 0, canvasCtxRef.current.canvas.width, canvasCtxRef.current.canvas.height)
      canvasCtxRef.current.beginPath()

      const sliceWidth = canvasCtxRef.current.canvas.width * 1.0 / bufferLength
      let x = 0

      for(var i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0
        const y = v * canvasCtxRef.current.canvas.height / 2

        if (i === 0) {
          canvasCtxRef.current.moveTo(x, canvasCtxRef.current.canvas.height - y)
        } else {
          canvasCtxRef.current.lineTo(x, canvasCtxRef.current.canvas.height - y)
        }

        x += sliceWidth
      }

      canvasCtxRef.current.stroke()
    }
  }, [micDeviceID])
}
