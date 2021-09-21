import { useState, useEffect } from 'react'
import useSWR from 'swr'
import useFetch from '../useFetch'
import { ONE_DAY_SECONDS } from '../../constants'

export default function useSubjects() {
  const [selectOptions, setSelectOptions] = useState([])
  const { fetch } = useFetch()

  const fetcher = async (url) => {
    const result = await fetch(url)
    updateOptions(result)
    return result
  }

  const { data: subjects } = useSWR('/subjects?with_categories=true', fetcher,
    { dedupingInterval: ONE_DAY_SECONDS })

  function handleSubjectChange(e) {
    const target = document.getElementById('subject-head-' + e.currentTarget.value)
    const targetPosition = target.getBoundingClientRect().top
    const offset = 150 // ヘッダと検索バーの高さ分オフセットする
    const offsetPosition = window.scrollY + targetPosition - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    })
  }

  function updateOptions(subjects) {
    setSelectOptions(subjects.map(r => ({ label: r.subject.japaneseName, value: r.subject.id })))
  }

  useEffect(() => {
    if (!subjects) return
    if (selectOptions.length > 0) return
    updateOptions(subjects)
  }, [selectOptions, subjects])

  return { selectOptions, subjects, handleSubjectChange }
}