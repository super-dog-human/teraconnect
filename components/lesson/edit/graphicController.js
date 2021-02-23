/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function LessonEditGraphicController() {
  return(
    <div css={bodyStyle}>graphic controller</div>
  )
}

const bodyStyle = css({
  height: '100%',
  minHeight: '300px', // モバイル環境用。画面高さよりも小さくすることで要素内外のスクロールをしやすくする
  overflowX: 'scroll',
})