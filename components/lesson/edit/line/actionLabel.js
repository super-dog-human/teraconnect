/** @jsxImportSource @emotion/react */
import React, { useState, useCallback, useEffect } from 'react'
import { css } from '@emotion/react'
import PlainText from '../../../plainText'

export default function ActionLabel({ kind, action }) {
  const [label, setLabel] = useState('')

  const avatarLabel = useCallback(() => {
    return 'アバター移動'
  }, [])

  const drawingLabel = useCallback(action => {
    switch(action) {
    case 'clear':
      return '板書のクリア'
    case 'show':
      return '板書の再表示'
    case 'hide':
      return '板書の非表示'
    }
  }, [])

  const embeddingLabel = useCallback(action => {
    switch(action) {
    case 'show':
      return '埋め込み動画の表示'
    case 'hide':
      return '埋め込み動画の非表示'
    }
  }, [])

  const graphicLabel = useCallback(action => {
    if (action === 'hide') {
      return '画像の非表示'
    } else {
      return ''
    }
  }, [])

  const musicLabel = useCallback(action => {
    switch(action) {
    case 'start':
      return 'BGMの開始'
    case 'stop':
      return 'BGMの停止'
    }
  }, [])

  const labelByKind = useCallback((kind, action) => {
    switch(kind) {
    case 'avatar':
      return avatarLabel(action)
    case 'drawing':
      return drawingLabel(action)
    case 'embedding':
      return embeddingLabel(action)
    case 'graphic':
      return graphicLabel(action)
    case 'music':
      return musicLabel(action)
    }
  }, [avatarLabel, drawingLabel, embeddingLabel, graphicLabel, musicLabel])

  useEffect(() => {
    setLabel(labelByKind(kind, action))
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