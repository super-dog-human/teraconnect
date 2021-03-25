/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

const InputText = React.forwardRef(function inputText({ size, color, backgroundColor, borderColor, borderWidth, defaultValue, maxLength, onKeyDown, onBlur, readOnly }, ref) {
  const bodyStyle = css({
    width: 'calc(100% - 2px)',
    height: '100%',
    fontSize: `${size}px`,
    lineHeight: `${size}px`,
    color,
    backgroundColor: backgroundColor ? backgroundColor : 'inherit',
    borderColor,
    borderWidth,
    borderStyle: 'solid',
    padding: '0px',
    margin: '0px',
    ':focus': {
      outline: 'none', // type=textではカーソルが表示されるのでnoneを許容する
    },
  })

  return (
    <input type="text" defaultValue={defaultValue} ref={ref} css={bodyStyle} maxLength={maxLength} onKeyDown={onKeyDown} onBlur={onBlur} readOnly={readOnly} />
  )
})

export default InputText