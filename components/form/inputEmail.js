/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/react'

const InputEmail = React.forwardRef(function inputEmail(props, ref) {
  const { size, color, textAlign, backgroundColor, borderColor, borderWidth, padding, ...inputProps } = props
  const bodyStyle = css({
    WebkitAppearance: 'none',
    width: 'calc(100% - 2px)',
    height: '100%',
    fontSize: `${size}px`,
    lineHeight: `${size}px`,
    textAlign,
    color,
    backgroundColor: backgroundColor || 'inherit',
    borderColor,
    borderWidth,
    borderStyle: 'solid',
    borderRadius: 0,
    padding: padding ? `${padding}px` : '0px',
    margin: '0px',
    ':focus': {
      outline: 'none', // 入力中はカーソルが表示されるのでnoneを許容する
    },
  })

  return (
    <input type="email" ref={ref} css={bodyStyle} {...inputProps} />
  )
})

export default InputEmail