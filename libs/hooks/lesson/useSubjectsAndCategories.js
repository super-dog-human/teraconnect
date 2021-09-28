import { useState } from 'react'
import useSWR from 'swr'
import useFetch from '../useFetch'
import { ONE_DAY_SECONDS } from '../../constants'

export default function useSubjectsAndCategories({ setValue, handleSubjectIDSelectChange }) {
  const [subjectID, setSubjectID] = useState()
  const { fetch } = useFetch()

  const subjectsFetcher = async (sourceID) => {
    return Array.from((await fetch(sourceID)).map((sub) => ({ value: sub.id, label: sub.japaneseName })))
  }

  const categoriesFetcher = async (sourceID) => {
    const result = {}
    Array.from(await fetch(sourceID)).forEach(cat => {
      if (!result[cat.groupName]) {
        result[cat.groupName] = []
      }

      result[cat.groupName].push({
        value: cat.id,
        label: cat.name
      })
    })

    return result
  }

  const { data: subjects, subjectsError } = useSWR(
    '/subjects',
    subjectsFetcher, { dedupingInterval: ONE_DAY_SECONDS }
  )

  const { data: categories, categoriesError } = useSWR(
    subjectID ? `/categories?subject_id=${subjectID}` : '',
    categoriesFetcher, { dedupingInterval: ONE_DAY_SECONDS }
  )

  function handleSubjectChange(e) {
    if (setValue) setValue('categoryID', undefined)
    if (handleSubjectIDSelectChange) handleSubjectIDSelectChange(e)
    setSubjectID(e.target.value)
  }

  return { subjects, categories, subjectDisabled: subjectsError || !subjects, categoryDisabled: categoriesError || !categories, handleSubjectChange }
}