import { useRef, useState, useCallback, useEffect } from 'react'
import useFetch from '../../useFetch'
import { fetchFile } from '../../../fetch'
import { ZSTDDecoder } from 'zstddec'
const decoder = new ZSTDDecoder()

export default function usePlayer({ id, viewKey, showDialog }) {
  const { fetch } = useFetch()
  const lessonLoadingRef = useRef(false)
  const initialLoadingRef = useRef(false)
  const [isLoading, setIsLoading] = useState(true)
  const [lesson, setLesson] = useState()
  const [errorStatus, setErrorStatus] = useState()
  const [durationSec, setDurationSec] = useState(0)
  const [backgroundImageURL, setBackgroundImageURL] = useState('')
  const [avatars, setAvatars] = useState([])
  const [drawings, setDrawings] = useState([])
  const [embeddings, setEmbeddings] = useState([])
  const [graphics, setGraphics] = useState([])
  const [graphicURLs, setGraphicURLs] = useState({})
  const [speeches, setSpeeches] = useState([])

  const fetchLesson = useCallback(() => {
    const result = viewKey ? fetch(`/lessons/${id}?view_key=${viewKey}`) : fetch(`/lessons/${id}`)
    result.then(l => {
      document.title = `${l.author.name} の ${l.title} - TERACONNECT`
      setLesson(l)
    }).catch(e => setErrorStatus(e.response.status))
  }, [id, viewKey, fetch])

  const fetchGraphicURLs = useCallback(async graphics => {
    if (!graphics) return
    if (graphicURLs.length > 0 ) return

    const graphicIDs = Array.from(new Set(graphics.filter(g => g.action === 'show')))
    let queryParams = graphicIDs.map(g => 'ids=' + g.graphicID).join('&')
    if (lesson.viewKey) queryParams += `&view_key=${lesson.viewKey}`

    const result = await fetch(`/lessons/${lesson.id}/graphics?${queryParams}`)
    setGraphicURLs(result)
  }, [lesson?.id, lesson?.viewKey, graphicURLs, fetch])

  const fetchBody = useCallback(async () => {
    const response = await fetchFile(lesson.bodyURL)
    const compressed = new Uint8Array(await response.arrayBuffer())
    await decoder.init()
    const material = JSON.parse(new TextDecoder().decode(decoder.decode(compressed)))
    setDurationSec(material.durationSec)
    setBackgroundImageURL(material.backgroundImageURL)

    setAvatars(material.avatars || [])
    setDrawings(material.drawings || [])
    setEmbeddings(material.embeddings || [])
    setGraphics(material.graphics || [])
    setSpeeches(material.speeches || [])

    await fetchGraphicURLs(material.graphics)

    setIsLoading(false)
  }, [lesson?.bodyURL, fetchGraphicURLs])

  useEffect(() => {
    if (lessonLoadingRef.current) return
    lessonLoadingRef.current = true
    fetchLesson()
  }, [fetchLesson])

  useEffect(() => {
    if (!lesson) return
    if (initialLoadingRef.current) return
    initialLoadingRef.current = true
    if (errorStatus) {
      showDialog({
        title: '閲覧エラー',
        message: '授業が存在しないか、閲覧キーが不足しています。',
        canDismiss: false,
      })
    } else if (lesson.published === '0001-01-01T00:00:00Z') {
      showDialog({
        title: '授業の準備中',
        message: '授業を準備しています。10分ほど経ってから再度読み込んでください。',
        canDismiss: false,
      })
    } else {
      fetchBody()
    }
  }, [errorStatus, lesson, showDialog, fetchBody])

  return { lesson, isLoading, durationSec, backgroundImageURL, avatars, drawings, embeddings, graphics, speeches, graphicURLs, speechURL: lesson?.speechURL || '' }
}