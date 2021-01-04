/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react'
import Select from '../../../form/select'

export default function BgImageTab(props) {
  const [options, setOptions] = useState([])

  function handleChange (e) {
    const id = parseInt(e.target.value)
    props.setImageURL(props.images.find(b => b.id === id).url)
    props.setRecord({ bgImageID: id })
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

      props.setRecord({ bgImageID: props.images[0].id })
    }
  }, [props.images])

  return (
    <Select options={options} onChange={handleChange} topLabel={null} />
  )
}