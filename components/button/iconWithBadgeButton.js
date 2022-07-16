/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/react'
import Icon from '../icon'
import AbsoluteContainer from '../absoluteContainer'
import Container from '../container'
import LoadingIndicator from '../loadingIndicator'
import PlainText from '../plainText'
import AlignContainer from '../alignContainer'
import useTouchDeviceDetector from '../../libs/hooks/useTouchDeviceDetector'

export default function IconWithBadgeButton({ name, padding, showBadge, badgeColor, badgeNum, badgeNumColor, disabled, isProcessing, onClick, onMouseDown }) {
  const isTouchDevice = useTouchDeviceDetector()
  const bodyStyle = css({
    display: 'block',
    position: 'relative',
    width: '100%',
    height: '100%',
    padding: padding ? `${padding}px` : '0px',
    fontSize: 0,
    'img': {
      opacity: !isTouchDevice && 0.7,
    },
    ':hover img': {
      opacity: !disabled && 1,
    },
    ':disabled': {
      cursor: 'default',
    },
  })

  return (
    <button onClick={onClick} onMouseDown={onMouseDown} disabled={disabled} css={bodyStyle}>
      {!isProcessing &&
        <>
          <Icon name={name} disabled={disabled} />
          {showBadge &&
              <AbsoluteContainer top='0' right='0'>
                <Container width='20' height='20'>
                  <svg className='badge' viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                    <circle cx="50" cy="50" r="30" fill={badgeColor || 'var(--error-red)'} />
                  </svg>
                </Container>
              </AbsoluteContainer>
          }
          {showBadge && badgeNum &&
            <AbsoluteContainer top='0' right='0'>
              <Container width='20' height='20'>
                <AlignContainer textAlign='center' verticalAlign='middle'>
                  <PlainText size='10' lineHeight='20' color={badgeNumColor || 'var(--soft-white)'} fontWeight='bold'>{badgeNum}</PlainText>
                </AlignContainer>
              </Container>
            </AbsoluteContainer>
          }
        </>
      }
      {isProcessing && <LoadingIndicator size='80' color='white' />}
    </button>
  )
}