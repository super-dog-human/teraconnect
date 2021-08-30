/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import PlainText from '../../plainText'
import TransitionContainer from '../../transitionContainer'
import ContainerSpacer from '../../containerSpacer'

export default function TitleBar({ isPlaying, controllerInvisible, title }) {
  return (
    <div css={containerStyle} className='overay-ui-z'>
      <TransitionContainer isShow={!isPlaying && !controllerInvisible} duration={100}>
        <div css={bodyStyle}>
          <PlainText color='var(--soft-white)'>
            <ContainerSpacer left='20' right='20'>
              {title}
            </ContainerSpacer>
          </PlainText>
        </div>
      </TransitionContainer>
    </div>
  )
}

const containerStyle = css({
  position: 'absolute',
  top: 0,
  width: '100%',
  height: '100%',
  cursor: 'pointer',
})

const bodyStyle = css({
  width: '100%',
  minHeight: '50px',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
})