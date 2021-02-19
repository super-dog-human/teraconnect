import React, { useState, useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import useTimeCounter from '../hooks/useTimeCounter'
import { useDialogContext } from './dialogContext'
import { useErrorDialogContext } from './errorDialogContext'
import { post } from '../fetch'

const LessonRecorderContext = React.createContext({
  isRecording: false,
  setIsRecording: () => {},
  isFinishing: false,
  elapsedSeconds: 0,
  setRecord: () => {},
  switchCounter: () => {},
})

const lessonInStopping = {
  avatarMoving: null,
  graphic: null,
  drawings: [],
}
const lesson = {
  durationSec: 0,
  avatarID: null,
  avatarLightColor: null,
  backgroundImageID: null,
  backgroundMusicID: null,
  avatarMovings: [],
  graphics: [],
  drawings: [],
}

const LessonRecorderProvider = ({ children }) => {
  const router = useRouter()
  const [isRecording, setIsRecording] = useState(false)
  const [isFinishing, setIsFinishing] = useState(false)
  const { elapsedSeconds, realElapsedTime, switchCounter } = useTimeCounter()
  const { showDialog } = useDialogContext()
  const { showError } = useErrorDialogContext()

  function setRecord(record) {
    switch (record.kind) {
    case 'avatarID':
      lesson.avatarID = record.value
      return
    case 'avatarLightColor':
      lesson.avatarLightColor = Object.values(record.value).join(',')
      return
    case 'backgroundImageID':
      lesson.backgroundImageID = record.value
      return
    case 'backgroundMusicID':
      lesson.backgroundMusicID = record.value
      return
    case 'avatarMoving': {
      const durationSec = record.durationMillisec * 0.001
      const avatarMoving = {
        elapsedtime: elapsedFloatTimeFromDuration(durationSec),
        durationSec: parseFloat(durationSec.toFixed(3)),
        position: record.value,
      }

      if (isRecording) {
        lesson.avatarMovings.push(avatarMoving)
      } else {
        avatarMoving.durationSec = 0
        lessonInStopping.avatarMoving = avatarMoving // 停止中に複数回移動しても、直近の操作しか意味を持たない
      }
      return
    }
    case 'graphic': {
      const graphic = {
        graphicID: parseInt(record.value),
        elapsedtime: elapsedFloatTime(),
        action: record.action,
      }

      if (isRecording) {
        lesson.graphics.push(graphic)
      } else {
        lessonInStopping.graphic = graphic // 停止中に何回画像を切り替えても、直近の操作しか意味を持たない
      }
      return
    }
    case 'drawing': {
      const durationSec = record.durationMillisec * 0.001
      const newDrawing = {
        elapsedtime: elapsedFloatTimeFromDuration(durationSec),
        durationSec: parseFloat((record.durationMillisec * 0.001).toFixed(3)),
        action: record.action,
      }

      if (record.action === 'draw') {
        newDrawing.strokes = record.value
      }

      if (isRecording) {
        lesson.drawings.push(newDrawing)
      } else {
        newDrawing.durationSec = 0
        lessonInStopping.drawings.push(newDrawing)
      }
      return
    }
    }
  }

  function elapsedFloatTimeFromDuration(durationSec) {
    return parseFloat((realElapsedTime() - durationSec).toFixed(3))
  }

  function elapsedFloatTime() {
    return parseFloat(realElapsedTime().toFixed(3))
  }

  function finishRecording(lessonID) {
    showDialog({
      title: '収録の完了',
      message: '収録を完了します。よろしいですか？',
      canDismiss: true,
      dismissName: 'キャンセル',
      callbackName: '確定',
      callback: () => {
        uploadLesson(lessonID)
      },
    })
  }

  async function uploadLesson(lessonID) {
    setIsFinishing(true)

    lesson.durationSec = elapsedFloatTime()

    post(`/lessons/${lessonID}/materials`, lesson, 'PUT')
      .then(() => {
        router.push(`/lessons/${lessonID}/edit`)
      }).catch(e => {
        setIsFinishing(false)
        showError({
          message: '収録した授業のアップロードに失敗しました。',
          original: e,
          canDismiss: true,
          dismissName: '閉じる',
          callback: () => { uploadLesson(lessonID) },
        })
        console.error(e)
      })
  }

  useEffect(() => {
    if (!isRecording) return

    if (lessonInStopping.avatarMoving) {
      lesson.avatarMovings.push(lessonInStopping.avatarMoving)
      lessonInStopping.avatarMoving = null
    }

    if (lessonInStopping.graphic) {
      const lastGraphic = lesson.graphics[lesson.graphics.length - 1]

      if (!lastGraphic) {
        lesson.graphics.push(lessonInStopping.graphic)
      } else if (lessonInStopping.graphic.id === lastGraphic.id && lessonInStopping.action != lastGraphic.action) {
        lesson.graphics.push(lessonInStopping.graphic)
      } else if (lessonInStopping.graphic.id != lastGraphic.id && lessonInStopping.action === 'show') {
        lesson.graphics.push(lessonInStopping.graphic)
      }

      lessonInStopping.graphic = null
    }

    if (lessonInStopping.drawings.length > 0) {
      lesson.drawings.push(...lessonInStopping.drawings)
      lessonInStopping.drawings = []
    }
  }, [isRecording])

  return (
    <LessonRecorderContext.Provider value={{ isRecording, setIsRecording, isFinishing, elapsedSeconds, realElapsedTime, setRecord, switchCounter, finishRecording }}>
      {children}
    </LessonRecorderContext.Provider>
  )
}

const useLessonRecorderContext = () => useContext(LessonRecorderContext)

export { LessonRecorderProvider, useLessonRecorderContext }