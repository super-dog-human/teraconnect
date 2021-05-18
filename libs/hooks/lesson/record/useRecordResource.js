import { useState, useEffect } from 'react'
import { useErrorDialogContext } from '../../../contexts/errorDialogContext'
import useFetch from '../../useFetch'

export default function useRecordResource(setBgImageURL) {
  const { showError } = useErrorDialogContext()
  const [bgImages, setBgImages] = useState([])
  const [avatars, setAvatars] = useState([])
  const { fetch, fetchWithAuth }  = useFetch()

  function loadBackgroundImages() {
    fetch('/background_images').then(r => {
      setBgImages(r)
      setBgImageURL(r[0].url)
    }).catch(e => {
      showError({
        message: '背景情報の読み込みに失敗しました。',
        original: e,
        canDismiss: false,
        callback: loadBackgroundImages,
      })
      console.error(e)
    })
  }

  function loadAvatars() {
    fetchWithAuth('/avatars').then(r => {
      setAvatars(r)
    }).catch(e => {
      showError({
        message: 'アバター情報の読み込みに失敗しました。',
        original: e,
        canDismiss: false,
        callback: loadAvatars,
      })
      console.error(e)
    })
  }

  useEffect(() => {
    loadBackgroundImages()
    loadAvatars()
  }, [])


  return { bgImages, avatars }
}