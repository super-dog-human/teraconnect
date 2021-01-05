/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

const style = css({
  width: 'calc(100% - 2px)',
  height: '100%',
  lineHeight: '100%',
  padding: '0px',
  margin: '0px',
  border: '1px solid var(--border-gray)'
})

const InputText = React.forwardRef((props, ref) => (
  <input type="text" ref={ ref } css={ style } {...props} />
))

export default InputText