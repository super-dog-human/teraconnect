/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import Container from '../container'
import Aspect16To9Container from '../aspect16To9Container'
import Spacer from '../spacer'
import PlainText from '../plainText'
import ContainerSpacer from '../containerSpacer'

const PickupedLesson = () => (
  <div css={containerStyle}>
    <div css={bodyStyle}>
      <Spacer height='90'/>

      <ContainerSpacer left='30' right='30'>
        <PlainText size='24' letterSpacing='1' whiteSpace='nowrap'>
          見やすさは、分かりやすさ。
        </PlainText>
      </ContainerSpacer>

      <ContainerSpacer left='10' right='10'>
        <hr size="1" color="#86bacc" width="100%" />
      </ContainerSpacer>

      <ContainerSpacer left='30' right='30'>
        <PlainText size='13'>
          ノイズが乗らない・ギガが減らない<PlainText size='8'>※</PlainText>授業を、ブラウザからすぐに見よう。
        </PlainText>
        <div>
          <PlainText size='10'>
            ※一般的な動画形式に比べて通信量を約1/10に低減。
          </PlainText>
        </div>
      </ContainerSpacer>

      <div css={thumbnailStyle}>
        <Container maxWidth='650'>
          <Aspect16To9Container />
        </Container>
      </div>

      <Spacer height='100'/>
    </div>
  </div>
)

const containerStyle = css({
  width: '100%',
  backgroundColor: 'var(--dark-gray)',
  display: 'flex',
  justifyContent: 'center',
})

const bodyStyle = css({
  width: '100%',
  maxWidth: '1280px',
  color: 'var(--soft-white)',
})

const thumbnailStyle = css({
  maxWidth: '650px',
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: '70px'
})

export default PickupedLesson