/** @jsxImportSource @emotion/react */
import React from 'react'
import { jsx, css } from '@emotion/core'
import useCategoryBySubject from './useCategoryBySubject'
import Select from '../../form/select'

const SubjectAndCategorySelector = React.forwardRef((props, ref) => {
  const [categoryDisabled, categories, handleSubjectChange] = useCategoryBySubject(props.setValue)

  return (
    <>
      <Select name="subjectID" ref={ ref } options={ props.subjects } onChange={ handleSubjectChange } />
      { props.errors.subjectID && '選択してください' }
      <Select name="categoryID" ref={ ref } options={ categories } disabled={ categoryDisabled } />
      { props.errors.categoryID && '選択してください' }
    </>
  )
})

export default SubjectAndCategorySelector