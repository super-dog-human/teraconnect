/** @jsx jsx */
import React from 'react'
import { jsx, css } from '@emotion/core'

const bodyStyle = css({
  width: '100%',
  height: '750px',
  backgroundColor: 'var(--dark-gray)'
})

const pickedOutLessonStyle = css({
  maxWidth: '1280px',
  paddingTop: '90px',
  marginLeft: 'auto',
  marginRight: 'auto',
  color: 'white'
})

const topCopyStyle = css({
  marginLeft: '70px',
  fontSize: '25px',
  letterSpacing: '1px'
})

const thumbnailStyle = css({
  width: '650px',
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: '70px'
})

const thumbnailImageStyle = css({
  width: '650px',
  height: '360px'
})

export default class PickupedLesson extends React.Component {
  async componentDidMount() {
    // ランダムLessonのロード
  }

  render() {
    return (
      <div css={bodyStyle}>
        <div css={pickedOutLessonStyle}>
          <div css={topCopyStyle}>きみの光を探そう。</div>

          <hr size="1" color="#86bacc" width="100%" />

          <div css={thumbnailStyle}>
            <div className="text-align-left">星座と戯れる三角関数</div>
            <img src="sample.png" css={thumbnailImageStyle} />
            <div className="text-align-left">三角関数の歴史は古い。</div>
          </div>
        </div>
      </div>
    )
  }
}
