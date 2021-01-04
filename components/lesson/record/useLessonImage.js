import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { post } from '../../../libs/fetch'

export default function useLessonImage(id, token) {
  const [lessonImage, setLessonImage] = useState()

  function uploadLessonImage() {
    // upload to GCP
  }


  return { lessonImage, setLessonImage, uploadLessonImage }
}