/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

const InputRange = React.forwardRef(function inputRange(props, ref) {
  const { color, ...inputProps } = props
  const bodyStyle = css({
    width: 'calc(100% - 2px)',
    height: '1px',
    appearance: 'none',
    background: color,
    '::-moz-range-track': {
      height: '12px',
    },
    '::-webkit-slider-thumb': {
      appearance: 'none',
      width: '12px',
      height: '12px',
      background: color,
      borderRadius: '50%',
    },
    ':active': {
      outline: 'none',
    },
    ':focus': {
      outline: '2px dotted gray',
    },
  })

  return (
    <input type="range" draggable="false" {...inputProps} ref={ref} css={bodyStyle} />
  )
})

export default InputRange