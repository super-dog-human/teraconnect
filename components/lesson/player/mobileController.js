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
import useMobileDetector from '../../../libs/hooks/useMobileDetector'

export default function MobileController(props) {
  const isMobile = useMobileDetector()
  const [isShowController, setIsShowController] = useState(true)
  const hideIconRef = useRef()
  const { isLoading, isPlaying, isShowSubtitle, isShowFullController, onPlayButtonClick, playerElapsedTime, maxTime, onSubtitleButtonClick, ...seekBarProps } = props

  function handleBakgroundTouchEnd() {
    setIsShowController(s => !s)
  }

  function handlePlayButtonTouchStart(e) {
    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.4)'
  }

  function handlePlayButtonTouchEnd(e) {
    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)'
    clearTimeout(hideIconRef.current)
    onPlayButtonClick(e)
  }

  const bodyStyle = css({
    visibility: isLoading ? 'hidden' : 'visible',
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
    cursor: 'pointer',
  })

  const playBlankButtonStyle = css({
    width: '100%',
    height: isShowFullController ? 'calc(100% - 15px - 35px)' : 'calc(100% - 15px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  })

  const iconBackgroundStyle = css({
    marginTop: isShowFullController ? `${15 + 35}px` : `15px`,
  })

  const bottomButtonsStyle = css({
    background: isShowFullController && 'linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8))',
  })

  const statusIconStyle = css({
    width: isMobile ? '40px' : '60px',
    height: isMobile ? '40px' : '60px',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '50%',
    padding: isMobile ? '25px' : '30px',
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