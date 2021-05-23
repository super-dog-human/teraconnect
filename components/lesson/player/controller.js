/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import SeekBar from './seekBar'

export default function Controller(props) {
  const { onMouseOver, onMouseLeave, onPlayButtonClick, disabledControl, controllerInvisible, ...seekBarProps } = props

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
          <SeekBar invisible={controllerInvisible} {...seekBarProps} />
        </div>
      </div>
      }
    </>
  )
}

const playButtonStyle = css({
  width: '100%',
  height: 'calc(100% - 30px)',
})

const seekBarStyle = css({
  width: '100%',
  height: '30px',
})