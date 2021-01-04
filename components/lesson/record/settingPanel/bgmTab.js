/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react'
import Select from '../../../form/select'

export default function BGMTab(props) {
  const [audio, setAudio] = useState()
  const [options, setOptions] = useState([])

  function handleClick(e) {
    audio.pause()
    audio.loop = true

    const id = parseInt(e.target.value)

    if (id) {
      audio.src = props.bgms.find(b => b.id === id).url
      audio.play()
    }

    props.setRecord({ bgmID: id })
  }

  useEffect(() => {
    setAudio(new Audio())

    if (props.bgms.length > 0 && options.length === 0) {
      setOptions(props.bgms.map(bgm => (
        {
          value: bgm.id,
          label: bgm.name,
        }
      )))
    }
  }, [props.bgms])

  return (
    <>
      <Select options={options} topLabel={'なし'} size={5} onClick={handleClick} />
      後から音量や停止時刻を変更できます。
    </>
  )
}