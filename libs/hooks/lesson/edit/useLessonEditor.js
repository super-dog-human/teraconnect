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
  const [durationSec, setDurationSec] = useState(0)
  const [timeline, setTimeline] = useState({})
  const [voiceSynthesisConfig, setVoiceSynthesisConfig] = useState({})
  const [bgImageURL, setBgImageURL] = useState('')
  const [avatarLightColor, setAvatarLightColor] = useState([])
  const [avatars, setAvatars] = useState([])
  const [drawings, setDrawings] = useState([])
  const [graphics, setGraphics] = useState([])
  const [graphicURLs, setGraphicURLs] = useState({})
  const [embeddings, setEmbeddings] = useState([])
  const [musics, setMusics] = useState([])
  const [musicURLs, setMusicURLs] = useState({})
  const [speeches, setSpeeches] = useState([])
  const { fetchWithAuth } = useFetch()
  const { showError } = useErrorDialogContext()
  const { shiftElapsedTime, updateMaterial, deleteMaterial, lastTimeline, sortedElapsedTimes, maxDurationSecInLine, nextElapsedTime, calcTime, targetMaterial, allMaterialNames, allMaterials } =
    useLineUtils({ avatars, drawings, embeddings, graphics, musics, speeches, setAvatars, setDrawings, setEmbeddings, setGraphics, setSpeeches, setMusics, timeline })
  const { addAvatarLine, addDrawingLine, addEmbeddingLine, addGraphicLine, addMusicLine, addSpeechLine, addSpeechLineToLast } =
    useAddingLine({ lessonRef, maxDurationSecInLine, lastTimeline, targetMaterial })
  const { updateLine } = useUpdatingLine({ shiftElapsedTime, updateMaterial, targetMaterial })
  const { deleteLine } = useDeletionLine({ shiftElapsedTime, nextElapsedTime, deleteMaterial, targetMaterial, allMaterialNames })
  const { swapLine } = useSwappingLine({ lastTimeline, sortedElapsedTimes, maxDurationSecInLine, calcTime, targetMaterial, allMaterialNames })

  async function fetchResources(lesson) {
    lessonRef.current = lesson

    setDurationSec(lesson.durationSec)
    fetchMaterial({ lesson, fetchWithAuth, setVoiceSynthesisConfig, setBgImageURL, setAvatarLightColor, setAvatars, setDrawings, setEmbeddings, setGraphics, setGraphicURLs, setMusics, setSpeeches })
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

  function fetchMusicURLs() {
    fetchWithAuth('/background_musics').then(r => {
      setMusicURLs(r.reduce((acc, r) => {
        acc[r.id] = { name: r.name, url: r.url }
        return acc
      }, {}))
    }).catch(e => {
      showError({
        message: 'BGMの読み込みに失敗しました。',
        original: e,
        canDismiss: false,
        callback: fetchMusicURLs,
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
    setTimeline(createTimeline({ avatars, drawings, embeddings, graphics, musics, speeches }))
  }

  useEffect(() => {
    fetchMusicURLs()
  }, [])

  useEffect(() => {
    if (Object.keys(timeline).length === 0) return
    updateLessonDuration()
  }, [timeline])

  useEffect(() => {
    if (isLoading) return
    updateTimeline()
  }, allMaterials())

  return { lesson: lessonRef.current, fetchResources, isLoading, durationSec, timeline, voiceSynthesisConfig, setVoiceSynthesisConfig, bgImageURL, setBgImageURL,
    avatarLightColor, avatars, drawings, embeddings, graphics, graphicURLs, musics, musicURLs, setMusicURLs, speeches, setEmbeddings, setGraphics, setGraphicURLs,
    updateLine, deleteLine, swapLine, addAvatarLine, addDrawingLine, addEmbeddingLine, addGraphicLine, addMusicLine, addSpeechLine, addSpeechLineToLast }
}