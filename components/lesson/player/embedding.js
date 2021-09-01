/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function LessonEmbedding({ isPlaying, embedding }) {
  return (
    <>
      {embedding && <div css={bodyStyle} className="embedding-z">
        {embedding && embedding.serviceName === 'youtube' && isPlaying &&
            <iframe width="100%" height="100%" src={embedding.url} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        }
        {embedding && embedding.serviceName === 'youtube' && !isPlaying &&
          <div css={placeHolderStyle}>
              YouTube
          </div>
        }
        {embedding && embedding.serviceName === 'geogebra' && isPlaying &&
          <iframe scrolling="no" src={embedding.url} width="100%" height="100%" frameBorder="0" allowFullScreen />
        }
        {embedding && embedding.serviceName === 'geogebra' && !isPlaying &&
          <div css={placeHolderStyle}>
            GeoGebra
          </div>
        }
      </div>}
    </>
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