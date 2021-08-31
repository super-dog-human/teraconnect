/** @jsxImportSource @emotion/react */
import React, { useRef, useState, useEffect } from 'react'
import { css } from '@emotion/core'
import StrokeText from '../../strokeText'

const fontSizeVW = 4.5

export default function Caption({ caption }) {
  const containerRef = useRef()
  const defaultColor = '#ffffff'
  const defaultBorderColor = '#0000ff'
  const [containerWidth, setContainerWidth] = useState(0)

  const containerStyle = css({
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: justifyContent(caption.horizontalAlign),
    alignItems: alignItems(caption.verticalAlign),
  })

  function justifyContent(horizontalAlign) {
    switch(horizontalAlign) {
    case 'left':
      return 'flex-start'
    case 'center':
      return 'center'
    case 'right':
      return 'flex-end'
    default:
      return 'center'
    }
  }

  function alignItems(verticalAlign) {
    switch(verticalAlign) {
    case 'top':
      return 'flex-start'
    case 'middle':
      return 'center'
    case 'bottom':
      return 'flex-end'
    default:
      return 'center'
    }
  }

  useEffect(() => {
    if (!caption) return
    setContainerWidth(containerRef.current.clientWidth)
  }, [caption])

  return (
    <>
      {caption &&
        <div css={containerStyle} className="subtitle-z" ref={containerRef}>
          <div css={captionStyle}>
            <StrokeText sizeVW={fontSizeVW} color={caption.bodyColor || defaultColor} parentWidth={containerWidth} borderColor={caption.borderColor || defaultBorderColor}>
              {caption.body}
            </StrokeText></div>
        </div>
      }
    </>
  )
}

const captionStyle = css({
  margin: '1%',
})
