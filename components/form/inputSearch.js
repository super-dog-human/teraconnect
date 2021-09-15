/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

const InputSearch = React.forwardRef(function inputSearch(props, ref) {
  const { size, color, textAlign, backgroundColor, borderColor, borderWidth, padding, ...inputProps } = props
  const bodyStyle = css({
    '::-webkit-search-cancel-button': {
      WebkitAppearance: 'none'
    },
    webkitAppearance: 'none',
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
    padding: padding ? `${padding}px` : '0px',
    margin: '0px',
    ':focus': {
      outline: 'none', // 入力中はカーソルが表示されるのでnoneを許容する
    },
  })

  return (
    <input type="search" ref={ref} css={bodyStyle} {...inputProps} />
  )
})

export default InputSearch