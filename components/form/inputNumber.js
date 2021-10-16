/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

const InputNumber = React.forwardRef(function inputNumber(props, ref) {
  const { size, color, textAlign, backgroundColor, borderColor, borderWidth, maxLength, ...inputProps } = props
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
    padding: '0px',
    margin: '0px',
    ':focus': {
      outline: 'none', // 入力中はカーソルが表示されるのでnoneを許容する
    },
    '::-webkit-outer-spin-button': {
      WebkitAppearance: 'none',
    },
    '::-webkit-inner-spin-button': {
      WebkitAppearance: 'none',
    },
    MozAppearance: 'textfield',
  })

  function handleChange(e) {
    if (maxLength) {
      const value = e.currentTarget.value
      if (value.length >= maxLength) {
        e.currentTarget.value = value.slice(0, maxLength)
      }
    }

    if (inputProps.onChange) {
      inputProps.onChange(e)
    }
  }

  return (
    <input type="number" {...inputProps} onChange={handleChange} ref={ref} css={bodyStyle} />
  )
})

export default InputNumber