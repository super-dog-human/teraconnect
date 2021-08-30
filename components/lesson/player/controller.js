/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import SeekBar from './seekBar'
import Flex from '../../flex'
import Spacer from '../../spacer'
import PlainText from '../../plainText'
import { floatSecondsToMinutesFormat } from '../../../libs/utils'

export default function Controller(props) {
  const { onMouseOver, onMouseLeave, onPlayButtonClick, disabledControl, controllerInvisible, playerElapsedTime, maxTime, ...seekBarProps } = props

  const bodyStyle = css({
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
    cursor: 'pointer',
  })

  return (
    <>
      {!disabledControl &&
        <div css={bodyStyle} onMouseOver={onMouseOver} onMouseLeave={onMouseLeave} className='overay-ui-z'>
          <div css={playButtonStyle} onClick={onPlayButtonClick} />
          <div css={seekBarStyle}>
            <SeekBar invisible={controllerInvisible} playerElapsedTime={playerElapsedTime} maxTime={maxTime} {...seekBarProps} />
          </div>
          {!controllerInvisible &&
            <div css={bottomButtonsStyle}>
              <Flex>
                <Spacer width='20'/>
                <PlainText size='12' color='var(--soft-white)'>
                  {floatSecondsToMinutesFormat(playerElapsedTime)} / {floatSecondsToMinutesFormat(maxTime)}
                </PlainText>
              </Flex>
            </div>
          }
        </div>
      }
    </>
  )
}

const playButtonStyle = css({
  width: '100%',
  height: 'calc(100% - 30px - 20px)',
})

const seekBarStyle = css({
  width: '100%',
  height: '30px',
})

const bottomButtonsStyle = css({
  width: '100%',
  height: '20px',
})