import React, { useState, useEffect } from 'react'
import Select from '../../../form/select'
import ContainerSpacer from '../../../containerSpacer'
import { useLessonRecorderContext } from '../../../../libs/contexts/lessonRecorderContext'

export default function BgImageTab({ images, setImageURL }) {
  const [options, setOptions] = useState([])
  const { setRecord } = useLessonRecorderContext()

  function handleChange (e) {
    const id = parseInt(e.target.value)
    setImageURL(images.find(b => b.id === id).url)
    setRecord({ kind: 'backgroundImageID', value: id })
  }

  useEffect(() => {
    // パネルが開かれるのはimageURLsのロード後
    if (images.length > 0 && options.length === 0) {
      setOptions(images.map(img => (
        {
          value: img.id,
          label: img.name,
        }
      )))

      setRecord({ kind: 'backgroundImageID', value: images[0].id })
    }
  }, [images])

  return (
    <ContainerSpacer top='30' left='50' right='50'>
      <Select options={options} onChange={handleChange} topLabel={null} color='var(--soft-white)'/>
    </ContainerSpacer>
  )
}