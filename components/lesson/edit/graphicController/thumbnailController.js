/** @jsxImportSource @emotion/react */
import React, { useState } from 'react'
import { useContextMenuContext } from '../../../../libs/contexts/contextMenuContext'
import { css } from '@emotion/core'
import Container from '../../../container'
import IconButton from '../../../button/iconButton'
import GraphicThumbnail from '../graphicThumbnail'
import AbsoluteContainer from '../../../absoluteContainer'

export default function ThumbnailController({ graphicID, graphic, swapGraphic, removeGraphic }) {
  const { setContextMenu } = useContextMenuContext()
  const [isButtonShow, setIsButtonShow] = useState(false)

  function handleEnter() {
    if (graphic.isUploading) return
    setIsButtonShow(true)
  }

  function handleLeave() {
    setIsButtonShow(false)
  }

  function handleMenuClick(e) {
    setContextMenu({
      labels: ['差し替え', '削除'],
      actions: [() => swapGraphic(graphicID), () => removeGraphic(graphicID)],
      position: { fixed: false, x: e.pageX, y: e.pageY },
    })
  }

  return (
    <div css={bodyStyle} onMouseOver={handleEnter} onMouseLeave={handleLeave}>
      <GraphicThumbnail url={graphic.url} isProcessing={graphic.isUploading} />
      {isButtonShow && <AbsoluteContainer right='3px' bottom='5px'>
        <Container width='22' height='22'>
          <IconButton name='more' onClick={handleMenuClick} />
        </Container>
      </AbsoluteContainer>}
    </div>
  )
}

const bodyStyle = css({
  position: 'relative',
  cursor: 'pointer',
})