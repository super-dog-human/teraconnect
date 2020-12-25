/** @jsxImportSource @emotion/react */
import React from 'react'
import { jsx, css } from '@emotion/core'
import AloneAvatar from '../avatar/aloneAvatar'

const bodyStyle = css({
  width: '100%',
  height: '450px',
  backgroundColor: 'var(--dark-blue)',
  backgroundImage: 'url("/img/landscape_starry_sky.jpg")',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundPositionX: 'center',
  backgroundPositionY: 'bottom'
})

const AloneInLandscape = () => (
  <div css={bodyStyle}>
    <AloneAvatar />
  </div>
)

export default AloneInLandscape
