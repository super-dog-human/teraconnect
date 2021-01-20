import { useState } from 'react'
import { post } from '../../../fetch'

export default function useImageUploader(id, token, setImages, inputFileRef) {
  function handleDrop(e) {
    uploadImages(e.dataTransfer.files)
  }

  function handleChangeFile(e) {
    uploadImages(e.target.files)
    e.target.value = '' // ここでリセットしちゃって大丈夫？
  }

  function handleUploadButtonClick() {
    inputFileRef.current.click()
  }

  function uploadImages(files) {
    // filter enable image formats.

    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (e => {
        setImages(images =>
          [...images, { src: e.target.result, id: Math.random().toString(32).substring(2), isUploading: true }]
        )
      })
      //      uploadImage(file, i)
    })
  }

  function uploadImage(file, index) {
    post(file).then(r => {
      setImages(images => {
        const newImages = [...images]
        newImages[index].id = r.id
        return newImages
      })
    }).catch(e => {
      console.log(e)
    })

    // upload to GCP
    // setLessonImages
  }

  return { handleDrop, handleChangeFile, handleUploadButtonClick }
}