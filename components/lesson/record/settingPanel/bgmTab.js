/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react'
import Select from '../../../form/select'

export default function BGMTab(props) {
  const [audio, setAudio] = useState()
  const [options, setOptions] = useState([])

  function handleClick(e) {
    const id = parseInt(e.target.value)

    audio.pause()

    if (id) {
      audio.src = props.bgms.find(b => b.id === id).url
      audio.play().catch(e => {
        if (e.name === 'NotAllowedError') {
          console.log('show play button')
        } else {
          throw e
        }
      })
    }

    props.setRecord({ bgmID: id })
  }

  function handleLoopChange(e) {
    audio.loop = e.target.checked
    props.setRecord({ bgmLoop: e.target.checked })
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
      ループ
      <input type='checkbox' onChange={handleLoopChange} />
    </>
  )
}