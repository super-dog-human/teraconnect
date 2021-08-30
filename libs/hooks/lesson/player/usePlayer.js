import { useRef, useState, useCallback, useEffect } from 'react'
import useFetch from '../../useFetch'
import { fetchFile } from '../../../fetch'
import { ZSTDDecoder } from 'zstddec'
const decoder = new ZSTDDecoder()

export default function usePlayer({ lesson, errorStatus, showDialog }) {
  const { fetch } = useFetch()
  const initialLoadingRef = useRef(false)
  const [isLoading, setIsLoading] = useState(true)
  const [durationSec, setDurationSec] = useState(0)
  const [backgroundImageURL, setBackgroundImageURL] = useState('')
  const [avatars, setAvatars] = useState([])
  const [graphics, setGraphics] = useState([])
  const [graphicURLs, setGraphicURLs] = useState({})
  const [drawings, setDrawings] = useState([])

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
    setGraphics(material.graphics || [])

    await fetchGraphicURLs(material.graphics)

    setIsLoading(false)
  }, [lesson?.bodyURL, fetchGraphicURLs])

  useEffect(() => {
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
  }, [errorStatus, lesson?.updated, lesson?.published, showDialog, fetchBody])

  return { isLoading, durationSec, backgroundImageURL, avatars, graphics, drawings, graphicURLs, speechURL: lesson?.speechURL || '' }
}