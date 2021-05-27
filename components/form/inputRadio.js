/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

const InputRadio = React.forwardRef(function inputRadio(props, ref) {
  const { id, size, color, children, ...inputProps } = props
  const checkedCirclePx = parseInt(size * 0.6)

  const pseudoRadioButtonStyle = css({
    boxSizing: 'border-box',
    cursor: 'pointer',
    display: 'inline-block',
    position: 'relative',
    paddingLeft: children ? `${size * 1.5}px` : `${size}px`,
    lineHeight: `${size}px`,
    width: 'auto',
    ':before': {
      border: `1px solid ${color}`,
      borderRadius: '50%',
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 0,
      left: 0,
      width: `${size}px`,
      height: `${size}px`,
    },
    ':after': {
      border: 'none',
      borderRadius: '50%',
      backgroundColor: color,
      content: '""',
      display: 'block',
      position: 'absolute',
      top: `calc(50% - ${(size - checkedCirclePx) / 2 + 1}px)`, // border1pxを加算
      left: `${(size - checkedCirclePx) / 2 + 1}px`,            // 同上
      opacity: 0,
      width: `${checkedCirclePx}px`,
      height: `${checkedCirclePx}px`,
    },
  })

  return (
    <>
      <input id={id} type="radio" {...inputProps} ref={ref} css={realRadioButtonStyle} />
      <label css={pseudoRadioButtonStyle} htmlFor={id}>{children}</label>
    </>
  )
})

const realRadioButtonStyle = css({
  display: 'none',
  ':checked + label:after': {
    opacity: 1,
  }
})

export default InputRadio