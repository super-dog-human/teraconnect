import { useRef, useState, useCallback, useEffect } from 'react'
import useFetch from '../../useFetch'
import { fetchFile } from '../../../fetch'
import { decompressZstd } from '../../../decompressUtil'

export default function usePlayer({ id, viewKey, showDialog }) {
  const { fetch } = useFetch()
  const loadedRef = useRef(false)
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
    }).catch(e => setErrorStatus(e.response?.status))
  }, [id, viewKey, fetch])

  const fetchGraphicURLs = useCallback(async graphics => {
    if (!graphics) return
    if (graphicURLs.length > 0 ) return

    const graphicIDs = Array.from(new Set(graphics.filter(g => g.action === 'show')))
    let queryParams = graphicIDs.map(g => 'ids=' + g.graphicID).join('&')
    if (lesson.viewKey) queryParams += `&view_key=${lesson.viewKey}`

    fetch(`/lessons/${lesson.id}/graphics?${queryParams}`).then(result => {
      setGraphicURLs(result)
    }).catch(e => {
      console.error(e)
      showDialog({
        title: '画像エラー',
        message: '画像の取得に失敗しました。',
        canDismiss: true,
      })
    })
  }, [lesson?.id, lesson?.viewKey, graphicURLs, fetch, showDialog])

  const fetchBody = useCallback(async () => {
    const response = await fetchFile(lesson.bodyURL)
    const material = JSON.parse(new TextDecoder().decode(await decompressZstd(await response.arrayBuffer())))
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
    fetchLesson()
  }, [fetchLesson])

  useEffect(() => {
    if (loadedRef.current) return

    if (errorStatus) {
      loadedRef.current = true

      setIsLoading(false)
      showDialog({
        title: '閲覧エラー',
        message: '授業が存在しないか、閲覧キーが不足しています。',
        canDismiss: true,
      })
    } else if (lesson?.published === '0001-01-01T00:00:00Z') {
      loadedRef.current = true

      setIsLoading(false)
      showDialog({
        title: '授業の準備中',
        message: '授業を準備しています。10分ほど経ってから再度読み込んでください。',
        canDismiss: true,
      })
    } else if (lesson) {
      loadedRef.current = true

      fetchBody()
    }
  }, [errorStatus, lesson, showDialog, fetchBody])

  function initializeLesson() {
    // 初回は必要ないが、別の授業に遷移した際に現在のデータをリセットする必要がある
    setLesson()
    setErrorStatus()
    setDurationSec(0)
    setBackgroundImageURL('')
    setAvatars([])
    setDrawings([])
    setEmbeddings([])
    setGraphics([])
    setGraphicURLs({})
    setSpeeches([])

    setIsLoading(true)
    loadedRef.current = false
  }

  return { lesson, isLoading, durationSec, backgroundImageURL, avatars, drawings, embeddings, graphics, speeches, graphicURLs, speechURL: lesson?.speechURL || '', initializeLesson }
}