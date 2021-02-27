/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import useGraphicController from '../../../../libs/hooks/lesson/edit/useGraphicController'
import LessonEditGraphicThumbnail from '../graphicThumbnail'

export default function LessonEditGraphicController(props) {
  const { graphicURL, swapGraphic, removeGraphic } = useGraphicController(props)

  return (
    <>
      {Object.keys(graphicURL).length > 0 &&
      <>
        <div>画像 ({Object.keys(graphicURL).length})</div>
        <hr />
        <div css={bodyStyle}>
          {Object.keys(graphicURL).map(key => (
            <div css={thumbnailStyle} key={key}>
              <LessonEditGraphicThumbnail url={graphicURL[key]} />
            </div>
          ))}
        </div>
      </>
      }
    </>
  )
}

const bodyStyle = css({
  display: 'flex',
  alignContent: 'flex-start',
  flexWrap: 'wrap',
  height: 'calc(100% - 337px)', // フッター分を差し引く
  minHeight: '300px', // モバイル環境用。画面高さよりも小さくすることで要素内外のスクロールをしやすくする
  overflowX: 'scroll',
  [':after']: {
    content: '""',
    display: 'block',
    width: '175px',
    margin: '25px',
  }
})

const thumbnailStyle = css({
  flex: 'calc(50% - 40px)',
  margin: '20px',
  textAlign: 'center',
})