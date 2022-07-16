/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/react'

const Label = React.forwardRef(function label({ cursor, targetFor, children }, ref) {
  const bodyStyle = css({
    cursor: cursor ? cursor : 'pointer',
  })

  return (
    <label htmlFor={targetFor} css={bodyStyle} ref={ref}>{children}</label>
  )
})

export default Label