/** @jsxImportSource @emotion/react */
import React, { useRef, useState, useEffect } from 'react'
import { css } from '@emotion/core'
import { RgbaColorPicker } from 'react-colorful'
import 'react-colorful/dist/index.css'
import Flex from '../../../flex'
import Container from '../../../container'
import ContainerSpacer from '../../../containerSpacer'
import Spacer from '../../../spacer'
import Select from '../../../form/select'
import LabelButton from '../../../button/labelButton'
import PlainText from '../../../plainText'
import { useLessonRecorderContext } from '../../../../libs/contexts/lessonRecorderContext'

export default function AvatarTab({ avatars, setConfig }) {
  const initializedRef = useRef(false)
  const [selectOptions, setSelectOptions] = useState([])
  const [lightColor, setLightColor] = useState({ r: 255, g: 255, b: 255, a: 0.5 })
  const { setRecord } = useLessonRecorderContext()

  function handleAvatarChange (e) {
    const id = parseInt(e.target.value)
    setConfig({ avatar: avatars.find(a => a.id === id), playAnimation: 'true' })
    setRecord({ kind: 'avatarID', value: id })
  }

  function handleColorChange(color) {
    setLightColor(color)
    setConfig({ lightColor: color })
    setRecord({ kind: 'avatarLightColor', value: color })
  }

  function setDefaultColor() {
    handleColorChange({ r: 255, g: 255, b: 255, a: 1 })
  }

  useEffect(() => {
    if (initializedRef.current) return
    setConfig({ lightColor })
    initializedRef.current = true
  }, [setConfig, lightColor])

  useEffect(() => {
    if (avatars.length === 0 || selectOptions.length > 0) return

    setSelectOptions(avatars.map(avatar => (
      {
        value: avatar.id,
        label: avatar.name,
      }
    )))

    setConfig({ avatar: avatars[0], playAnimation: 'true' })
    setRecord({ kind: 'avatarID', value: avatars[0].id })
    setRecord({ kind: 'avatarLightColor', value: lightColor })
  }, [avatars, selectOptions.length, lightColor, setConfig, setRecord])

  return (
    <ContainerSpacer top='30' left='50' right='50'>
      <Select options={selectOptions} onChange={handleAvatarChange} topLabel={null} color='var(--soft-white)' />
      <Spacer height='40' />
      <Flex>
        <PlainText size='13' color='var(--border-gray)'>環境光</PlainText>
        <Spacer width='50' />
        <div css={pickerStyle}>
          <RgbaColorPicker color={lightColor} alpha={1.0} onChange={handleColorChange} />
          <Spacer height='5' />
          <Container height='30'>
            <LabelButton fontSize='12' color='var(--soft-white)' onClick={setDefaultColor}>
              リセット
            </LabelButton>
          </Container>
        </div>
      </Flex>
    </ContainerSpacer>
  )
}

const pickerStyle = css({
  '.react-colorful': {
    width: '130px',
    height: '130px',
  },
})