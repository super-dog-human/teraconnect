/** @jsxImportSource @emotion/react */
import React, { useRef, useState, useEffect } from 'react'
import { css } from '@emotion/core'
import PlainText from '../../plainText'

const fontSizeCoefficient = 38
const minFontSize = 15

export default function Subtitle({ subtitle }) {
  const containerRef = useRef()
  const [fontSize, setFontSize] = useState(0)

  useEffect(() => {
    if (!subtitle) return
    const newSize = parseInt(containerRef.current.clientWidth / fontSizeCoefficient)
    setFontSize(newSize > minFontSize ? newSize : minFontSize)
  }, [subtitle, fontSize])

  return (
    <>
      {subtitle &&
        <div css={containerStyle} className="subtitle-z" ref={containerRef}>
          <PlainText color='var(--soft-white)' size={fontSize}>
            <div css={backgroundStyle}>
              <div css={subtitleStyle}>{subtitle}</div>
            </div>
          </PlainText>
        </div>
      }
    </>
  )
}

const containerStyle = css({
  position: 'absolute',
  top: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-end',
})

const backgroundStyle = css({
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  marginBottom: '20%',
})

const subtitleStyle = css({
  textAlign: 'center',
  paddingLeft: '10px',
  paddingRight: '10px',
})