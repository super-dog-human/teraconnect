/** @jsxImportSource @emotion/react */
import React, { useState } from 'react'
import { css } from '@emotion/core'
import InputText from '../../form/inputText'

export default function LessonEditSpeechLine({ value }) {
  const [isFocus, setIsFocus] = useState(false)

  // textをドラッグした時は親のDraggable無効にする

  function hanldeFocus() {
    setIsFocus(true)
  }

  function handleBlur() {
    setIsFocus(false)
  }

  function handleKeyDown(e) {
    if (e.keyCode != 13) return // 日本語確定以外でEnterキーを押下した場合
    console.log('次の行へ移動、なければ新規行')
  }

  const bodyStyle = css({
    backgroundColor: 'var(--bg-light-gray)',
    color: '#3c3c3c', // 他の色と揃える
    fontSize: '16px',
    lineHeight: '40px',
    [':focus']: {
      outline: 'none',
    },
    border: 'none',
    //    borderBottom: isFocus ? 'solid 1px' : 'none',
    //    //    maxWidth: ['xs', 'sm'].includes(screenClass) ? '100%' : '450px',
  })

  return (
    <InputText css={bodyStyle} defaultValue={value} onFocus={hanldeFocus} onBlur={handleBlur} onKeyDown={handleKeyDown} />
  )
}
