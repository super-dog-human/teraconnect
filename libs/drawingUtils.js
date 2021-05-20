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

export function reCalcDrawingsTime(rawDrawings) {
  let preAction
  const drawings = []

  rawDrawings.forEach(d => {
    if (['clear', 'show', 'hide'].includes(d.action)) {
      // クリア/表示/非表示の操作はまとめる必要がない
      drawings.push(d)
    } else if (['draw', 'undo'].includes(preAction)) {
      // 線の描写で他の操作をまたがないものはunitsにまとめる
      const drawingGroup = drawings[drawings.length - 1]
      drawingGroup.durationSec = d.elapsedTime + d.durationSec - drawingGroup.elapsedTime
      drawingGroup.units.push({
        action: d.action,
        elapsedTime: d.elapsedTime,
        durationSec: d.durationSec,
        stroke: d.stroke,
      })
    } else {
      // 他の操作をまたいだdraw/undoは新たな配列として格納する
      drawings.push({
        action: d.action,
        elapsedTime: d.elapsedTime,
        durationSec: d.durationSec,
        units: [
          {
            action: d.action,
            elapsedTime: d.elapsedTime,
            durationSec: d.durationSec,
            stroke: d.stroke,
          }
        ]
      })
    }

    preAction = d.action
  })

  // 計算が終わってから不要な桁を丸める
  drawings.filter(d => d.action === 'draw').forEach(d => {
    d.elapsedTime = parseFloat(d.elapsedTime.toFixed(3))
    d.durationSec = parseFloat((d.durationSec || 0).toFixed(3))
    d.units.forEach(u => {
      u.elapsedTime = parseFloat(u.elapsedTime.toFixed(3))
      u.durationSec = parseFloat((u.durationSec || 0).toFixed(3))
    })
  })

  return drawings
}