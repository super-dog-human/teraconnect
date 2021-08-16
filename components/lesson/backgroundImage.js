/** @jsxImportSource @emotion/react */
import React from 'react'
import Image from 'next/image'
import { css } from '@emotion/core'

const BackgroundImage = React.memo(function backgroundImage({ url }) {
  return (
    <div css={bodyStyle} className="bg-image-z">
      {url && <Image src={url} width={1280} height={720} alt='背景画像' />}
    </div>
  )
})

const bodyStyle = css({
  position: 'absolute',
  top: 0,
  fontSize: 0, // next/imageで出力されるトップレベルの要素がinline-blockなので余白をなくすために指定
})

export default BackgroundImage