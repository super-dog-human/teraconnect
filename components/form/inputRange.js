/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

const InputRange = React.forwardRef(function inputRange(props, ref) {
  return (
    <input type="range" {...props} ref={ref} css={bodyStyle} />
  )
})

const bodyStyle = css({
  width: 'calc(100% - 2px)',
  height: '1px',
  appearance: 'none',
  '::-webkit-slider-thumb': {
    appearance: 'none',
    width: '12px',
    height: '12px',
    background: 'var(--soft-white)',
    borderRadius: '50%',
  },
  ':active': {
    outline: 'none',
  },
  ':focus': {
    outline: '2px dotted gray',
  },
})

export default InputRange