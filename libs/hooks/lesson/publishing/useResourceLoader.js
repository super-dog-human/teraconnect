import { useState, useEffect } from 'react'
import useFetch from '../../useFetch'
import { useErrorDialogContext } from '../../../contexts/errorDialogContext'
import useCategoryBySubject from '../useCategoryBySubject'

export default function useResourceLoader({ lesson }) {
  const { showError } = useErrorDialogContext()
  const [isLoading, setIsLoading] = useState(true)
  const [allLessons, setAllLessons] = useState([])
  const [allLessonOptions, setAllLessonOptions] = useState([])
  const [avatars, setAvatars] = useState([])
  const [avatarOptions, setAvatarOptions] = useState([])
  const [bgImages, setBgImages] = useState([])
  const [bgImageOptions, setBgImageOptions] = useState([])
  const [subjects, setSubjects] = useState([])
  const [categories, setCategories] = useState([])
  const { fetch, fetchWithAuth } = useFetch()
  const { categories: fullCategories, handleSubjectChange } = useCategoryBySubject()

  async function fetchSubjects() {
    setSubjects(Array.from(await(fetch('/subjects'))).map((sub) => {
      return {
        value: sub.id,
        label: sub.japaneseName
      }
    }))

    handleSubjectChange({ target: { value: lesson.subjectID } })
  }

  async function fetchLessons() {
    fetchWithAuth('/users/me/lessons').then(r => {
      setAllLessons(r)
      setAllLessonOptions(r.filter(l => l.status === 'public' && l.id !== lesson.id).map(l => ({
        value: l.id,
        label: l.title,
      })))
    }).catch(e => {
      showError({
        message: '授業情報の読み込みに失敗しました。',
        original: e,
        canDismiss: false,
        callback: fetchAvatars,
      })
      console.error(e)
    })
  }

  function fetchBgImages() {
    fetch('/background_images').then(r => {
      setBgImages(r)
      setBgImageOptions(r.map(i => ({
        value: i.id,
        label: i.name,
      })))
    }).catch(e => {
      showError({
        message: '背景情報の読み込みに失敗しました。',
        original: e,
        canDismiss: false,
        callback: fetchBgImages,
      })
      console.error(e)
    })
  }

  function fetchAvatars() {
    fetchWithAuth('/avatars').then(r => {
      setAvatars(r)
      setAvatarOptions(r.map(a => ({
        value: a.id,
        label: a.name,
      })))
    }).catch(e => {
      showError({
        message: 'アバター情報の読み込みに失敗しました。',
        original: e,
        canDismiss: false,
        callback: fetchAvatars,
      })
      console.error(e)
    })
  }

  useEffect(() => {
    if (!isLoading) return

    fetchSubjects()
    fetchLessons()
    fetchBgImages()
    fetchAvatars()

    setIsLoading(false)
  }, [isLoading])

  useEffect(() => {
    if (!fullCategories) return
    setCategories(fullCategories)
  }, [fullCategories])

  return { isLoading, subjects, categories, allLessons, allLessonOptions, bgImages, bgImageOptions, avatars, avatarOptions, handleSubjectChange }
}