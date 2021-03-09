/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import useGraphicController from '../../../../libs/hooks/lesson/edit/useGraphicController'
import LessonEditGraphicThumbnail from '../graphicThumbnail'

export default function LessonEditGraphicController(props) {
  const { graphicURL, swapGraphic, removeGraphic } = useGraphicController(props)

  return (
    <div css={bodyStyle}>
      {Object.keys(graphicURL).length > 0 &&
      <>
        <div css={headerStyle}>
          <div>アップロード済み ({Object.keys(graphicURL).length})</div>
          <hr />
        </div>
        <div css={containerStyle}>
          {Object.keys(graphicURL).map(key => (
            <div css={thumbnailStyle} key={key}>
              <LessonEditGraphicThumbnail url={graphicURL[key]} />
            </div>
          ))}
        </div>
      </>
      }
    </div>
  )
}

const bodyStyle = css({
  height: 'calc(100% - 253px - 20px - 45px - 100px)', // 自身の上に存在する要素分を差し引く
  marginTop: '100px',
})

const headerStyle = css({
  height: '50px',
  textAlign: 'center',
  color: 'gray',
})

const containerStyle = css({
  height: 'calc(100% - 50px)',
  overflowX: 'scroll',
  display: 'flex',
  alignContent: 'flex-start',
  flexWrap: 'wrap',
})

const thumbnailStyle = css({
  flex: 'calc(50% - 40px)',
  margin: '20px',
  textAlign: 'center',
})