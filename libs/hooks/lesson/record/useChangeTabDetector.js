import { useEffect } from 'react'
import useChangeTabDetector from '../../useChangeTabDetector'
import { useLessonRecorderContext } from '../../../contexts/lessonRecorderContext'

export default function useLessonRecordChangeTabDetector() {
  const isActive = useChangeTabDetector()
  const { isRecording, switchCounter, setIsRecording } = useLessonRecorderContext()

  useEffect(() => {
    if (isActive) return
    if (!isRecording) return

    switchCounter(false)
    setIsRecording(false)
  }, [isActive])
}