import { useRef, useEffect } from 'react'
import { drawToCanvas } from '../../drawingUtils'

export default function useDrawingPicture({ canvasRef, drawings, startElapsedTime }) {
  const canvasCtxRef = useRef()

  function drawPicture(currentDrawings) {
    initialDrawings(currentDrawings).forEach(history => {
      switch(history.action) {
      // clearは削除済みなので登場しない
      case 'draw':
        history.units.forEach(u => {
          // undoは削除済みなので登場しない
          drawToCanvas(canvasCtxRef.current, u.stroke)
        })
        return
      case 'show':
        canvasRef.current.style.opacity = 1
        return
      case 'hide':
        canvasRef.current.style.opacity = 0
        return
      }
    })
  }

  function initialDrawings(currentDrawings) {
    let drawingsInDuration = drawings.filter(d => d.elapsedTime < startElapsedTime)
    drawingsInDuration.push(...currentDrawings)
    drawingsInDuration = drawingsInDuration.map(d => {
      const drawing = { ...d }
      if (drawing.units) {
        drawing.units = d.units.map(u => ({ ...u })) // オブジェクトの配列のコピー
      }
      return drawing
    })

    removeUndoPair(drawingsInDuration)

    const lastClearIndex = [...drawingsInDuration].slice().reverse().findIndex(d => d.action === 'clear')
    if (lastClearIndex >= 0) {
      // 直近のclearより前の描画は意味がないので削除。最後からのインデックスなので合計数から差し引く
      drawingsInDuration.splice(0, drawingsInDuration.length - lastClearIndex)
    }

    return drawingsInDuration
  }

  function removeUndoPair(targetDrawings) {
    let drawIndex, undoIndexInUnits

    targetDrawings.some((drawing, i) => {
      if (drawing.action !== 'draw') return

      const undoIndex = drawing.units.findIndex(d => d.action === 'undo')
      if (undoIndex >= 0) {
        drawIndex = i
        undoIndexInUnits = undoIndex
      }

      return undoIndexInUnits
    })

    if (!undoIndexInUnits) return // undoがなくなれば終了

    targetDrawings[drawIndex].units.splice(undoIndexInUnits, 1) // undoを削除

    if (undoIndexInUnits === 0) {
      for (let i = drawIndex - 1; i >= 0; i--) {
        // 最初に出現するundoを上記で取得しているので、自身より前のdrawのunitsの最後の要素は必ずdrawになる
        if (targetDrawings[i].action === 'draw') {
          targetDrawings[i].units.pop()
          if (targetDrawings[i].units.length === 0) {
            targetDrawings.splice(i, 1)
          }
          break
        } else if (targetDrawings[i].action === 'clear'){
          targetDrawings.splice(i, 1)
          break
        } else {
          // actionがshow/hideの時はundoできないので何もしない
        }
      }
    } else {
      targetDrawings[drawIndex].units.splice(undoIndexInUnits - 1, 1)
      if (targetDrawings[drawIndex].units.length === 0) {
        targetDrawings.splice(drawIndex, 1)
      }
    }

    removeUndoPair(targetDrawings)
  }

  useEffect(() => {
    canvasCtxRef.current = canvasRef.current.getContext('2d')
  }, [])

  return { drawPicture }
}