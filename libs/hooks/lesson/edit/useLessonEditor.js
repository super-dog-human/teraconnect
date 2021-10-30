import { useRef, useState, useCallback, useEffect } from 'react'
import { useErrorDialogContext } from '../../../contexts/errorDialogContext'
import { createTimeline } from '../../../lessonLineUtils'
import { filterObject } from '../../../utils'
import useAddingLine from './timeline/useAddingLine'
import useUpdatingLine from './timeline/useUpdatingLine'
import useDeletionLine from './timeline/useDeletionLine'
import useSwappingLine from './timeline/useSwappingLine'
import useLineUtils from './timeline/useLineUtils'
import useFetch from '../../useFetch'
import { isExistsCache, getCache } from '../../../localStorageUtil'

export default function useLessonEditor() {
  const lessonRef = useRef({})
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [durationSec, setDurationSec] = useState(0)
  const [timeline, setTimeline] = useState({})
  const [generalSetting, setGeneralSetting] = useState({})
  const [avatars, setAvatars] = useState([])
  const [drawings, setDrawings] = useState([])
  const [graphics, setGraphics] = useState([])
  const [graphicURLs, setGraphicURLs] = useState({})
  const [embeddings, setEmbeddings] = useState([])
  const [musics, setMusics] = useState([])
  const [musicURLs, setMusicURLs] = useState({})
  const [speeches, setSpeeches] = useState([])
  const { fetchWithAuth, post } = useFetch()
  const { showError } = useErrorDialogContext()
  const { shiftElapsedTime, updateMaterial, deleteMaterial, lastTimeline, sortedElapsedTimes, maxDurationSecInLine, nextElapsedTime, nextElapsedTimeByKind, calcTime, targetMaterial, allMaterialNames, allMaterials } =
    useLineUtils({ avatars, drawings, embeddings, graphics, musics, speeches, setAvatars, setDrawings, setEmbeddings, setGraphics, setSpeeches, setMusics, timeline })
  const { addAvatarLine, addDrawingLine, addEmbeddingLine, addGraphicLine, addMusicLine, addSpeechLine, addSpeechLineToLast } =
    useAddingLine({ lessonRef, durationSec, targetMaterial })
  const { updateLine } = useUpdatingLine({ shiftElapsedTime, nextElapsedTimeByKind, updateMaterial, targetMaterial })
  const { deleteLine } = useDeletionLine({ shiftElapsedTime, nextElapsedTime, deleteMaterial, targetMaterial, allMaterialNames })
  const { swapLine } = useSwappingLine({ lastTimeline, sortedElapsedTimes, maxDurationSecInLine, calcTime, targetMaterial, allMaterialNames })

  async function fetchResources(lesson) {
    lessonRef.current = lesson

    if (isExistsCache(lesson.id)) {
      loadMaterialCaches(lesson.id, getCache)
    } else {
      fetchMaterials()
    }
  }

  async function loadMaterialCaches(lessonID, getCache) {
    await fetchAndSetGraphicURLs()

    setGeneralSetting(getCache(lessonID, 'generalSetting'))

    const avatars = getCache(lessonID, 'avatars')
    const drawings = getCache(lessonID, 'drawings')
    const graphics = getCache(lessonID, 'graphics')
    const embeddings = getCache(lessonID, 'embeddings')
    const musics = getCache(lessonID, 'musics')
    const speeches = getCache(lessonID, 'speeches')

    setAvatars(avatars)
    setDrawings(drawings)
    setGraphics(graphics)
    setEmbeddings(embeddings)
    setMusics(musics)
    setSpeeches(speeches)

    setTimeline(createTimeline({ avatars, drawings, embeddings, graphics, musics, speeches }))

    setIsInitialLoading(false)
  }

  function fetchMaterials() {
    fetchMaterial().then(timeline => {
      setTimeline(timeline)
      setIsInitialLoading(false)
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

  async function fetchMaterial() {
    const material = await fetchWithAuth(`/lessons/${lessonRef.current.id}/materials/${lessonRef.current.materialID}`)

    setGeneralSetting(filterObject(material, ['avatar', 'avatarLightColor', 'backgroundImageID', 'backgroundImageURL', 'voiceSynthesisConfig']))
    setAvatars(material.avatars || [])
    setDrawings(material.drawings || [])
    setEmbeddings(material.embeddings || [])
    setGraphics(material.graphics || [])
    setMusics(material.musics || [])

    await fetchAndSetGraphicURLs()
    await fetchAndSetSpeechWithVoice(material)
    return createTimeline(filterObject(material, ['avatars', 'drawings', 'embeddings', 'graphics', 'speeches', 'musics']))

    async function fetchAndSetSpeechWithVoice(material) {
      const conditions = [!material.speeches, lessonRef.current.needsRecording]
      if (conditions.every(v => v)) {
        const voices = await fetchWithAuth(`/voices?lesson_id=${lessonRef.current.id}`)
          .catch(e => {
            if (e.response?.status === 404) return []
            throw e
          })
        const speeches = []

        voices.forEach(v => {
          const newSpeech = {}
          newSpeech.isSynthesis = false
          newSpeech.caption = {}
          newSpeech.voiceID = v.id
          newSpeech.voiceFileKey = v.fileKey
          newSpeech.elapsedTime = v.elapsedTime
          newSpeech.durationSec = v.durationSec
          newSpeech.subtitle = v.text
          newSpeech.synthesisConfig = {}

          speeches.push({ ...newSpeech })
        })
        material.speeches = speeches
        setSpeeches(speeches)
        initialUploadSpeech(speeches)
      } else {
        setSpeeches(material.speeches || [])
      }
    }

    function initialUploadSpeech(speeches) {
      if (speeches.length === 0) return
      post(`/lessons/${lessonRef.current.id}/materials/${lessonRef.current.materialID}`, { speeches }, 'PATCH')
    }
  }

  async function fetchAndSetGraphicURLs() {
    const graphicURLs = (await fetchGraphicURLs()).reduce((acc, r) => {
      acc[r.id] = {
        url: r.url,
        isUploading: false,
      }
      return acc
    }, {})

    setGraphicURLs(graphicURLs)

    async function fetchGraphicURLs() {
      return fetchWithAuth(`/graphics?lesson_id=${lessonRef.current.id}`)
        .catch(e => {
          if (e.response?.status === 404) return []
          throw e
        })
    }
  }

  const fetchMusicURLs = useCallback(() => {
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
  }, [fetchWithAuth, showError])

  const updateLessonDuration = useCallback(() => {
    if (Object.keys(timeline).length === 0) {
      setDurationSec(0)
      return
    }

    const totalDurationSec = Math.max(...Object.keys(timeline).map(elapsedTime => {
      const maxDurationSec = Math.max(...Object.keys(timeline[elapsedTime]).map(kind => (
        Math.max(...timeline[elapsedTime][kind].map(m => m.durationSec || 0))
      )))
      return parseFloat(elapsedTime) + maxDurationSec
    }))
    setDurationSec(totalDurationSec)
  }, [timeline])

  function updateTimeline() {
    setTimeline(createTimeline({ avatars, drawings, embeddings, graphics, musics, speeches }))
  }

  useEffect(() => {
    fetchMusicURLs()
  }, [fetchMusicURLs])

  useEffect(() => {
    updateLessonDuration()
  }, [timeline, updateLessonDuration])

  useEffect(() => {
    if (isInitialLoading) return
    updateTimeline()
  }, allMaterials())

  return { isInitialLoading, lesson: lessonRef.current, fetchResources, durationSec, timeline, generalSetting, setGeneralSetting,
    avatars, drawings, embeddings, graphics, graphicURLs, musics, musicURLs, setMusicURLs, speeches, setEmbeddings, setGraphics, setGraphicURLs,
    updateLine, deleteLine, swapLine, addAvatarLine, addDrawingLine, addEmbeddingLine, addGraphicLine, addMusicLine, addSpeechLine, addSpeechLineToLast }
}