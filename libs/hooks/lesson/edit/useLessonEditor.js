import { useState, useEffect } from 'react'
import { useErrorDialogContext } from '../../../contexts/errorDialogContext'
import { fetchMaterial }  from '../../../lessonEdit'

export default function useLessonEditor(lesson) {
  const [isLoading, setIsLoading] = useState(true)
  const [timeline, setTimeline] = useState({})
  const [avatars, setAvatars] = useState([])
  const [drawings, setDrawings] = useState([])
  const [graphics, setGraphics] = useState([])
  const [speeches, setSpeeches] = useState([])
  const { showError } = useErrorDialogContext()

  async function fetchResources() {
    fetchMaterial({ lesson, setAvatars, setDrawings, setGraphics, setSpeeches })
      .then(timeline => {
        setTimeline(timeline)
        setIsLoading(false)
      }).catch(e => {
        if (e.response?.status === 404) return

        showError({
          message: '収録した授業の読み込みに失敗しました。',
          original: e,
          canDismiss: true,
          callback: fetchResources,
        })

        console.error(e)
      })
  }

  function addLine(lineIndex, kind, value) {
    // 自身のelapsedtimeが600.0より下なら行を追加。直前のdurationSecを足した値にするが、0なら+1秒で追加する
  }

  function updateLine(lineIndex, kindIndex, kind, value) {
    const newTimeline = { ...timeline }
    const elapsedTime = Object.keys(newTimeline)[lineIndex]
    newTimeline[elapsedTime][kind] = value
    setTimeline(line)

    // kindに応じて各stateも更新する
  }

  function moveLine() {

  }

  function commitMovingLine() {

  }

  function deleteLine() {

  }

  useEffect(() => {
    fetchResources()
  }, [])


  return { isLoading, timeline, avatars, graphics, drawings, speeches, setGraphics, updateLine }
}