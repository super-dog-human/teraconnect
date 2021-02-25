/** @jsxImportSource @emotion/react */
import React, { useState } from 'react'
import { css } from '@emotion/core'
import LessonEditLine from './line/'
import { floatSecondsToMinutesFormat } from '../../../libs/utils'

export default function LessonEditTimeline({ timeline }) {
  const [focusedIndex, setFocusedIndex] = useState()

  function handleLineClick(e) {
    const index = parseInt(e.currentTarget.getAttribute('data-line-index'))
    setFocusedIndex(index)
  }

  return(
    <div css={bodyStyle}>
      {Object.keys(timeline).sort((a, b) => a - b).map((elapsedtime, i) => (
        <div key={i} data-line-index={i} onClick={handleLineClick} css={focusedIndex === i && focusedStyle}>
          <div key={elapsedtime} draggable={true} css={lineStyle} >
            <div css={elapsedTimeStyle}>{floatSecondsToMinutesFormat(elapsedtime)}</div>
            <div css={lineBodyStyle}>
              {Object.keys(timeline[elapsedtime]).map(kind =>
                <LessonEditLine key={elapsedtime + kind} kind={kind} lines={timeline[elapsedtime][kind]} />
              )}
            </div>
          </div>
          {Object.keys(timeline).length -1 > i && <hr css={hrStyle} />}
        </div>
      ))}
    </div>
  )
}

const bodyStyle = css({
  height: '100%',
  overflowX: 'scroll',
})

const focusedStyle = css({
  backgroundColor: '#eaeaea',
})

const lineStyle = css({
  cursor: 'pointer',
  display: 'flex',
  paddingTop: '8px',
  paddingBottom: '8px',
})

const elapsedTimeStyle = css({
  width: '50px',
  color: 'lightGray', // fixme
  fontSize: '15px',
  lineHeight: '55px',
  letterSpacing: '1px',
  paddingLeft: '10px',
})

const lineBodyStyle = css({
  width: '100%',
})

const hrStyle = css({
  backgroundColor: '#dedede', // fixme
  width: 'calc(100% - 70px)',
  height: '1px',
  marginLeft: '65px',
  marginRight: '5px',
  marginTop: '0px',
  marginBottom: '0px',
})