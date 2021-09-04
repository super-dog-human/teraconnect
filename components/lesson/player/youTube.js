/** @jsxImportSource @emotion/react */
import React from 'react'
import Script from 'next/script'
import { css } from '@emotion/core'

const youTubePlayerSrc = 'https://www.youtube.com/iframe_api'

export default function LessonYouTube({ youTubeIDs }) {
  return (
    <div css={bodyStyle} className="embedding-z">
      {youTubeIDs.map(id => <div key={id} id={`youtube-player-${id}`} css={youtubePlayerStyle} />)}
      <Script src={youTubePlayerSrc} strategy="beforeInteractive" />
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

const youtubePlayerStyle = css({
  width: '100%',
  height: '100%',
})