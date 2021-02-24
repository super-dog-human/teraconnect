/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import LessonEditLine from './line/'
import { floatSecondsToMinutesFormat } from '../../../libs/utils'

export default function LessonEditTimeline({ timeline }) {
  return(
    <div css={bodyStyle} >
      {Object.keys(timeline).map((elapsedtime, i) => (
        <div key={i}>
          <div key={elapsedtime} draggable={true} css={lineStyle}>
            <div css={elapsedTimeStyle}>{floatSecondsToMinutesFormat(elapsedtime)}</div>
            {Object.keys(timeline[elapsedtime]).map(kind =>
              <LessonEditLine key={elapsedtime + kind} kind={kind} body={timeline[elapsedtime][kind]} />
            )}
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

const lineStyle = css({
  cursor: 'pointer',
  display: 'flex',
})

const elapsedTimeStyle = css({
  width: '50px',
  color: 'lightGray', // fixme
  fontSize: '15px',
  lineHeight: '55px',
  letterSpacing: '1px',
  paddingLeft: '10px',
})

const hrStyle = css({
  backgroundColor: '#dedede',
  width: 'calc(100% - 70px)',
  height: '1px',
  marginLeft: '65px',
  marginRight: '5px',
})