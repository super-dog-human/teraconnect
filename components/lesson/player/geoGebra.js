/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/react'

export default function LessonGeoGebra({ isPlaying, geoGebra }) {
  const iframeStyle = css({
    display: isPlaying ? 'block' : 'none',
  })

  return (
    <div css={bodyStyle} className="embedding-z">
      {geoGebra &&
        <iframe scrolling="no" src={geoGebra.url} width="100%" height="100%" frameBorder="0" css={iframeStyle} />
      }
      {geoGebra && !isPlaying &&
        <div css={placeHolderStyle}>GeoGebra</div>
      }
    </div>
  )
}

const bodyStyle = css({
  position: 'absolute',
  top: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
})

const placeHolderStyle = css({
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  color: 'gray',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  fontSize: '40px',
})