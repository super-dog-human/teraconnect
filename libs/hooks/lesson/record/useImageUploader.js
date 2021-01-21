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
        resizedImageDataURL(e.target.result, (imageDataURL) => {
          setImages(images =>
            [...images, { src: e.target.result, thumbnail: imageDataURL, id: Math.random().toString(32).substring(2), isUploading: true }]
          )
        })
      })
      //      uploadImage(file, i)
    })
  }

  function resizedImageDataURL(original, callback) {
    const image = new Image()
    image.src = original
    image.onload = (() => {
      const ratio = Math.min(150.0 / image.naturalWidth, 95.0 / image.naturalHeight) * window.devicePixelRatio
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      const width = image.naturalWidth * ratio
      const height = image.naturalHeight * ratio

      canvas.width = width
      canvas.height = height
      ctx.drawImage(image, 0, 0, width, height)
      callback(canvas.toDataURL())
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