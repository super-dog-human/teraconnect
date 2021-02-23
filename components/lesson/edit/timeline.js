/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import LessonEditSpeechLine from './speechLine'
import LessonEditKindIcon from './kindIcon'
import { floatSecondsToMinutesFormat } from '../../../libs/utils'

export default function LessonEditTimeline({ timeline }) {
  return(
    <div css={bodyStyle} >
      {Object.keys(timeline).map((elapsedtime, i) => (
        <div key={i}>
          <div key={elapsedtime} draggable={true} css={lineStyle}>
            <div css={elapsedTimeStyle}>{floatSecondsToMinutesFormat(elapsedtime)}</div>
            {Object.keys(timeline[elapsedtime]).map(kind =>
              <div key={kind} css={lineBodyStyle}>
                <LessonEditKindIcon kind={kind} status={'on'} css={lineKindStyle} />
                <div css={lineTextStyle}>
                  {kind === 'speech' && <LessonEditSpeechLine value={timeline[elapsedtime].speech.subtitle} />}
                </div>
              </div>
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

const lineBodyStyle = css({
  display: 'flex',
  width: '100%',
})

const lineKindStyle = css({
  display: 'flex',
  justifyContent: 'center',
  marginLeft: '20px',
  marginRight: '10px',
})

const lineTextStyle = css({
  width: '100%',
  height: '55px',
})

const hrStyle = css({
  color: '#dedede',
  width: 'calc(100% - 70px)',
  height: '1px',
  marginLeft: '65px',
  marginRight: '5px',
})