/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import GeogebraPlayer from './geogebraPlayer'

export default function LessonEmbedding({ isPlaying, embedding }) {
  return (
    <div css={bodyStyle} className="embedding-z">
      {embedding && <>
        {embedding.serviceName === 'youtube' && isPlaying &&
            <iframe width="100%" height="100%" src={embedding.url} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        }
        {embedding.serviceName === 'youtube' && !isPlaying &&
          <div css={placeHolderStyle}>YouTube</div>
        }
        {embedding.serviceName === 'geogebra' &&
          <GeogebraPlayer isPlaying={isPlaying} file={embedding.file}/>
        }
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