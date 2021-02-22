import { useState } from 'react'
import useSWR from 'swr'
import { fetch } from '../../../fetch'

export default function useCategoryBySubject(setValue) {
  const [subjectID, setSubjectID] = useState()

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
    () => subjectID ? `/categories?subjectID=${subjectID}` : null,
    fetcher, { dedupingInterval: 86400000 }
  )

  function handleSubjectChange(e) {
    setValue('category', undefined)
    setSubjectID(e.target.value)
  }

  return { categoryDisabled: error || !categories, categories, handleSubjectChange }
}