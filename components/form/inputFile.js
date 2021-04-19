/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

const InputFile = React.forwardRef(function inputFile(props, ref) {
  return (
    <input type="file" {...props} ref={ref} css={bodyStyle} />
  )
})

const bodyStyle = css({
  display: 'none',
})

export default InputFile