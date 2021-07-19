/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import { CSSTransitionGroup } from 'react-transition-group'

export default function TransitionContainer({ isShow, name, showMsTime, hideMsTime, children }) {
  const bodyStyle = css({
    [`.${name}-enter`]: {
      opacity: 0.01,
    },
    [`.${name}-enter.${name}-enter-active`]: {
      opacity: 1,
      transition: `opacity ${showMsTime || 1000}ms ease-in`,
    },
    [`.${name}-leave`]: {
      opacity: 1,
    },
    [`.${name}-leave.${name}-leave-active`]: {
      opacity: 0.01,
      transition: `opacity ${hideMsTime || 1000}ms ease-in`,
    },
  })

  return (
    <div css={bodyStyle}>
      <CSSTransitionGroup transitionName="other-setting" transitionEnterTimeout={showMsTime} transitionLeaveTimeout={hideMsTime}>
        {isShow && children}
      </CSSTransitionGroup>
    </div>
  )
}