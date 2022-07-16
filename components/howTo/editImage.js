/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/react'

const EditImage = ({ name, alt }) => (
  <figure css={containerStyle}>
    <img src={`/img/how_to_edit/${name}.webp`} srcSet={`/img/how_to_edit/${name}.webp 1x, /img/how_to_edit/${name}@2x.webp 2x`} alt={alt} css={imageStyle} />
  </figure>
)

export default EditImage

const containerStyle = css({
  width: 'fit-content',
  margin: '10px 0 0 0',
})

const imageStyle = css({
  width: '100%',
  height: '100%',
})