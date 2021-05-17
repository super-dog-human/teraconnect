import { useRef, useEffect } from 'react'
import { drawToCanvas } from '../../drawingUtils'

export default function useDrawingPicture({ canvasRef, drawings }) {
  const canvasCtxRef = useRef()

  function drawPicture(startElapsedTime, currentDrawing) {
    initialDrawings(startElapsedTime, currentDrawing).forEach(history => {
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

  function initialDrawings(startElapsedTime, currentDrawing) {
    const drawingsInDuration = drawings.filter(d => {
      if (currentDrawing) {
        return d.elapsedTime < startElapsedTime
      } else {
        return d.elapsedTime <= startElapsedTime
      }
    })

    if (currentDrawing) {
      drawingsInDuration.push({ ...currentDrawing })
    }

    removeUndoPair(drawingsInDuration)

    const lastClearIndex = [...drawingsInDuration].reverse().findIndex(d => d.action === 'clear')
    if (lastClearIndex >= 0) {
      // 直近のclearより前の描画は意味がないので削除。最後からのインデックスなので合計数から差し引く
      drawingsInDuration.splice(0, drawingsInDuration.length - 1 - lastClearIndex)
    }

    return drawingsInDuration
  }

  function removeUndoPair(targetDrawing) {
    let drawIndex, undoIndexInUnits

    targetDrawing.some((drawing, i) => {
      if (drawing.action !== 'draw') return

      drawing.units = [...drawing.units]

      const undoIndex = drawing.units.findIndex(d => d.action === 'undo')
      if (undoIndex >= 0) {
        drawIndex = i
        undoIndexInUnits = undoIndex
      }

      return undoIndexInUnits
    })

    if (!undoIndexInUnits) return // undoがなくなれば終了
    targetDrawing[drawIndex].units.splice(undoIndexInUnits, 1) // undoを削除

    if (undoIndexInUnits === 0) {
      for (let i = drawIndex - 1; i >= 0; i--) {
        // 最初に出現するundoを上記で取得しているので、自身より前のdrawのunitsの最後の要素は必ずdrawになる
        if (targetDrawing[i].action === 'draw') {
          targetDrawing[i].units.pop()
          if (targetDrawing[i].units.length === 0) {
            targetDrawing.splice(i, 1)
          }
          break
        } else if (targetDrawing[i].action === 'clear'){
          targetDrawing.splice(i, 1)
          break
        } else {
          // actionがshow/hideの時はundoできないので何もしない。drawでもunitsが
        }
      }
    } else {
      targetDrawing[drawIndex].units.splice(undoIndexInUnits - 1, 1)
      if (targetDrawing[drawIndex].units.length === 0) {
        targetDrawing.splice(drawIndex, 1)
      }
    }

    removeUndoPair(targetDrawing)
  }

  useEffect(() => {
    canvasCtxRef.current = canvasRef.current.getContext('2d')
  }, [])

  return { drawPicture }
}