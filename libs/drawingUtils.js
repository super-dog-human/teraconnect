export function drawToCanvas(canvasCtx, history) {
  canvasCtx.strokeStyle = history.color
  canvasCtx.lineWidth = history.lineWidth
  canvasCtx.globalCompositeOperation = history.eraser ? 'destination-out': 'source-over'

  const edgePositions = xyPosition(history.positions[0], history.positions[history.positions.length - 1])
  drawEdgeCircle(canvasCtx, edgePositions[0], edgePositions[1], history.color)

  canvasCtx.beginPath()
  history.positions.slice(1).forEach((d, i) => {
    canvasCtx.quadraticCurveTo(...xyPosition(history.positions[i], d))
    canvasCtx.stroke()
  })

  drawEdgeCircle(canvasCtx, edgePositions[2], edgePositions[3], history.color)
}

function xyPosition(fromPosition, toPosition) {
  return [fromPosition.x, fromPosition.y, toPosition.x, toPosition.y]
}

export function clearCanvas(canvasCtx) {
  canvasCtx.clearRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height)
}

export function drawEdgeCircle(canvasCtx, x, y, color) {
  canvasCtx.beginPath()
  canvasCtx.arc(x, y, canvasCtx.lineWidth / 2, 0, Math.PI * 2)
  canvasCtx.fillStyle = color
  canvasCtx.fill()
  canvasCtx.closePath()
}