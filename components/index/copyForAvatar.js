/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import PlainText from '../plainText'
import ContainerSpacer from '../containerSpacer'

export default function CopyForAvatar() {
  return (
    <div css={bodyStyle}>
      <div css={copyStyle}>
        <ContainerSpacer top='380' left='20'>
          <PlainText color='var(--soft-white)' size='20' fontFamily='serif' fontWeight='100'>
            きみの光を探そう。
          </PlainText>
        </ContainerSpacer>
      </div>
    </div>
  )
}

const bodyStyle = css({
  width: '100%',
  height: '450px',
  display: 'flex',
  position: 'absolute',
  top: 0,
  justifyContent: 'center',
})

const copyStyle = css({
  width: '100%',
  maxWidth: '500px',
})