/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

const InputRange = React.forwardRef(function inputRange({ defaultValue='0', max='0', min='0', step='1', onChange, readOnly }, ref) {
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

  return (
    <input type="range" defaultValue={defaultValue} max={max} min={min} step={step} ref={ref} onChange={onChange} readOnly={readOnly} css={bodyStyle} />
  )
})

export default InputRange