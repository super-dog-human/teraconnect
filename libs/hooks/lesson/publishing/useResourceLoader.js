import { useRef, useState, useCallback, useEffect } from 'react'
import useFetch from '../../useFetch'
import { useErrorDialogContext } from '../../../contexts/errorDialogContext'
import useSubjectsAndCategories from '../useSubjectsAndCategories'

export default function useResourceLoader({ lesson }) {
  const initializedRef = useRef(false)
  const { showError } = useErrorDialogContext()
  const [isLoading, setIsLoading] = useState(true)
  const [allLessons, setAllLessons] = useState([])
  const [allLessonOptions, setAllLessonOptions] = useState([])
  const [avatars, setAvatars] = useState([])
  const [avatarOptions, setAvatarOptions] = useState([])
  const [bgImages, setBgImages] = useState([])
  const [bgImageOptions, setBgImageOptions] = useState([])
  const [categories, setCategories] = useState([])
  const { fetch, fetchWithAuth } = useFetch()
  const { subjects, categories: fullCategories, handleSubjectChange } = useSubjectsAndCategories({})

  const setSubjectID = useCallback(async() => {
    handleSubjectChange({ target: { value: lesson.subjectID } })
  }, [handleSubjectChange, lesson.subjectID])

  const fetchLessons = useCallback(async () => {
    return fetchWithAuth('/users/me/lessons').then(r => {
      setAllLessons(r)
      setAllLessonOptions(r.filter(l => l.status === 'public' && l.id !== lesson.id).map(l => ({
        value: l.id,
        label: l.title,
      })))
    }).catch(e => {
      if (e.name === 'AbortError') return
      if (e.response?.status === 404) return
      showError({
        message: '授業情報の読み込みに失敗しました。',
        original: e,
        canDismiss: false,
        callback: fetchLessons,
      })
      console.error(e)
    })
  }, [fetchWithAuth, showError, lesson.id])

  const fetchBgImages = useCallback(async () => {
    return fetch('/background_images').then(r => {
      setBgImages(r)
      setBgImageOptions(r.map(i => ({
        value: i.id,
        label: i.name,
      })))
    }).catch(e => {
      if (e.name === 'AbortError') return
      showError({
        message: '背景情報の読み込みに失敗しました。',
        original: e,
        canDismiss: false,
        callback: fetchBgImages,
      })
      console.error(e)
    })
  }, [fetch, showError])

  const fetchAvatars = useCallback(async () => {
    return fetchWithAuth('/avatars').then(r => {
      setAvatars(r)
      setAvatarOptions(r.map(a => ({
        value: a.id,
        label: a.name,
      })))
    }).catch(e => {
      if (e.name === 'AbortError') return
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
    if (initializedRef.current) return

    initializedRef.current = true
    setSubjectID()
    Promise.all([fetchLessons(), fetchBgImages(), fetchAvatars()]).then(() => {
      setIsLoading(false)
    })
  }, [isLoading, setSubjectID, fetchLessons, fetchBgImages, fetchAvatars])

  useEffect(() => {
    if (!fullCategories) return
    setCategories(fullCategories)
  }, [fullCategories])

  return { isLoading, subjects, categories, allLessons, allLessonOptions, bgImages, bgImageOptions, avatars, avatarOptions, handleSubjectChange }
}