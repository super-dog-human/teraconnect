/** @jsxImportSource @emotion/react */
import React, { useEffect } from 'react'
import { css } from '@emotion/core'

const frameUnit = 25
let isHover = false
let animationID
let offsetLeft
let moveMaxX
let maxFrameCount
let frameCount

export default function ScrollArrow({ className, direction, targetRef }) {
  function handleMouseOver() {
    if (isHover) return
    isHover = true
    cancelAnimationFrame(animationID)

    offsetLeft = targetRef.current.scrollLeft
    if (direction === 'left') {
      moveMaxX = offsetLeft
    } else {
      moveMaxX = targetRef.current.scrollWidth - targetRef.current.offsetWidth - offsetLeft
    }

    maxFrameCount = parseInt(moveMaxX / 300 * frameUnit)      // 移動距離に応じて300px/25フレームの速さで移動
    if (maxFrameCount <= frameUnit) maxFrameCount = frameUnit // 移動距離が短い時は25フレーム使う
    frameCount = 0

    animate()
  }

  function handleMouseLeave() {
    isHover = false
    if (direction === 'left') {
      moveMaxX = offsetLeft - targetRef.current.scrollLeft + 10
      if (moveMaxX > offsetLeft) moveMaxX = offsetLeft
    } else {
      moveMaxX = Math.min(targetRef.current.scrollLeft + 10, moveMaxX)
    }
    maxFrameCount = frameCount + 15 // アイコンのポイントを離脱した時は、10px/15フレームの速さで移動して停止する
  }

  function animate() {
    if (direction === 'left') {
      const moveLeft = offsetLeft - moveMaxX * easeOutQuint(frameCount / maxFrameCount)
      targetRef.current.scrollLeft = moveLeft
    } else {
      const moveRight = moveMaxX * easeOutQuint(frameCount / maxFrameCount) + offsetLeft
      targetRef.current.scrollLeft = moveRight
    }

    frameCount += 1
    if (frameCount <= maxFrameCount) {
      animationID = requestAnimationFrame(animate)
    } else {
      isHover = false
    }
  }

  function easeOutQuint(x) {
    return 1 - Math.pow(1 - x, 5)
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