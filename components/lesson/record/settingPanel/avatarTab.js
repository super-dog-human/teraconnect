/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react'
import Select from '../../../form/select'
import { RgbaStringColorPicker } from 'react-colorful'
import 'react-colorful/dist/index.css'

export default function AvatarTab(props) {
  const [options, setOptions] = useState([])
  const [lightColor, setLightColor] = useState('rgba(255, 255, 255, 1)')

  function handleAvatarChange (e) {
    const id = parseInt(e.target.value)
    props.setImageURL(props.avatars.find(a => a.id === id).url)
    props.setRecord({ avatarID: id })
  }

  function handleColorChange(color) {
    setLightColor(color)
    props.setAvatarConfig({ lightColor: color })
    props.setRecord({ avatarLightColor: color })
  }

  useEffect(() => {
    // パネルが開かれるのはimageURLsのロード後
    if (props.avatars.length > 0 && options.length === 0) {
      setOptions(props.avatars.map(avatar => (
        {
          value: avatar.id,
          label: avatar.name,
        }
      )))

      props.setRecord({ avatarID: props.avatars[0].id })
      props.setRecord({ avatarLightColor: lightColor })
    }
  }, [props.avatars])

  return (
    <>
      <div>
        <span>アバター</span>
        <Select options={options} onChange={handleAvatarChange} topLabel={null}/>
        <span>アップロード</span>
      </div>
      <div>
        <span>環境光</span>
        <div css={{ backgroundColor: lightColor, width: '100px', height: '30px' }}></div>
        <RgbaStringColorPicker color={lightColor} alpha={1.0} onChange={handleColorChange} />
      </div>
    </>
  )
}