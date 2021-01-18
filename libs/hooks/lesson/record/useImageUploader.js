import { useState } from 'react'
import { post } from '../../../fetch'

export default function useImageUploader(id, token, setImages, inputFileRef) {
  // onAnimationEnd

  function handleDragOver() {
    // 表示変える
  }

  function handleDragLeave() {

  }

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
    Array.from(files).forEach((file, i) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (e => {
        setImages(images =>
          [...images, { src: e.target.result, key: i + 1, isUploading: true }]
        ) // await的なの必要？
      })
    })

    //  files.forEach(file => {
    //    post(file).then(r => {
    //      const result = await post('pust')
    //
    //    }).catch(e => {
    //    })
    //  })
    // keyをIDで再セットした方がよさそう


    // upload to GCP
    // setLessonImages
  }

  return { handleDragOver, handleDragLeave, handleDrop, handleChangeFile, handleUploadButtonClick }
}