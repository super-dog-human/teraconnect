/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

const InputTel = React.forwardRef(function inputTel(props, ref) {
  const { size, color, backgroundColor, borderColor, borderWidth, onlyNumeric, ...inputProps } = props
  const bodyStyle = css({
    width: 'calc(100% - 2px)',
    height: '100%',
    fontSize: `${size}px`,
    lineHeight: `${size}px`,
    color,
    backgroundColor: backgroundColor || 'inherit',
    borderColor,
    borderWidth,
    borderStyle: 'solid',
    padding: '0px',
    margin: '0px',
    ':focus': {
      outline: 'none', // 入力中はカーソルが表示されるのでnoneを許容する
    },
  })

  function handleChange(e) {
    if (onlyNumeric) {
      e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '')
    }

    if (inputProps.onChange) {
      inputProps.onChange(e)
    }
  }

  return (
    <input type="tel" onChange={handleChange} ref={ref} css={bodyStyle} {...inputProps} />
  )
})

export default InputTel