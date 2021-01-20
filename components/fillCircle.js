/** @jsxImportSource @emotion/react */
import React from 'react'
import { css, keyframes } from '@emotion/core'

export default function FillCircle({ className, onMouseOut, onAnimationEnd, sizePercent }) {
  const drawMotion = keyframes`
    0% {
      stroke-dashoffset: 130px;
    }
    100% {
      stroke-dashoffset: 0px;
    }
  `

  const bodyStyle = css({
    transform: 'rotate(-90deg)',
    circle: {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fill: 'transparent',
      stroke: 'white',
      strokeWidth: 6,
      strokeDasharray: '130px',
      animation: `${drawMotion} 1s`,
    }
  })

  return (
    <svg width="100%" height="100%" css={bodyStyle} className={className} onMouseOut={onMouseOut} onAnimationEnd={onAnimationEnd}>
      <circle cx="50%" cy="50%" r={sizePercent} />
    </svg>
  )
}