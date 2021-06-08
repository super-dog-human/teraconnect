/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

const InputNumber = React.forwardRef(function inputNumber(props, ref) {
  const { size, color, backgroundColor, borderColor, borderWidth, ...inputProps } = props
  const bodyStyle = css({
    width: 'calc(100% - 2px)',
    height: '100%',
    fontSize: `${size}px`,
    lineHeight: `${size}px`,
    color,
    backgroundColor,
    borderColor,
    borderWidth,
    borderStyle: 'solid',
    padding: '0px',
    margin: '0px',
    ':focus': {
      outline: 'none', // 入力中はカーソルが表示されるのでnoneを許容する
    },
  })

  return (
    <input type="number" {...inputProps} ref={ref} css={bodyStyle} />
  )
})

export default InputNumber