import { useRef, useState, useEffect } from 'react'
import { useErrorDialogContext } from '../../../contexts/errorDialogContext'
import { fetchMaterial }  from '../../../lessonEdit'

export default function useLessonEditor() {
  const lessonRef = useRef()
  const [isLoading, setIsLoading] = useState(true)
  const [durationSec, setDurationSec] = useState()
  const [timeline, setTimeline] = useState({})
  const [voiceSynthesisConfig, setVoiceSynthesisConfig] = useState({})
  const [avatars, setAvatars] = useState([])
  const [drawings, setDrawings] = useState([])
  const [graphics, setGraphics] = useState([])
  const [musics, setMusics] = useState([])
  const [speeches, setSpeeches] = useState([])
  const { showError } = useErrorDialogContext()

  async function fetchResources(lesson) {
    lessonRef.current = lesson

    fetchMaterial({ lesson, setDurationSec, setVoiceSynthesisConfig, setAvatars, setDrawings, setGraphics, setMusics, setSpeeches })
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

  function swapLine(fromIndex, toIndex) {
    if (fromIndex === toIndex) return
    if (fromIndex === toIndex + 1) return

    setTimeline(timeline => {
      const elapsedtimes = sortedElapsedtimes(timeline)

      const fromElapsedtime = parseFloat(elapsedtimes[fromIndex])
      const fromLine = timeline[fromElapsedtime]
      delete timeline[fromElapsedtime]

      let offsetTime
      if (fromIndex === Object.keys(timeline).length) {
        const durationSec = maxDurationSecInline(fromLine)
        offsetTime = durationSec > 0 ? durationSec : 1.0 // 画像の切り替えなどでdurationSecを持たないものは便宜上1秒にする
      } else {
        const nextElapsedtime = parseFloat(elapsedtimes[fromIndex + 1])
        offsetTime = parseFloat((nextElapsedtime - fromElapsedtime).toFixed(3))
      }

      if (fromIndex < toIndex) {
        for(let i = fromIndex + 1; i <= toIndex; i++) {
          const elapsedtime = parseFloat(elapsedtimes[i])
          const line = timeline[elapsedtime]
          delete timeline[elapsedtime]

          const newElapsedtime = parseFloat((elapsedtime - offsetTime).toFixed(3))
          timeline[newElapsedtime] = line
        }

        const lastElapsedtime = parseFloat(elapsedtimes[toIndex + 1])
        const toElapsedtime = parseFloat((lastElapsedtime - offsetTime).toFixed(3))
        timeline[toElapsedtime] = fromLine
      } else {
        for(let i = toIndex + 1; i < fromIndex; i++) {
          const elapsedtime = parseFloat(elapsedtimes[i])
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

  function sortedElapsedtimes(timeline) {
    return Object.keys(timeline).sort((a, b) => a - b)
  }

  function maxDurationSecInline(line) {
    return Math.max(Object.keys(line).flatMap(kind => line[kind].map(k => k.durationSec || 0)))
  }

  function addSpeechLine() {
    setTimeline(timeline =>  {
      const elapsedtimes = sortedElapsedtimes(timeline)
      const lastElapsedtime = parseFloat(elapsedtimes[elapsedtimes.length - 1])
      const lastLine = timeline[lastElapsedtime]

      let durationSec = maxDurationSecInline(lastLine)
      if (durationSec === 0) durationSec = 1.0

      const newElapsedtime = parseFloat((lastElapsedtime + durationSec).toFixed(3))
      if (newElapsedtime > 600.0) return timeline

      const newSpeech = {
        voiceID: null,
        durationSec: 10.0,
        subtitle: '',
        caption: {},
        url: null,
        isSynthesis: !lessonRef.current.needsRecording,
        synthesisConfig: {},
      }

      setSpeeches(speeches => {
        speeches.push(newSpeech)
        return speeches
      })

      newSpeech.isFocus = true
      timeline[newElapsedtime] = { speech: [newSpeech] }

      return { ...timeline }
    })
  }

  function deleteLine(lineIndex, kindIndex, kind) {
    setTimeline(timeline => {
      const elapsedTimes = sortedElapsedtimes(timeline)
      const elapsedTime = elapsedTimes[lineIndex]
      timeline[elapsedTime][kind].splice(kindIndex, 1)

      if (timeline[elapsedTime][kind].length === 0) {
        delete timeline[elapsedTime][kind]
      }

      if (Object.keys(timeline[elapsedTime]).length === 0) {
        delete timeline[elapsedTime]
        const nextElapsedTime = parseFloat(elapsedTimes[lineIndex + 1])
        const diffElapasedTime = parseFloat((nextElapsedTime - parseFloat(elapsedTime)).toFixed(3))
        if (nextElapsedTime > 0) {
          shiftTimeline(timeline, nextElapsedTime, diffElapasedTime)
        }
      }

      return { ...timeline }
    })

    // TODO kindに応じて各stateも更新する(影響を受けた他kindも)
  }

  function shiftTimeline(timeline, startElapsedtime, offsetTime) {
    sortedElapsedtimes(timeline).map(t => parseFloat(t)).filter(t => t >= startElapsedtime)
      .forEach(elapsedtime => {
        const line = timeline[elapsedtime]
        delete timeline[elapsedtime]
        const newElapsedtime = parseFloat((elapsedtime - offsetTime).toFixed(3))
        timeline[newElapsedtime] = line
      })
  }

  function updateLine(lineIndex, kindIndex, kind, value) {
    setTimeline(timeline => {
      const elapsedTime = sortedElapsedtimes(timeline)[lineIndex]
      timeline[elapsedTime][kind][kindIndex] = value
      return { ...timeline }
    })

    // TODO kindに応じて各stateも更新する(影響を受けた他kindも)
  }

  function updateDurationSec() {
    const elapsedtimes = sortedElapsedtimes(timeline)
    const lastElapsedtime = parseFloat(elapsedtimes[elapsedtimes.length - 1])

    const durationSec = timeline[lastElapsedtime].durationSec || 0
    const totalDurationSec = parseFloat((lastElapsedtime + durationSec).toFixed(3))

    setDurationSec(totalDurationSec)
  }

  useEffect(() => {
    if (Object.keys(timeline).length === 0) return
    updateDurationSec()
  }, [timeline])


  return { fetchResources, isLoading, durationSec, timeline, voiceSynthesisConfig, setVoiceSynthesisConfig,
    avatars, graphics, setGraphics, drawings, musics, speeches, updateLine, deleteLine, swapLine, addSpeechLine }
}