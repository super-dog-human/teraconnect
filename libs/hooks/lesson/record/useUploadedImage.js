import { useState } from 'react'
import { post } from '../../../fetch'

export default function useUploadedImage(id, token) {
//  const [hasImageDragOver, setHasImageDragOver] = useState(false)
  const [imageIndex, setImageIndex] = useState()
  const [images, setImages] = useState([])

  function switchImage() {
    //    setLessonImages(url)
    // setRecord({showImage: imageID})
  }

  function uploadImages(files) {
    console.log('files: ', files)
    //  files.forEach(file => {
    //    post(file).then(r => {
    //      const result = await post('pust')
    //
    //    }).catch(e => {
    //    })
    //  })

    const file = files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e => {
      console.log(e.target.result)
    })
    // upload to GCP
    // setLessonImages
  }

  /*
  function handleAreaDragOver(e) {
    setHasImageDragOver(true)
    e.preventDefault() // これは必要
  }

  function handleAreaDragLeave() {
    setHasImageDragOver(false)
  }

  function handleAreaDrop(e) {
    setHasImageDragOver(false)
    e.preventDefault()
  }
  */

  return { imageIndex, setImageIndex, images, uploadImages }
}