import { useState, useEffect } from 'react'
import { fetch, fetchWithAuth } from '../../../libs/fetch'

export default function useRecordResource(token, setBgImageURL, setAvatarConfig) {

  const [bgImages, setBgImages] = useState([])
  const [avatars, setAvatars] = useState([])
  const [bgms, setBGMs] = useState([])

  useEffect(() => {
    fetch('/background_images').then(r => {
      setBgImages(r)
      setBgImageURL(r[0].url)
    })

    fetchWithAuth('/avatars', token).then(r => {
      setAvatars(r)
      setAvatarConfig({ url: r[0].url })
    })

    fetch('/background_musics').then(r => setBGMs(r))
  }, [])


  return { bgImages, avatars, bgms }
}