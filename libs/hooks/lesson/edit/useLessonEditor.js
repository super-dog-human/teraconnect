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
    const isTopToBottom = fromIndex < toIndex
    console.log(fromIndex, toIndex)
    /*
    const newTimeline = { ...timeline }
    const sortedElapsedtimes = Object.keys(timeline).sort((a, b) => a - b)

    const fromElapsedtime = parseFloat(sortedElapsedtimes[currentIndex])
    const toElapsedtime = parseFloat(sortedElapsedtimes[targetIndex])

    const fromLine = newTimeline[fromElapsedtime]
    console.log(fromLine)

    delete newTimeline[fromElapsedtime]
//    fromLine.elapsedtime = toElapsedtime
    newTimeline[toElapsedtime] = fromLine
*/
    /*

    const targetTimes = Object.keys(timeline)
      .map(t => parseFloat(t))
      .filter(t => inRange(fromElapsedtime, toElapsedtime, t))


    //
    // しゃべった直後に画像とかだと結局speechのdurationを採用した方が良さそう
    // speech以外は直後のelapsedtimeまでの時間でよさそう
    if (fromElapsedtime < toElapsedtime) {
      // targetTimesが照準である必要がある
      targetTimes.forEach(targetTime => {
        const target = newTimeline[targetTime]
        delete newTimeline[targetTime]
        newTimeline[target - fromLine.durationSec] = target
          // さらにkind先のelapsedtimeを更新する
      })
    } else {

    }

    console.log(fromElapsedtime, toElapsedtime)
    //    const toLine = newTimeline[toElapsedtime]
    console.log(targetTimes)
    function updateElapsedtime() {

    }

    newTimeline[toElapsedtime] = fromLine

*/
    //    setTimeline(newTimeline)

    function offsetTime() {
      /*
      if (isTopToBottom) {

      } else {


      }
      if (sortedElapsedtimes.length > currentIndex + 1) {
        const nextElapsedtime = parseFloat(sortedElapsedtimes[currentIndex + 1])
        return nextElapsedtime - toElapsedtime
      } else {
        return Math.max(Object.keys(newTimeline[toElapsedtime]).flatMap(kinds.map(k => k.durationSec || 0)))
      }
      */
    }
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