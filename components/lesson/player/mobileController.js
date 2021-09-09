/** @jsxImportSource @emotion/react */
import React, { useState, useRef, useEffect } from 'react'
import { css } from '@emotion/core'
import SeekBar from './seekBar'
import Flex from '../../flex'
import Container from '../../container'
import Spacer from '../../spacer'
import PlainText from '../../plainText'
import Icon from '../../icon'
import IconButton from '../../button/iconButton'
import TransitionContainer from '../../transition/transitionContainer'
import { floatSecondsToMinutesFormat } from '../../../libs/utils'
import useTouchDeviceDetector from '../../../libs/hooks/useTouchDeviceDetector'

export default function MobileController(props) {
  const [isShowController, setIsShowController] = useState(true)
  const hideIconRef = useRef()
  const { isPlaying, isShowSubtitle, isShowFullController, onPlayButtonClick, playerElapsedTime, maxTime, onSubtitleButtonClick, ...seekBarProps } = props

  function handleBakgroundTouchEnd() {
    setIsShowController(s => !s)
  }

  function handlePlayButtonTouchStart(e) {
    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
  }

  function handlePlayButtonTouchEnd(e) {
    clearTimeout(hideIconRef.current)
    onPlayButtonClick(e)
  }

  const playBlankButtonStyle = css({
    width: '100%',
    height: isShowFullController ? 'calc(100% - 15px - 35px)' : 'calc(100% - 15px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  })

  const iconBackgroundStyle = css({
    marginTop: isShowFullController ? `${15 + 35}px` : `15px`,
    minWidth: '50px',
    minHeight: 'auto',
    width: '15%',
    height: 'auto',
  })

  const bottomButtonsStyle = css({
    background: isShowFullController && 'linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8))',
  })

  return (
    <div css={bodyStyle} className='overay-ui-z'>
      <div css={playBlankButtonStyle} onTouchEnd={handleBakgroundTouchEnd}>
        {isShowController &&
          <div css={iconBackgroundStyle}>
            <div css={statusIconStyle} onTouchStart={handlePlayButtonTouchStart} onTouchEnd={handlePlayButtonTouchEnd}>
              <Icon name={isPlaying ? 'pause' : 'play'} />
            </div>
          </div>
        }
      </div>
      <TransitionContainer isShow={isShowController} duration={100}>
        <div css={bottomButtonsStyle}>
          <div css={seekBarStyle}>
            <SeekBar invisible={false} playerElapsedTime={playerElapsedTime} maxTime={maxTime} {...seekBarProps} />
          </div>
          {isShowFullController &&
          <div css={timeAndButtonsStyle}>
            <Flex justifyContent='space-between'>
              <Flex>
                <Spacer width='20' height='15' />
                <PlainText size='12' color='var(--soft-white)'>
                  <div css={timeDisplayStyle}>
                    {floatSecondsToMinutesFormat(playerElapsedTime)} / {floatSecondsToMinutesFormat(maxTime)}
                  </div>
                </PlainText>
              </Flex>
              <Flex justifyContent='flex-end' alignItems='bottom'>
                <Container width='25' height='25'>
                  <IconButton name='closed-caption' isToggle={isShowSubtitle} toggledBackgroundColor='gray' padding='2' onClick={onSubtitleButtonClick} />
                </Container>
                <Spacer width='20' />
              </Flex>
            </Flex>
          </div>
          }
        </div>
      </TransitionContainer>
    </div>
  )
}

const bodyStyle = css({
  position: 'absolute',
  top: 0,
  width: '100%',
  height: '100%',
  cursor: 'pointer',
})

const statusIconStyle = css({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  borderRadius: '50%',
  padding: '25%',
})

const seekBarStyle = css({
  width: '100%',
  height: '15px',
})

const timeAndButtonsStyle = css({
  width: '100%',
  height: '35px',
})

const timeDisplayStyle = css({
  whiteSpace: 'nowrap',
})