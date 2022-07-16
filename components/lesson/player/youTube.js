/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/react'

export default function LessonYouTube({ youTubeIDs }) {
  return (
    <div css={bodyStyle} className="embedding-z">
      {youTubeIDs.map(id => <div key={id} id={`youtube-player-${id}`} css={youtubePlayerStyle} />)}
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