import { useEffect } from 'react'
import useChangeTabDetector from '../../useChangeTabDetector'
import { useLessonRecorderContext } from '../../../contexts/lessonRecorderContext'
import { useDialogContext } from '../../../contexts/dialogContext'

export default function useLessonRecordChangeTabDetector() {
  const isActive = useChangeTabDetector()
  const { isRecording, switchCounter, setIsRecording } = useLessonRecorderContext()
  const { showDialog } = useDialogContext()

  useEffect(() => {
    if (isActive) return
    if (!isRecording) return

    switchCounter(false)
    setIsRecording(false)
    showDialog({
      title: '収録を停止しました',
      message: 'タブの切り替えを検出したため、収録を一時停止しました。',
      canDismiss: true,
    })

  }, [isActive])
}