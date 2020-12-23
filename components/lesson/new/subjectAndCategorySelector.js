/** @jsx jsx */
import React from 'react'
import { jsx, css } from '@emotion/core'
import useCategoryBySubject from './useCategoryBySubject'
import Select from '../../form/select'

export default function SubjectAndCategorySelector(props) {
  const [categoryDisabled, categories, handleSubjectChange] = useCategoryBySubject(props.setValue)

  return (
    <>
      <Select name="subject" ref={ props.register({ required: true }) } options={ props.subjects } onChange={ handleSubjectChange } />
      { props.errors.subject && '選択してください' }
      <Select name="category" ref={ props.register({ required: true }) } options={ categories } disabled={ categoryDisabled } />
      { props.errors.category && '選択してください' }
    </>
  )
}