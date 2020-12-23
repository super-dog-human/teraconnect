import { useState } from 'react'
import fetch from '../../../libs/fetch'

export default function useCategoryBySubject(setValue) {
  const [categoryDisabled, setCategoryDisabled] = useState(true)
  const [categories, setCategories] = useState([])

  async function handleSubjectChange(e) {
    setValue('category', undefined)

    const subjectID = e.target.value

    if (!subjectID) {
      setCategories([])
      setCategoryDisabled(true)
      return
    }

    const results = {}
    Array.from(await(fetch(`/categories?subjectID=${subjectID}`))).forEach(sub => {
      if (!results[sub.groupName]) {
        results[sub.groupName] = []
      }

      results[sub.groupName].push({
        value: sub.name,
        label: sub.name
      })
    })

    setCategories(results)
    setCategoryDisabled(false)
  }

  return [categoryDisabled, categories, handleSubjectChange]
}