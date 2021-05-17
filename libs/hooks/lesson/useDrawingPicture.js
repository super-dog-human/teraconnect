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
    const durationDrawings = drawings.filter(d => {
      if (currentDrawing) {
        return d.elapsedTime < startElapsedTime
      } else {
        return d.elapsedTime <= startElapsedTime
      }
    })

    if (currentDrawing) {
      durationDrawings.push(currentDrawing)
    }

    reduceUndoPair(durationDrawings)

    const lastClearIndex = [...durationDrawings].reverse().findIndex(d => d.action === 'clear')
    if (lastClearIndex >= 0) {
      // 直近のclearより前の描画は意味がないので削除。最後からのインデックスなので合計数から差し引く
      durationDrawings.splice(0, durationDrawings.length - 1 - lastClearIndex)
    }

    return durationDrawings
  }

  function reduceUndoPair(drawings) {
    let drawIndex, undoIndexInUnits

    drawings.some((drawing, i) => {
      if (drawing.action !== 'draw') return

      const undoIndex = drawing.units.findIndex(d => d.action === 'undo')
      if (undoIndex >= 0) {
        drawIndex = i
        undoIndexInUnits = undoIndex
      }

      return undoIndexInUnits
    })

    if (!undoIndexInUnits) return // undoがなくなれば終了
    drawings[drawIndex].units.splice(undoIndexInUnits, 1) // undoを削除

    if (undoIndexInUnits === 0) {
      for (let i = drawIndex - 1; i >= 0; i--) {
        // 最初に出現するundoを上記で取得しているので、自身より前のdrawのunitsの最後の要素は必ずdrawになる
        if (drawings[i].action === 'draw') {
          drawings[i].units.pop()
          if (drawings[i].units.length === 0) {
            drawings.splice(i, 1)
          }
          break
        } else if (drawings[i].action === 'clear'){
          drawings.splice(i, 1)
          break
        } else {
          // actionがshow/hideの時はundoできないので何もしない。drawでもunitsが
        }
      }
    } else {
      drawings[drawIndex].units.splice(undoIndexInUnits - 1, 1)
      if (drawings[drawIndex].units.length === 0) {
        drawings.splice(drawIndex, 1)
      }
    }

    reduceUndoPair(drawings)
  }

  useEffect(() => {
    canvasCtxRef.current = canvasRef.current.getContext('2d')
  }, [])

  return { drawPicture }
}