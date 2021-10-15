import React, { useState, useEffect } from 'react'
import Select from '../../../form/select'
import Container from '../../../container'
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
    if (images.length === 0 || options.length > 0) return

    setOptions(images.map(img => (
      {
        value: img.id,
        label: img.name,
      }
    )))

    setRecord({ kind: 'backgroundImageID', value: images[0].id })
  }, [images, options.length, setOptions, setRecord])

  return (
    <ContainerSpacer top='30' left='50' right='50'>
      <Container height='25'>
        <Select size='15' options={options} onChange={handleChange} topLabel={null} color='var(--soft-white)'/>
      </Container>
    </ContainerSpacer>
  )
}