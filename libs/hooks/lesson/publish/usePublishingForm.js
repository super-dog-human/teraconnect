import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

export default function usePublishingForm(lesson) {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm()
  const { onChange: handleTitleInputChange, ...titleInputProps } = register('title', { required: !lesson.isIntroduction })
  const { onChange: handleDescriptionTextChange, ...descriptionTextProps } = register('description', { required: !lesson.isIntroduction })
  const { onChange: handleCategorySelectChange, ...categoryIDSelectProps } = register('categoryID', { required: !lesson.isIntroduction })

  useEffect(() => {
    setValue('title', lesson.title)
    setValue('description', lesson.description)
    setValue('categoryID', lesson.japaneseCategoryID) // これがないとreact-hook-formのバリデーションエラーになる
    lesson.references?.map((ref, i) => {
      setValue(`reference${i}`, ref.isbn)
    })
  }, [lesson])

  return { register, setFormValue: setValue, handleSubmit, errors, handleTitleInputChange, titleInputProps, handleDescriptionTextChange, descriptionTextProps, handleCategorySelectChange, categoryIDSelectProps }
}