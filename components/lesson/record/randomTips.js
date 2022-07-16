/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/react'
import ContainerSpacer from '../../containerSpacer'
import PlainText from '../../plainText'

const RandomTips = () => (
  <div css={backgroundStyle}>
    <ContainerSpacer top='50' left='30' right='30'>
      <div>
        <PlainText size='18' color='gray'>TIPS</PlainText>
      </div>
      <div>
        <PlainText size='15' color='gray'>背景に合わせて環境光の色合いを調節すると、アバターの表示が自然になります。</PlainText>
      </div>
    </ContainerSpacer>
  </div>
)

export default RandomTips

const backgroundStyle = css({
  width: '100%',
  minHeight: '150px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})