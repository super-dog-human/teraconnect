import { useRef, useEffect } from 'react'
import { drawToCanvas, clearCanvas } from '../../drawingUtils'
import { Clock } from 'three'

export default function useDrawingPlayer({ isPlaying, drawings, startElapsedTime, currentElapsedTime=0 }) {
  const canvasRef = useRef()
  const canvasCtxRef = useRef()
  const clockRef = useRef(0)
  const elapsedTimeRef = useRef(0)

  function initializeCanvas() {
    currentDrawings().forEach(history => {
      if (history.action !== 'draw') return
      history.units.filter(u => u.action === 'draw').forEach(h => {
        drawToCanvas(canvasCtxRef.current, h.stroke, true)
      })
    })
  }

  function currentDrawings() {
    const durationDrawings = drawings.filter(d => d.elapsedTime <= startElapsedTime)
    reduceUndoDrawings(durationDrawings)

    const lastClearIndex = [...durationDrawings].reverse().findIndex(d => d.action === 'clear')
    if (lastClearIndex >= 0) {
      // 直近のclearより前の描画は意味がないので削除。最後からのインデックスなので合計数から差し引く
      durationDrawings.splice(0, durationDrawings.length - 1 - lastClearIndex)
    }

    return durationDrawings
  }

  function reduceUndoDrawings(drawings) {
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
        if (drawings[i].action !== 'draw') continue

        // 最初に出現するundoを上記で取得しているので、自身より前のdrawのunitsの最後の要素は必ずdrawになる
        if (drawings[i].units.length > 0) {
          drawings[i].units.pop()
          if (drawings[i].units.length === 0) {
            drawings.splice(i, 1)
          }
          break
        }
      }
    } else {
      drawings[drawIndex].units.splice(undoIndexInUnits - 1, 1)
      if (drawings[drawIndex].units.length === 0) {
        drawings.splice(drawIndex, 1)
      }
    }

    reduceUndoDrawings(drawings) // undoがなくなるまで再帰
  }

  function draw() {
    if (!isPlaying) return

    const history = {}
    switch(history.action) {
    case 'draw':
      return
    case 'clear':
      clearCanvas(canvasCtxRef.current)
      return
    case 'show':
      return
    case 'hide':
      return
    }

    elapsedTimeRef.current += clockRef.current.getDelta()
    requestAnimationFrame(draw)
  }

  useEffect(() => {
    canvasCtxRef.current = canvasRef.current.getContext('2d')
  }, [])


  useEffect(() => {
    if (!drawings) return
    initializeCanvas()
  }, [drawings])

  useEffect(() => {
    if (isPlaying) {
      // currentElapsedTimeはシーク時に現在の描画のために使うかも
      clockRef.current = new Clock()
      clearCanvas(canvasCtxRef.current)
      draw()
    }
  }, [isPlaying])

  return { canvasRef }
}