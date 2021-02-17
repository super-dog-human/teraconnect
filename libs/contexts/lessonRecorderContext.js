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
      const avatarMoving = {
        elapsedtime: parseFloat(realElapsedTime().toFixed(3)),
        duration: parseFloat((record.duration * 0.001).toFixed(3)),
        value: record.value,
      }

      if (isRecording) {
        lesson.avatarMovings.push(avatarMoving)
      } else {
        avatarMoving.duration = 0
        lessonInStopping.avatarMoving = avatarMoving // 停止中に複数回移動しても、直近の操作しか意味を持たない
      }
      return
    }
    case 'graphic': {
      const graphic = {
        elapsedtime: parseFloat(realElapsedTime().toFixed(3)),
        action: record.action,
        id: record.value
      }

      if (isRecording) {
        lesson.graphics.push(graphic)
      } else {
        lessonInStopping.graphic = graphic // 停止中に何回画像を切り替えても、直近の操作しか意味を持たない
      }
      return
    }
    case 'drawing': {
      const newDrawing = {
        elapsedtime: realElapsedTime().toFixed(3),
        duration: parseFloat((record.duration * 0.001).toFixed(3)),
        action: record.action,
      }

      if (record.action === 'draw') {
        newDrawing.value = record.value
      }

      if (isRecording) {
        lesson.drawings.push(newDrawing)
      } else {
        newDrawing.duration = 0
        lessonInStopping.drawings.push(newDrawing)
      }
      return
    }
    }
  }

  function finishRecording(token, lessonID) {
    showDialog({
      title: '収録の完了',
      message: '収録を完了します。よろしいですか？',
      canDismiss: true,
      dismissName: 'キャンセル',
      callbackName: '確定',
      callback: () => {
        uploadLesson(token, lessonID)
      },
    })
  }

  async function uploadLesson(token, lessonID) {
    setIsFinishing(true)

    post(`/lessons/${lessonID}/materials`, lesson, token, 'PUT')
      .then(() => {
        setIsFinishing(false)
        router.push(`/lessons/${lessonID}/edit`)
      }).catch(e => {
        setIsFinishing(false)
        showError({
          message: '収録した授業のアップロードに失敗しました。',
          original: e,
          canDismiss: true,
          dismissName: '閉じる',
          callback: () => { uploadLesson(token, lessonID) },
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