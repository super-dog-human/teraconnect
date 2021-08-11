/** @jsxImportSource @emotion/react */
import React, { useState, useCallback, useEffect } from 'react'
import { css } from '@emotion/core'
import PlainText from '../../../plainText'

export default function ActionLabel({ kind, action }) {
  const [label, setLabel] = useState('')

  const labelByKind = useCallback(() => {
    switch(kind) {
    case 'avatar':
      return avatarLabel()
    case 'drawing':
      return drawingLabel()
    case 'embedding':
      return embeddingLabel()
    case 'graphic':
      return graphicLabel()
    case 'music':
      return musicLabel()
    }
  }, [kind, avatarLabel, drawingLabel, embeddingLabel, graphicLabel, musicLabel])

  const avatarLabel = useCallback(() => {
    return 'アバター移動'
  }, [])

  const drawingLabel = useCallback(() => {
    switch(action) {
    case 'clear':
      return '板書のクリア'
    case 'show':
      return '板書の再表示'
    case 'hide':
      return '板書の非表示'
    }
  }, [action])

  const embeddingLabel = useCallback(() => {
    switch(action) {
    case 'show':
      return '埋め込み動画の表示'
    case 'hide':
      return '埋め込み動画の非表示'
    }
  }, [action])

  const graphicLabel = useCallback(() => {
    if (action === 'hide') {
      return '画像の非表示'
    } else {
      return ''
    }
  }, [action])

  const musicLabel = useCallback(() => {
    switch(action) {
    case 'start':
      return 'BGMの開始'
    case 'stop':
      return 'BGMの停止'
    }
  }, [action])

  useEffect(() => {
    setLabel(labelByKind())
  }, [kind, action, labelByKind])

  return (
    <div css={bodyStyle}>
      <PlainText color='var(--dark-gray)' size='14' lineHeight='55'>{label}</PlainText>
    </div>
  )
}

const bodyStyle = css({
  width: '100%',
  height: '55px',
})