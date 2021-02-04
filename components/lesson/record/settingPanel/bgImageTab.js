/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react'
import Select from '../../../form/select'
import { useLessonRecorderContext } from '../../../../libs/contexts/lessonRecorderContext'

export default function BgImageTab(props) {
  const [options, setOptions] = useState([])
  const { setRecord } = useLessonRecorderContext()

  function handleChange (e) {
    const id = parseInt(e.target.value)
    props.setImageURL(props.images.find(b => b.id === id).url)
    setRecord({ bgImageID: id })
  }

  useEffect(() => {
    // パネルが開かれるのはimageURLsのロード後
    if (props.images.length > 0 && options.length === 0) {
      setOptions(props.images.map(img => (
        {
          value: img.id,
          label: img.name,
        }
      )))

      setRecord({ bgImageID: props.images[0].id })
    }
  }, [props.images])

  return (
    <Select options={options} onChange={handleChange} topLabel={null} />
  )
}