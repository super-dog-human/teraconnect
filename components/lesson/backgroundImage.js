/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

const BackgroundImage = React.memo(function backgroundImage({ url }) {
  return (
    <div css={bodyStyle} className="bg-image-z">
      {!!url && <img src={url} css={imageStyle} alt='背景画像' />}
    </div>
  )
})

const bodyStyle = css({
  position: 'absolute',
  top: 0,
  fontSize: 0, // next/imageで出力されるトップレベルの要素がinline-blockなので余白をなくすために指定
})

const imageStyle = css({
  width: '100%',
  height: 'auto',
  maxWidth: '1280px',
  maxHeight: '720px',
  objectFit: 'contain',
})

export default BackgroundImage