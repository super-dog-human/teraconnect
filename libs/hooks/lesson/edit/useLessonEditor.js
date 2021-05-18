import { useRef, useState, useEffect } from 'react'
import { useErrorDialogContext } from '../../../contexts/errorDialogContext'
import { fetchMaterial }  from '../../../lessonEdit'
import { createTimeline } from '../../../lessonLineUtils'
import useAddingLine from './timeline/useAddingLine'
import useUpdatingLine from './timeline/useUpdatingLine'
import useDeletionLine from './timeline/useDeletionLine'
import useSwappingLine from './timeline/useSwappingLine'
import useLineUtils from './timeline/useLineUtils'
import useFetch from '../../useFetch'

export default function useLessonEditor() {
  const lessonRef = useRef()
  const [isLoading, setIsLoading] = useState(true)
  const [durationSec, setDurationSec] = useState()
  const [timeline, setTimeline] = useState({})
  const [voiceSynthesisConfig, setVoiceSynthesisConfig] = useState({})
  const [bgImageURL, setBgImageURL] = useState('')
  const [avatars, setAvatars] = useState([])
  const [drawings, setDrawings] = useState([])
  const [graphics, setGraphics] = useState([])
  const [graphicURLs, setGraphicURLs] = useState({})
  const [musics, setMusics] = useState([])
  const [speeches, setSpeeches] = useState([])
  const { fetchWithAuth } = useFetch()
  const { showError } = useErrorDialogContext()
  const { shiftElapsedTime, updateMaterial, deleteMaterial, lastTimeline, sortedElapsedTimes, maxDurationSecInLine, nextElapsedTime, calcTime, targetMaterials, allMaterialNames, allMaterials } =
    useLineUtils({ avatars, drawings, graphics, musics, speeches, setAvatars, setDrawings, setGraphics, setSpeeches, setMusics, timeline })
  const { addSpeechLineToLast } = useAddingLine({ lessonRef, maxDurationSecInLine, lastTimeline, targetMaterials })
  const { updateLine } = useUpdatingLine({ shiftElapsedTime, updateMaterial, targetMaterials })
  const { deleteLine } = useDeletionLine({ shiftElapsedTime, nextElapsedTime, deleteMaterial, targetMaterials, allMaterialNames })
  const { swapLine } = useSwappingLine({ lastTimeline, sortedElapsedTimes, maxDurationSecInLine, calcTime, targetMaterials, allMaterialNames })

  async function fetchResources(lesson) {
    lessonRef.current = lesson

    fetchMaterial({ lesson, fetchWithAuth, setDurationSec, setVoiceSynthesisConfig, setBgImageURL, setAvatars, setDrawings, setGraphics, setGraphicURLs, setMusics, setSpeeches })
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

  function updateLessonDuration() {
    const totalDurationSec = Math.max(...Object.keys(timeline).map(elapsedTime => {
      const maxDurationSec = Math.max(...Object.keys(timeline[elapsedTime]).map(kind => (
        Math.max(...timeline[elapsedTime][kind].map(m => m.durationSec || 0))
      )))
      return parseFloat(elapsedTime) + maxDurationSec
    }))

    // タイムラインでは小数点以下の秒数を切り捨てで表示するが、合計収録時間は繰り上げで表示する
    setDurationSec(Math.round(totalDurationSec))
  }

  function updateTimeline() {
    setTimeline(createTimeline({ avatars, drawings, graphics, musics, speeches }))
  }

  useEffect(() => {
    if (Object.keys(timeline).length === 0) return
    updateLessonDuration()
  }, [timeline])

  useEffect(() => {
    if (isLoading) return
    updateTimeline()
  }, allMaterials())

  return { fetchResources, isLoading, durationSec, timeline, voiceSynthesisConfig, setVoiceSynthesisConfig, bgImageURL, setBgImageURL,
    avatars, graphics, graphicURLs, drawings, musics, speeches, setGraphics, setGraphicURLs, updateLine, deleteLine, swapLine, addSpeechLineToLast }
}