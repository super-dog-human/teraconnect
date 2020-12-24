/** @jsx jsx */
import React from 'react'
import { jsx, css } from '@emotion/core'
import useCategoryBySubject from './useCategoryBySubject'
import Select from '../../form/select'

const SubjectAndCategorySelector = React.forwardRef((props, ref) => {
  const [categoryDisabled, categories, handleSubjectChange] = useCategoryBySubject(props.setValue)

  return (
    <>
      <Select name="subject" ref={ ref } options={ props.subjects } onChange={ handleSubjectChange } />
      { props.errors.subject && '選択してください' }
      <Select name="category" ref={ ref } options={ categories } disabled={ categoryDisabled } />
      { props.errors.category && '選択してください' }
    </>
  )
})

export default SubjectAndCategorySelector