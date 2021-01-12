/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react'
import Select from '../../../form/select'
import { RgbaColorPicker } from 'react-colorful'
import 'react-colorful/dist/index.css'

export default function AvatarTab({ avatars, setConfig, setRecord }) {
  const [selectOptions, setSelectOptions] = useState([])
  const [lightColor, setLightColor] = useState({ r: 255, g: 255, b: 255, a: 0.5 })

  function handleAvatarChange (e) {
    const id = parseInt(e.target.value)
    setConfig({ avatar: avatars.find(a => a.id === id) })
    setRecord({ avatarID: id })
  }

  function handleColorChange(color) {
    setLightColor(color)
    setConfig({ lightColor: color })
    setRecord({ avatarLightColor: color })
  }

  useEffect(() => {
    setConfig({ lightColor })
  }, [])

  useEffect(() => {
    if (avatars.length > 0 && selectOptions.length === 0) {
      setSelectOptions(avatars.map(avatar => (
        {
          value: avatar.id,
          label: avatar.name,
        }
      )))

      setConfig({ avatar: avatars[0] })
      setRecord({ avatarID: avatars[0].id })
      setRecord({ avatarLightColor: lightColor })
    }
  }, [avatars])

  return (
    <>
      <div>
        <span>アバター</span>
        <Select options={selectOptions} onChange={handleAvatarChange} topLabel={null}/>
        <span>アップロード</span>
      </div>
      <div>
        <span>環境光</span>
        <div css={{ backgroundColor: lightColor, width: '100px', height: '30px' }}></div>
        <RgbaColorPicker color={lightColor} alpha={1.0} onChange={handleColorChange} />
      </div>
    </>
  )
}