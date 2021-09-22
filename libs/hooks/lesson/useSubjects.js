import { useRef, useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import useFetch from '../useFetch'
import { ONE_DAY_SECONDS } from '../../constants'

export default function useSubjects() {
  const selectRef = useRef()
  const [selectOptions, setSelectOptions] = useState([])
  const { fetch } = useFetch()
  const router = useRouter()

  const fetcher = async (url) => {
    const result = await fetch(url)
    updateOptions(result)
    return result
  }

  const { data: subjects } = useSWR('/subjects?with_categories=true', fetcher,
    { dedupingInterval: ONE_DAY_SECONDS })

  const handleSubjectChange = useCallback(e => {
    const subjectID = e.currentTarget.value
    const target = document.getElementById('subject-' + subjectID)
    if (!target) return

    const targetPosition = target.getBoundingClientRect().top
    const offset = 150 // ヘッダと検索バーの高さ分オフセットする
    const offsetPosition = window.scrollY + targetPosition - offset

    window.scrollTo({ top: offsetPosition })

    if (parseInt(router.query.subject_id) !== subjectID) {
      router.push('/categories?subject_id=' + subjectID, undefined, { shallow: true })
    }
  }, [router])

  function updateOptions(subjects) {
    setSelectOptions(subjects.map(r => ({ label: r.subject.japaneseName, value: r.subject.id })))
  }

  useEffect(() => {
    if (!subjects) return
    if (selectOptions.length > 0) return
    updateOptions(subjects)
  }, [selectOptions, subjects])

  useEffect(() => {
    if (!subjects) return

    const subjectID = parseInt(router.query.subject_id)
    if (subjectID) {
      const selectIndex = subjects.findIndex(s => s.subject.id === subjectID)
      selectRef.current.selectedIndex = selectIndex
      handleSubjectChange({ currentTarget: { value: subjectID } })
    }
  }, [selectOptions, subjects, router, handleSubjectChange])

  return { selectRef, selectOptions, subjects, handleSubjectChange }
}