import { useState, useEffect } from 'react'
import { useErrorDialogContext } from '../../../contexts/errorDialogContext'
import { fetchMaterial }  from '../../../lessonEdit'

export default function useLessonEditor(lesson) {
  const [isLoading, setIsLoading] = useState(true)
  const [durationSec, setDurationSec] = useState()
  const [timeline, setTimeline] = useState({})
  const [avatars, setAvatars] = useState([])
  const [drawings, setDrawings] = useState([])
  const [graphics, setGraphics] = useState([])
  const [speeches, setSpeeches] = useState([])
  const { showError } = useErrorDialogContext()

  async function fetchResources() {
    fetchMaterial({ lesson, setDurationSec, setAvatars, setDrawings, setGraphics, setSpeeches })
      .then(timeline => {
        console.log(timeline)
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

  function swapLine(fromIndex, toIndex) {
    if (fromIndex === toIndex) return
    if (fromIndex === toIndex + 1) return

    setTimeline(timeline => {
      const sortedElapsedtimes = Object.keys(timeline).sort((a, b) => a - b)

      const fromElapsedtime = parseFloat(sortedElapsedtimes[fromIndex])
      const fromLine = timeline[fromElapsedtime]
      delete timeline[fromElapsedtime]

      let offsetTime
      if (fromIndex === Object.keys(timeline).length) {
        const elapsedtime = Math.max(Object.keys(fromLine).flatMap(kind => fromLine[kind].map(k => k.durationSec || 0)))
        offsetTime = elapsedtime > 0 ? elapsedtime : 1.0 // 画像の切り替えなどでdurationSecを持たないものは便宜上1秒にする
      } else {
        const nextElapsedtime = parseFloat(sortedElapsedtimes[fromIndex + 1])
        offsetTime = parseFloat((nextElapsedtime - fromElapsedtime).toFixed(3))
      }

      if (fromIndex < toIndex) {
        for(let i = fromIndex + 1; i <= toIndex; i++) {
          const elapsedtime = parseFloat(sortedElapsedtimes[i])
          const line = timeline[elapsedtime]
          delete timeline[elapsedtime]

          const newElapsedtime = parseFloat((elapsedtime - offsetTime).toFixed(3))
          timeline[newElapsedtime] = line
        }

        const lastElapsedtime = parseFloat(sortedElapsedtimes[toIndex + 1])
        const toElapsedtime = parseFloat((lastElapsedtime - offsetTime).toFixed(3))
        timeline[toElapsedtime] = fromLine
      } else {
        for(let i = toIndex + 1; i < fromIndex; i++) {
          const elapsedtime = parseFloat(sortedElapsedtimes[i])
          const line = timeline[elapsedtime]
          delete timeline[elapsedtime]

          const newElapsedtime = parseFloat((elapsedtime + offsetTime).toFixed(3))
          timeline[newElapsedtime] = line

          if (i === toIndex + 1) {
            const toElapsedtime = parseFloat((newElapsedtime - offsetTime).toFixed(3))
            timeline[toElapsedtime] = fromLine
          }
        }
      }

      return timeline
    })
  }

  function addNewLine() {
    // 自身のelapsedtimeが600.0より前なら行を追加。+10秒で追加する
  }

  function deleteLine() {

  }

  function updateLine(lineIndex, kindIndex, kind, value) {
    const newTimeline = { ...timeline }
    const elapsedTime = Object.keys(newTimeline)[lineIndex]
    newTimeline[elapsedTime][kind] = value
    setTimeline(line)

    // kindに応じて各stateも更新する
  }

  useEffect(() => {
    fetchResources()
  }, [])

  return { isLoading, durationSec, timeline, avatars, graphics, drawings, speeches, setGraphics,
    updateLine, swapLine }
}