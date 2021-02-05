import React, { useState, useContext, useEffect } from 'react'
import useTimeCounter from '../hooks/useTimeCounter'

const LessonRecorderContext = React.createContext({
  isRecording: false,
  setIsRecording: () => {},
  elapsedSeconds: 0,
  setRecord: () => {},
  switchCounter: () => {},
})

const lessonInStopping = {
  avatarMoving: null,
  image: null,
  drawings: [],
}
const lesson = {
  avatarID: null,
  avatarLightColor: null,
  backgroundImageID: null,
  backgroundMusicID: null,
  avatarMovings: [],
  images: [],
  drawings: [],
}

const LessonRecorderProvider = ({ children }) => {
  const [isRecording, setIsRecording] = useState(false)
  const { elapsedSeconds, realElapsedTime, switchCounter } = useTimeCounter()

  function setRecord(record) {
    switch (record.kind) {
    case 'avatarID':
      lesson.avatarID = record.value
      console.log(lesson.avatarID)
      return
    case 'avatarLightColor':
      lesson.avatarLightColor = record.value
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
    case  'image': {
      const image = {
        elapsedtime: parseFloat(realElapsedTime().toFixed(3)),
        action: record.action,
        id: record.value
      }

      if (isRecording) {
        lesson.images.push(image)
      } else {
        lessonInStopping.image = image // 停止中に何回画像を切り替えても、直近の操作しか意味を持たない
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

  function finishRecording() {
    console.log('finish.', lesson)
  }

  useEffect(() => {
    if (!isRecording) return

    if (lessonInStopping.avatarMoving) {
      lesson.avatarMovings.push(lessonInStopping.avatarMoving)
      lessonInStopping.avatarMoving = null
    }

    if (lessonInStopping.image) {
      const lastImage = lesson.images[lesson.images.length - 1]

      if (lessonInStopping.image.id === lastImage.id && lessonInStopping.action != lastImage.action) {
        lesson.images.push(lessonInStopping.image)
      }
      if (lessonInStopping.image.id != lastImage.id && lessonInStopping.action === 'show') {
        lesson.images.push(lessonInStopping.image)
      }

      lessonInStopping.image = null
    }

    if (lessonInStopping.drawings.length > 0) {
      lesson.drawings.push(...lessonInStopping.drawings)
      lessonInStopping.drawings = []
    }
  }, [isRecording])

  //  const { setRecord } = useRecorder(lesson.id, token, isRecording)

  return (
    <LessonRecorderContext.Provider value={{ isRecording, setIsRecording, elapsedSeconds, realElapsedTime, setRecord, switchCounter, finishRecording }}>
      {children}
    </LessonRecorderContext.Provider>
  )
}

const useLessonRecorderContext = () => useContext(LessonRecorderContext)

export { LessonRecorderProvider, useLessonRecorderContext }