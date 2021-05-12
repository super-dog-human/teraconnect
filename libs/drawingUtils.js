export function drawToCanvas(canvasCtx, history) {
  canvasCtx.strokeStyle = history.color
  canvasCtx.lineWidth = history.lineWidth
  canvasCtx.globalCompositeOperation = history.eraser ? 'destination-out': 'source-over'

  const coef = { x: canvasCtx.canvas.clientWidth / history.width, y: canvasCtx.canvas.clientHeight / history.height }
  const circlePositions = calcResizePosition(coef, history.positions[0], history.positions[history.positions.length - 1])
  drawEdgeCircle(canvasCtx, circlePositions[0], circlePositions[1], history.color)

  canvasCtx.beginPath()
  history.positions.slice(1).forEach((d, i) => {
    canvasCtx.quadraticCurveTo(...calcResizePosition(coef, history.positions[i], d))
    canvasCtx.stroke()
  })

  drawEdgeCircle(canvasCtx, circlePositions[2], circlePositions[3], history.color)
}

function calcResizePosition(coefficient, fromPosition, toPosition) {
  return [fromPosition.x, fromPosition.y, toPosition.x, toPosition.y]
  return [
    coefficient.x * fromPosition.x,
    coefficient.y * fromPosition.y,
    coefficient.x * toPosition.x,
    coefficient.y * toPosition.y].map(f => (Math.round(f)))
}

export function clearCanvas(canvasCtx) {
  canvasCtx.clearRect(0, 0, canvasCtx.canvas.clientWidth, canvasCtx.canvas.clientHeight)
}

export function drawEdgeCircle(canvasCtx, x, y, color) {
  canvasCtx.beginPath()
  canvasCtx.arc(x, y, canvasCtx.lineWidth / 2, 0, Math.PI * 2)
  canvasCtx.fillStyle = color
  canvasCtx.fill()
  canvasCtx.closePath()
}