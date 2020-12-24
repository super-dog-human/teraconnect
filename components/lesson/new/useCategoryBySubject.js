import { useState } from 'react'
import useSWR from 'swr'
import fetch from '../../../libs/fetch'

export default function useCategoryBySubject(setValue) {
  const [subjectID, setSubjectID] = useState()

  const fetcher = async (sourceID) => {
    const result = {}
    Array.from(await fetch(sourceID)).forEach(sub => {
      if (!result[sub.groupName]) {
        result[sub.groupName] = []
      }

      result[sub.groupName].push({
        value: sub.name,
        label: sub.name
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

  return [error || !categories, categories, handleSubjectChange]
}