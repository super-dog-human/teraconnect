/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import GraphicThumbnail from '../graphicThumbnail'
import MobileGraphicThumbnail from './mobileGraphicThumbnail'
import Container from '../../container'
import Flex from '../../flex'
import FlexItem from '../../flexItem'
import { useImageViewerContext } from '../../../libs/contexts/imageViewerContext'

export default function Graphics({ isMobile, graphics, graphicURLs }) {
  const { setImage } = useImageViewerContext()

  function handleClick(e) {
    const url = e.currentTarget.dataset.url
    if (!url) return
    setImage({ url, widePer: 70 })
  }

  return (
    <Flex justifyContent={isMobile && 'space-between'} alignContent='flex-start' flexWrap='wrap' gap={isMobile ? '10px 5px' : '20px'}>
      {Array.from(new Set(graphics.filter(g => g.action === 'show').map(g => g.graphicID))).map((id, i) => {
        const url = graphicURLs[id]
        return (
          <FlexItem key={i} column={isMobile && '2 - 10px'}>
            <Container>
              <Flex justifyContent='center'>
                <button css={bodyStyle} data-url={url} onClick={handleClick}>
                  {!isMobile && <GraphicThumbnail url={url} />}
                  {isMobile && <MobileGraphicThumbnail url={url} />}
                </button>
              </Flex>
            </Container>
          </FlexItem>
        )
      })}
    </Flex>
  )
}

const bodyStyle = css({
  position: 'relative',
  cursor: 'pointer',
  border: 'none',
  padding: 0,
})