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
    setHasResourceDiff(true)
  }

  async function uploadToRemote() {
    const body = {}
    // bodyにそのままuploadableResourceRefが使えるはず
    // post(method: 'PATCH')

    uploadableResourceRef.current = {}
    setHasResourceDiff(false)
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

  return { hasResourceDiff, uploadToRemote }
}