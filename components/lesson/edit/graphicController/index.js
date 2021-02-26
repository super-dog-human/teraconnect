/** @jsxImportSource @emotion/react */
import React from 'react'
import Image from 'next/image'
import { css } from '@emotion/core'
import useGraphicController from '../../../../libs/hooks/lesson/edit/useGraphicController'

export default function LessonEditGraphicController(props) {
  const { graphicURL, swapGraphic, removeGraphic } = useGraphicController(props)

  return (
    <div css={bodyStyle}>
      {Object.keys(graphicURL).map(key => (
        <div key={key}>
          <Image width={176} height={100} src={graphicURL[key]} />
        </div>
      ))}
    </div>
  )
}

const bodyStyle = css({
  height: '100%',
  minHeight: '300px', // モバイル環境用。画面高さよりも小さくすることで要素内外のスクロールをしやすくする
  overflowX: 'scroll',
})