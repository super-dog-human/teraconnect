import { useRef, useEffect } from 'react'
import { deepCopy } from '../../../utils'

const maxLessonDurationSec = 600

export default function useDrawingEditor({ isRecording, setIsRecording, isPlaying, setIsPlaying, sameTimeIndex, startElapsedTime, getElapsedTime,
  previewDurationSecRef, drawings, setDrawings }) {
  const hasStartRecording = useRef(false)
  const drawingUnitsRef = useRef([])
  const drawingDurationSecRef = useRef(previewDurationSecRef.current)

  function startRecording() {
    hasStartRecording.current = true

    previewDurationSecRef.current = parseFloat((maxLessonDurationSec - startElapsedTime).toFixed(3))

    const elapsedTime = getElapsedTime()
    reduceDrawingsUntilElapsedTime(elapsedTime)
    setIsPlaying(true) // 音声や画像を再生しながら収録を行う
  }

  function reduceDrawingsUntilElapsedTime(elapsedTime) {
    const reducedDrawings = deepCopy(drawings.filter(d => d.elapsedTime <= startElapsedTime))

    const currentDrawing = currentTargetDrawing(reducedDrawings)
    const units = []

    currentDrawing.units.forEach(unit => {
      if (unit.elapsedTime > elapsedTime) return

      if (unit.elapsedTime + unit.durationSec <= elapsedTime || unit.action === 'undo') {
        units.push(deepCopy(unit))
        return
      }

      const timePerUnit = unit.stroke.positions.length / unit.durationSec
      const diffTime = elapsedTime - unit.elapsedTime
      const strokePositionIndex = Math.round(timePerUnit * diffTime)

      currentDrawing.durationSec = parseFloat((elapsedTime - startElapsedTime).toFixed(3))
      drawingDurationSecRef.current = currentDrawing.durationSec

      if (strokePositionIndex > 0) { // 対象の描画がある場合のみunitを格納
        const reducedUnit = deepCopy(unit)
        reducedUnit.durationSec = parseFloat(diffTime.toFixed(3))
        reducedUnit.stroke.positions.splice(strokePositionIndex)
        units.push(reducedUnit)
      }
    })
    currentDrawing.units = units // 新しいunitsが空でもそのまま入れ替える

    setDrawings(reducedDrawings)
  }

  function setRecord(record) {
    const elapsedTime = getElapsedTime()
    const unit = { action: record.action }

    if (unit.action === 'draw') {
      const durationSec = record.durationMillisec * 0.001
      unit.elapsedTime = parseFloat((elapsedTime - durationSec).toFixed(3))
      unit.durationSec = parseFloat(durationSec.toFixed(3))
      unit.stroke = record.value
    } else if (unit.action === 'undo') {
      unit.elapsedTime = parseFloat(elapsedTime.toFixed(3))
      unit.durationSec = 0
    }

    drawingUnitsRef.current.push(unit)
  }

  function endRecording() {
    setPreviewDurationSecByDrawing()

    if (drawingUnitsRef.current.length === 0) return // 収録中に何も描かなかった場合

    const newUnits = deepCopy(drawingUnitsRef.current)
    setDrawings(drawings => {
      const currentDrawing = currentTargetDrawing(drawings)
      currentDrawing.units.push(...newUnits)
      currentDrawing.durationSec = parseFloat(previewDurationSecRef.current.toFixed(3))

      return [...drawings]
    })

    drawingUnitsRef.current = []
  }

  function setPreviewDurationSecByDrawing() {
    if (drawingUnitsRef.current.length > 0) {
      const lastUnit = drawingUnitsRef.current[drawingUnitsRef.current.length - 1]
      const drawingDurationSec = parseFloat((lastUnit.elapsedTime + lastUnit.durationSec - startElapsedTime).toFixed(3))
      previewDurationSecRef.current = drawingDurationSec
    } else {
      previewDurationSecRef.current = drawingDurationSecRef.current
    }
  }

  function currentTargetDrawing(drawings) {
    return drawings.filter(d => d.elapsedTime === startElapsedTime)[sameTimeIndex]
  }

  useEffect(() => {
    if (isRecording) {
      startRecording()
    } else {
      if (!hasStartRecording.current) return // 初回読み込み時は何もしない
      setIsPlaying(false)
      endRecording()
    }
  }, [isRecording])

  useEffect(() => {
    if (!isPlaying && getElapsedTime() >= maxLessonDurationSec) {
      setIsRecording(false) // 最後まで再生されたら収録も停止する
    }
  }, [isPlaying])

  return { setRecord }
}