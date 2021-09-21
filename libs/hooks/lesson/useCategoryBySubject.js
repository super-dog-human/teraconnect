import { useState } from 'react'
import useSWR from 'swr'
import useFetch from '../useFetch'
import { ONE_DAY_SECONDS } from '../../constants'

export default function useCategoryBySubject(setValue) {
  const [subjectID, setSubjectID] = useState()
  const { fetch } = useFetch()

  const fetcher = async (sourceID) => {
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

  const { data: categories, error } = useSWR(
    subjectID ? `/categories?subject_id=${subjectID}` : '',
    fetcher, { dedupingInterval: ONE_DAY_SECONDS }
  )

  function handleSubjectChange(e) {
    if (setValue) setValue('category', undefined)
    setSubjectID(e.target.value)
  }

  return { categoryDisabled: error || !categories, categories, handleSubjectChange }
}