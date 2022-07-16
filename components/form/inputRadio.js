/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/creactore'

const InputRadio = React.forwardRef(function inputRadio(props, ref) {
  const { id, size, color, children, ...inputProps } = props
  const checkedCirclePx = parseInt(size * 0.5)

  const pseudoRadioButtonStyle = css({
    boxSizing: 'border-box',
    cursor: 'pointer',
    display: 'inline-block',
    position: 'relative',
    paddingLeft: children ? `${size * 1.5}px` : `${size}px`,
    lineHeight: `${size}px`,
    ':before': {
      border: `1px solid ${color}`,
      borderRadius: '50%',
      content: '""',
      display: 'block',
      position: 'absolute',
      top: '50%',
      left: 0,
      marginTop: `-${(size - 2) / 2}px`,
      width: `${size - 2}px`,
      height: `${size - 2}px`,
    },
    ':after': {
      border: 'none',
      borderRadius: '50%',
      backgroundColor: color,
      content: '""',
      display: 'block',
      position: 'absolute',
      top: '50%',
      left: `${(size - checkedCirclePx) / 2}px`,
      marginTop: `-${(checkedCirclePx - 2) / 2}px`,
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