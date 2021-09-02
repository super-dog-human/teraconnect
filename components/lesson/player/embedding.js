/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function LessonEmbedding({ isPlaying, embedding }) {
  const iframeStyle = css({
    display: isPlaying ? 'block' : 'none',
  })

  return (
    <div css={bodyStyle} className="embedding-z">
      {embedding &&
      <>
        {embedding.serviceName === 'youtube' &&
          <iframe width="100%" height="100%" src={embedding.url} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" css={iframeStyle} />
        }
        {embedding.serviceName === 'geogebra' &&
          <iframe scrolling="no" src={embedding.url} width="100%" height="100%" frameBorder="0" css={iframeStyle} />
        }
        {!isPlaying && <div css={placeHolderStyle}>{embedding.serviceName === 'youtube' ? 'YouTube' : 'GeoGebra'}</div>}
      </>}
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