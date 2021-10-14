import { useRef, useCallback, useEffect } from 'react'

export default function useAudioVisualizer() {
  const canvasRef = useRef()
  const canvasCtxRef = useRef()
  const analyserRef = useRef()
  const bufferLengthRef = useRef()
  const dataArrayRef = useRef()
  const sliceWidthRef = useRef()

  const drawVisual = useCallback(() => {
    requestAnimationFrame(drawVisual)

    analyserRef.current.getByteFrequencyData(dataArrayRef.current)
    canvasCtxRef.current.clearRect(0, 0, canvasCtxRef.current.canvas.width, canvasCtxRef.current.canvas.height)
    canvasCtxRef.current.beginPath()

    let x = 0

    for(var i = 0; i < bufferLengthRef.current; i++) {
      const v = dataArrayRef.current[i] / 128.0
      const y = v * canvasCtxRef.current.canvas.height / 2

      if (i === 0) {
        canvasCtxRef.current.moveTo(x, canvasCtxRef.current.canvas.height - y)
      } else {
        canvasCtxRef.current.lineTo(x, canvasCtxRef.current.canvas.height - y)
      }

      x += sliceWidthRef.current
    }

    canvasCtxRef.current.stroke()
  }, [])

  const createAnalyzer = useCallback(ctx => {
    analyserRef.current = ctx.createAnalyser()
    analyserRef.current.fftSize = 2048
    bufferLengthRef.current = analyserRef.current.frequencyBinCount
    dataArrayRef.current = new Uint8Array(bufferLengthRef.current)
    sliceWidthRef.current = canvasCtxRef.current.canvas.width * 1.0 / bufferLengthRef.current

    drawVisual()
    return analyserRef.current
  }, [drawVisual])

  useEffect(() => {
    canvasCtxRef.current = canvasRef.current.getContext('2d')
    canvasCtxRef.current.canvas.width = canvasRef.current.clientWidth
    canvasCtxRef.current.canvas.height = canvasRef.current.clientHeight
    canvasCtxRef.current.clearRect(0, 0, canvasCtxRef.current.canvas.width, canvasCtxRef.current.canvas.height)
    canvasCtxRef.current.strokeStyle = 'white'
    canvasCtxRef.current.lineWidth = 5
  }, [])

  return { createAnalyzer, canvasRef }
}
