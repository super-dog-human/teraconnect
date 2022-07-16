/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/react'

const RecordImage = ({ name, alt }) => (
  <figure css={containerStyle}>
    <img src={`/img/how_to_record/${name}.webp`} srcSet={`/img/how_to_record/${name}.webp 1x, /img/how_to_record/${name}@2x.webp 2x`} alt={alt} css={imageStyle} />
  </figure>
)

export default RecordImage

const containerStyle = css({
  width: 'fit-content',
  margin: '10px 0 0 0',
})

const imageStyle = css({
  width: '100%',
  height: '100%',
})