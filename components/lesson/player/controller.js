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
import FadeOutContainer from '../../fadeOutContainer'
import TransitionContainer from '../../transitionContainer'
import MobileController from './mobileController'
import { floatSecondsToMinutesFormat } from '../../../libs/utils'
import useTouchDeviceDetector from '../../../libs/hooks/useTouchDeviceDetector'

export default function Controller(props) {
  const [isShowIcon, setIsShowIcon] = useState(false)
  const [isShowController, setIsShowController] = useState(isTouchDevice)
  const hideIconRef = useRef()
  const isTouchDevice = useTouchDeviceDetector()
  const { isPlaying, isShowSubtitle, isShowFullController, onPlayButtonClick, playerElapsedTime, maxTime, onSubtitleButtonClick, ...seekBarProps } = props

  function handleMouseOver() {
    setIsShowController(true)
  }

  function handleMouseLeave() {
    setIsShowController(false)
  }

  function handlePlayButtonClick(e) {
    clearTimeout(hideIconRef.current)
    if (isPlaying) setIsShowIcon(true)
    onPlayButtonClick(e)
  }

  useEffect(() => {
    if (isPlaying) return
    hideIconRef.current = setTimeout(() => {
      setIsShowIcon(false)
    }, 500) // ボタンのフェードアウトが十分に完了してから非表示にする
  }, [isPlaying])

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
    width: '7%',
    height: 'auto',
  })

  const bottomButtonsStyle = css({
    background: isShowFullController && 'linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8))',
  })

  return (
    <>
      {isTouchDevice && <MobileController {...props} />}
      {!isTouchDevice &&
        <div css={bodyStyle} onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave} className='overay-ui-z'>
          <div css={playBlankButtonStyle} onClick={handlePlayButtonClick}>
            <div css={iconBackgroundStyle}>
              {isShowIcon &&
                <FadeOutContainer isShow={isShowIcon} duration={300}>
                  <div css={statusIconStyle}>
                    <Icon name='pause' />
                  </div>
                </FadeOutContainer>
                }
            </div>
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
      }
    </>
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
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  borderRadius: '50%',
  padding: '25%',
  display: 'flex',
  alignItems: 'center',
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