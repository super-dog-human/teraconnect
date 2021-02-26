/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import useGraphicController from '../../../../libs/hooks/lesson/edit/useGraphicController'
import LessonEditGraphicThumbnail from '../graphicThumbnail'

export default function LessonEditGraphicController(props) {
  const { graphicURL, swapGraphic, removeGraphic } = useGraphicController(props)

  return (
    <div css={bodyStyle}>
      {Object.keys(graphicURL).map(key => (
        <div css={thumbnailStyle} key={key}>
          <LessonEditGraphicThumbnail url={graphicURL[key]} />
        </div>
      ))}
    </div>
  )
}

const bodyStyle = css({
  display: 'flex',
  height: '100%',
  minHeight: '300px', // モバイル環境用。画面高さよりも小さくすることで要素内外のスクロールをしやすくする
  overflowX: 'scroll',
})

const thumbnailStyle = css({
  flex: '50%',
  textAlign: 'center',
})