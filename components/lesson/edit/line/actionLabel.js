/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react'
import { css } from '@emotion/core'

export default function LessonEditActionLabel({ kind, action, status=true }) {
  const [label, setLabel] = useState('')

  useEffect(() => {
    switch(kind) {
    case 'avatar':
      avatarLabel()
      return
    case 'drawing':
      drawingLabel()
      return
    case 'graphic':
      graphicLabel()
      return
    case 'music':
      musicLabel()
      return
    }
  }, [kind, action])

  function avatarLabel() {
    setLabel('アバター移動')
  }

  function drawingLabel() {
    switch(action) {
    case 'clear':
      setLabel('板書のクリア')
      return
    case 'show':
      setLabel('板書の再表示')
      return
    case 'hide':
      setLabel('板書の非表示')
      return
    }
  }

  function graphicLabel() {
    if (action === 'hide') {
      setLabel('画像の非表示')
    }
  }

  function musicLabel() {
    switch(action) {
    case 'start':
      setLabel('BGMの開始')
      return
    case 'stop':
      setLabel('BGMの停止')
      return
    }
  }

  return (
    <div css={bodyStyle}><span>{label}</span></div>
  )
}

const bodyStyle = css({
  color: 'var(--text-gray)',
  lineHeight: '55px',
  width: '100%',
  height: '55px',
})