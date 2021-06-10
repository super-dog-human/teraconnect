import { useState, useRef, useEffect } from 'react'
import { useLessonEditorContext } from '../../../contexts/lessonEditorContext'
import useFetch from '../../../hooks/useFetch'

export default function useLessonUpdater({ isLoading }) {
  const { post } = useFetch()
  const [hasResourceDiff, setHasResourceDiff] = useState(false)
  const uploadableResourceRef = useRef({})
  const { durationSec, avatars, embeddings, graphics, drawings, musics, speeches } = useLessonEditorContext()

  function storeUploadableResource(resource) {
    if (isLoading) return
    uploadableResourceRef.current = { ...uploadableResourceRef.current, ...resource }
  }

  function updateToRemote() {
    const body = {}
    // bodyにそのままuploadableResourceRefが使えるはず
    // post(method: 'PATCH')

    uploadableResourceRef.current = {}
  }

  useEffect(() => {
    storeUploadableResource({ durationSec })
  }, [durationSec])

  useEffect(() => {
    storeUploadableResource({ avatars })
  }, [avatars])

  useEffect(() => {
    storeUploadableResource({ embeddings })
  }, [embeddings])

  useEffect(() => {
    storeUploadableResource({ graphics })
  }, [graphics])

  useEffect(() => {
    storeUploadableResource({ drawings })
  }, [drawings])

  useEffect(() => {
    storeUploadableResource({ musics })
  }, [musics])

  useEffect(() => {
    storeUploadableResource({ speeches })
  }, [speeches])

  useEffect(() => {
    if (Object.keys(uploadableResourceRef.current).length === 0) {
      setHasResourceDiff(false)
    } else {
      setHasResourceDiff(true)
    }
  }, [uploadableResourceRef.current])

  return { hasResourceDiff, updateToRemote }
}