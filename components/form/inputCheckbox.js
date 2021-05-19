/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

const InputCheckbox = React.forwardRef(function inputCheckbox(props, ref) {
  const { id, size, borderColor, checkColor, children, ...inputProps } = props

  const pseudoCheckboxStyle = css({
    boxSizing: 'border-box',
    cursor: 'pointer',
    display: 'inline-block',
    position: 'relative',
    paddingLeft: children ? `${size * 1.5}px` : `${size}px`,
    lineHeight: `${size}px`,
    width: 'auto',
    ':before': {
      border: `1px solid ${borderColor}`,
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
      borderRight: `${size / 6}px solid ${checkColor}`,
      borderBottom: `${size / 6}px solid ${checkColor}`,
      content: '""',
      display: 'block',
      position: 'absolute',
      top: '50%',
      left: `${size / 4}px`,         // 傾けた分はみ出す
      marginTop: `-${size / 2.6}px`, // 同上
      opacity: 0,
      transform: 'rotate(45deg)',
      width: `${size / 3}px`,
      height: `${size / 2}px`,
    },
  })

  return (
    <>
      <input id={id} type="checkbox" {...inputProps} ref={ref} css={realCheckboxStyle} />
      <label css={pseudoCheckboxStyle} htmlFor={id}>{children}</label>
    </>
  )
})

const realCheckboxStyle = css({
  display: 'none',
  ':checked + label:after': {
    opacity: 1,
  }
})

export default InputCheckbox