/** @jsxImportSource @emotion/react */
import React, { useEffect } from 'react'
import { css } from '@emotion/core'

const frameUnit = 20
let isHover = false
let animationID
let offsetLeft
let moveMaxX
let maxFrameCount
let frameCount
let scrollDelayID

function easeOutSine(x) {
  return Math.sin((x * Math.PI) / 2)
}

export default function ScrollArrow({ className, direction, targetRef }) {
  function handleMouseOver() {
    if (isHover) return
    isHover = true

    offsetLeft = targetRef.current.scrollLeft
    if (direction === 'left') {
      moveMaxX = offsetLeft
    } else {
      moveMaxX = targetRef.current.scrollWidth - targetRef.current.offsetWidth - offsetLeft - 1
    }

    maxFrameCount = parseInt(moveMaxX / 300 * frameUnit)      // 移動距離に応じて300px/20フレームの速さで移動
    if (maxFrameCount <= frameUnit) maxFrameCount = frameUnit // 移動距離が短い時は20フレーム使う
    frameCount = 0

    scrollDelayID = setTimeout(animate, 200)
  }

  function handleMouseLeave() {
    isHover = false
    clearTimeout(scrollDelayID)
  }

  function animate() {
    if (moveMaxX === 0) return
    if (!isHover) return

    if (direction === 'left') {
      const moveLeft = offsetLeft - Math.floor(moveMaxX * easeOutSine(frameCount / maxFrameCount))
      targetRef.current.scrollLeft = moveLeft
    } else {
      const moveRight = Math.floor(moveMaxX * easeOutSine(frameCount / maxFrameCount)) + offsetLeft
      targetRef.current.scrollLeft = moveRight
    }

    frameCount += 1
    if (frameCount <= maxFrameCount) {
      animationID = requestAnimationFrame(animate)
    } else {
      isHover = false
    }
  }

  const iconStyle = css({
    display: 'block',
    width: '33px',
    height: 'auto',
    cursor: 'pointer',
    margin: 'auto',
    transform: direction === 'left' ? 'rotate(180deg)' : 'none',
  })

  useEffect(() => {
    targetRef.current.onwheel = (() => {
      cancelAnimationFrame(animationID)
    })
  }, [])

  return (
    <button css={buttonStyle} className={className} onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
      <img src="/img/icon/double-arrows.svg" css={iconStyle} />
    </button>
  )
}

const buttonStyle = css({
  opacity: '0.3',
  transition: 'opacity 0.5s',
  [':hover']: {
    opacity: '1',
  },
})