/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

const Textarea = React.forwardRef(function textarea(props, ref) {
  const { size, color, backgroundColor, borderColor, borderWidth, padding, ...inputProps } = props
  const bodyStyle = css({
    width: 'calc(100% - 2px)',
    height: '100%',
    fontSize: `${size}px`,
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