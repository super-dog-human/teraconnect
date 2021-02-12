import { useState, useEffect } from 'react'
import { useErrorDialogContext } from '../../../contexts/errorDialogContext'
import { fetch, fetchWithAuth } from '../../../fetch'

export default function useRecordResource(token, setBgImageURL) {
  const { showError } = useErrorDialogContext()
  const [bgImages, setBgImages] = useState([])
  const [avatars, setAvatars] = useState([])
  const [bgms, setBGMs] = useState([])

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
    fetchWithAuth('/avatars', token).then(r => {
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

  function loadBackgroundMusics() {
    fetch('/background_musics').then(r => setBGMs(r)).catch(e => {
      showError({
        message: 'BGM情報の読み込みに失敗しました。',
        original: e,
        canDismiss: false,
        callback: loadBackgroundMusics,
      })
      console.error(e)
    })
  }

  useEffect(() => {
    loadBackgroundImages()
    loadAvatars()
    loadBackgroundMusics()
  }, [])


  return { bgImages, avatars, bgms }
}