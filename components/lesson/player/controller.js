/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import SeekBar from './seekBar'
import Flex from '../../flex'
import Container from '../../container'
import Spacer from '../../spacer'
import PlainText from '../../plainText'
import IconButton from '../../button/iconButton'
import { floatSecondsToMinutesFormat } from '../../../libs/utils'

export default function Controller(props) {
  const { showFullController, onMouseOver, onMouseLeave, onPlayButtonClick, disabledControl, controllerInvisible, playerElapsedTime, maxTime, showSubtitle, onSubtitleButtonClick, ...seekBarProps } = props

  const bodyStyle = css({
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
    cursor: 'pointer',
  })

  const playButtonStyle = css({
    width: '100%',
    height: showFullController ? 'calc(100% - 15px - 35px)' : 'calc(100% - 15px)',
  })

  return (
    <>
      {!disabledControl &&
        <div css={bodyStyle} onMouseOver={onMouseOver} onMouseLeave={onMouseLeave} className='overay-ui-z'>
          <div css={playButtonStyle} onClick={onPlayButtonClick} />
          <div css={seekBarStyle}>
            <SeekBar invisible={controllerInvisible} playerElapsedTime={playerElapsedTime} maxTime={maxTime} {...seekBarProps} />
          </div>
          {showFullController && !controllerInvisible &&
            <div css={bottomButtonsStyle}>
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
                  <Container height='25'>
                    <IconButton name='closed-caption' isToggle={showSubtitle} toggledBackgroundColor='gray' padding='2' onClick={onSubtitleButtonClick} />
                  </Container>
                  <Spacer width='20' />
                </Flex>
              </Flex>
            </div>
          }
        </div>
      }
    </>
  )
}

const seekBarStyle = css({
  width: '100%',
  height: '15px',
})

const bottomButtonsStyle = css({
  width: '100%',
  height: '35px',
})

const timeDisplayStyle = css({
  whiteSpace: 'nowrap',
})