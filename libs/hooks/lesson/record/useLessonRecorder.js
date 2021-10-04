import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import useTimeCounter from '../../useTimeCounter'
import { useDialogContext } from '../../../contexts/dialogContext'
import { useErrorDialogContext } from '../../../contexts/errorDialogContext'
import useFetch from '../../useFetch'
import { reCalcDrawingsTime } from '../../../drawingUtils'

export default function useLessonRecorder() {
  const router = useRouter()
  const lessonInStoppingRef = useRef({
    avatarMoving: null,
    graphic: null,
    drawings: [],
  })
  const lessonRef = useRef({
    durationSec: 0,
    avatarID: null,
    avatarLightColor: null,
    backgroundImageID: null,
    avatars: [],
    graphics: [],
    drawings: [],
    musics: [],
  })
  const [isRecording, setIsRecording] = useState(false)
  const [isFinishing, setIsFinishing] = useState(false)
  const { elapsedSeconds, realElapsedTime, switchCounter } = useTimeCounter()
  const { showDialog } = useDialogContext()
  const { showError } = useErrorDialogContext()
  const { post } = useFetch()

  function setRecord(record) {
    switch (record.kind) {
    case 'avatarID':
      lessonRef.current.avatarID = record.value
      return
    case 'avatarLightColor':
      lessonRef.current.avatarLightColor = Object.values(record.value).join(',')
      return
    case 'backgroundImageID':
      lessonRef.current.backgroundImageID = record.value
      return
    case 'backgroundMusicID':
      lessonRef.current.musics = [{
        elapsedTime: 0,
        action: 'start',
        backgroundMusicID: record.value
      }]
      return
    case 'avatarMoving': {
      const durationSec = record.durationMillisec * 0.001
      const avatar = {
        elapsedTime: elapsedFloatTimeFromDuration(durationSec),
        durationSec: parseFloat(durationSec.toFixed(3)),
        positions: record.value,
      }

      if (isRecording) {
        lessonRef.current.avatars.push(avatar) // 配列中にオブジェクトを一つ持つフォーマットにしている
      } else {
        avatar.durationSec = 0
        lessonInStoppingRef.current.avatarMoving = avatar // 停止中に複数回移動しても、直近の操作しか意味を持たない
      }
      return
    }
    case 'graphic': {
      const graphic = {
        graphicID: parseInt(record.value),
        elapsedTime: elapsedFloatTime(),
        action: record.action,
      }

      if (isRecording) {
        lessonRef.current.graphics.push(graphic)
      } else {
        lessonInStoppingRef.current.graphic = graphic // 停止中に何回画像を切り替えても、直近の操作しか意味を持たない
      }
      return
    }
    case 'drawing': {
      const newDrawing = { action: record.action }

      if (record.action === 'draw') {
        const durationSec = record.durationMillisec * 0.001
        newDrawing.elapsedTime = isRecording ? realElapsedTime() - durationSec : realElapsedTime()
        newDrawing.durationSec = isRecording ? durationSec : 0
        newDrawing.stroke = record.value
      } else if (record.action === 'undo') {
        newDrawing.elapsedTime = elapsedFloatTime()
        newDrawing.durationSec = 0
      } else {
        newDrawing.elapsedTime = elapsedFloatTime()
      }

      if (isRecording) {
        lessonRef.current.drawings.push(newDrawing)
      } else {
        newDrawing.durationSec = 0
        lessonInStoppingRef.current.drawings.push(newDrawing)
      }
      return
    }}
  }

  function elapsedFloatTimeFromDuration(durationSec) {
    return parseFloat((realElapsedTime() - durationSec).toFixed(3))
  }

  function elapsedFloatTime() {
    return parseFloat(realElapsedTime().toFixed(3))
  }

  function finishRecording(lessonID) {
    showDialog({
      title: '授業収録',
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

    lessonRef.current.durationSec = elapsedFloatTime()
    lessonRef.current.drawings = reCalcDrawingsTime(lessonRef.current.drawings)

    post(`/lessons/${lessonID}/materials`, lessonRef.current, 'PATCH')
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

    if (lessonInStoppingRef.current.avatarMoving) {
      lessonInStoppingRef.current.avatarMoving.durationSec = 0 // 停止中に移動したので移動に要した時間は0になる
      lessonInStoppingRef.current.avatarMoving.elapsedTime = elapsedFloatTime()
      lessonRef.current.avatars.push(lessonInStoppingRef.current.avatarMoving)
      lessonInStoppingRef.current.avatarMoving = null
    }

    if (lessonInStoppingRef.current.graphic) {
      const lastGraphic = lessonRef.current.graphics[lessonRef.current.graphics.length - 1]

      if (!lastGraphic) {
        lessonRef.current.graphics.push(lessonInStoppingRef.current.graphic)
      } else if (lessonInStoppingRef.current.graphic.id === lastGraphic.id && lessonInStoppingRef.current.action !== lastGraphic.action) {
        lessonRef.current.graphics.push(lessonInStoppingRef.current.graphic)
      } else if (lessonInStoppingRef.current.graphic.id != lastGraphic.id && lessonInStoppingRef.current.action === 'show') {
        lessonRef.current.graphics.push(lessonInStoppingRef.current.graphic)
      }

      lessonInStoppingRef.current.graphic = null
    }

    if (lessonInStoppingRef.current.drawings.length > 0) {
      lessonRef.current.drawings.push(...lessonInStoppingRef.current.drawings)
      lessonInStoppingRef.current.drawings = []
    }
  }, [isRecording])

  return { isRecording, setIsRecording, isFinishing, elapsedSeconds, realElapsedTime, setRecord, switchCounter, finishRecording }
}