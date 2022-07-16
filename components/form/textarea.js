/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/react'

const Textarea = React.forwardRef(function textarea(props, ref) {
  const { size, lineHeight, color, backgroundColor, borderColor, borderWidth, padding, ...inputProps } = props
  const bodySize = padding ? `calc(100% - 2px - ${padding * 2}px)` : 'calc(100% - 2px)'
  const bodyStyle = css({
    width: bodySize,
    height: bodySize,
    fontSize: size && `${size}px`,
    lineHeight: lineHeight && `${lineHeight}px`,
    color,
    backgroundColor: backgroundColor || 'inherit',
    borderColor,
    borderWidth,
    borderStyle: 'solid',
    padding: padding ? `${padding}px` : '0px',
    ':focus': {
      outline: 'none', // 入力中はカーソルが表示されるのでnoneを許容する
    },
  })

  return (
    <textarea {...inputProps} ref={ref} css={bodyStyle} />
  )
})

export default Textarea