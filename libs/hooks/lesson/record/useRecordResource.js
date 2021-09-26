import { useState, useCallback, useEffect } from 'react'
import { useErrorDialogContext } from '../../../contexts/errorDialogContext'
import useFetch from '../../useFetch'

export default function useRecordResource(setBgImageURL) {
  const { showError } = useErrorDialogContext()
  const [bgImages, setBgImages] = useState([])
  const [avatars, setAvatars] = useState([])
  const { fetch, fetchWithAuth }  = useFetch()

  const fetchBackgroundImages = useCallback(() => {
    fetch('/background_images').then(r => {
      setBgImages(r)
      setBgImageURL(r[0].url)
    }).catch(e => {
      showError({
        message: '背景情報の読み込みに失敗しました。',
        original: e,
        canDismiss: false,
        callback: fetchBackgroundImages,
      })
      console.error(e)
    })
  }, [fetch, setBgImageURL, showError])

  const fetchAvatars = useCallback(() => {
    fetchWithAuth('/avatars').then(r => {
      setAvatars(r)
    }).catch(e => {
      showError({
        message: 'アバター情報の読み込みに失敗しました。',
        original: e,
        canDismiss: false,
        callback: fetchAvatars,
      })
      console.error(e)
    })
  }, [fetchWithAuth, showError])

  useEffect(() => {
    fetchBackgroundImages()
    fetchAvatars()
  }, [fetchBackgroundImages, fetchAvatars])


  return { bgImages, avatars }
}