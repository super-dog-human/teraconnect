import { useState, useEffect } from 'react'
import { useErrorDialogContext } from '../../../contexts/errorDialogContext'
import { fetchMaterial}  from '../../../lessonEdit'

export default function useLessonEditor(lesson) {
  const [isLoading, setIsLoading] = useState(true)
  const [timeline, setTimeline] = useState({})
  const [graphics, setGraphics] = useState([])
  const [drawings, setDrawings] = useState([])
  const [speeches, setSpeeches] = useState([])
  const { showError } = useErrorDialogContext()

  async function fetchResources() {
    fetchMaterial({ lesson, setGraphics, setDrawings, setSpeeches, setTimeline })
      .then(() => {
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

  function addLine(e) {
    // 自身のelapsedtimeが600.0より下なら行を追加。直前のdurationSecを足した値にするが、0なら+1秒で追加する
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

  return { isLoading, timeline, graphics, setGraphics, drawings, setDrawings, speeches, setSpeeches }
}