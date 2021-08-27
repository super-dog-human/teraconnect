/** @jsxImportSource @emotion/react */
import React, { useRef, useEffect } from 'react'
import { css } from '@emotion/core'

const frameUnit = 20

function easeOutSine(x) {
  return Math.sin((x * Math.PI) / 2)
}

export default function ScrollArrow({ direction, targetRef }) {
  const initializedRef = useRef(false)
  const isHoverRef = useRef(false)
  const animationIDRef = useRef()
  const offsetLeftRef = useRef()
  const moveMaxXRef = useRef()
  const maxFrameCountRef = useRef()
  const frameCountRef = useRef()
  const scrollDelayIDRef = useRef()

  function handleMouseOver() {
    if (isHoverRef.current) return
    isHoverRef.current = true

    offsetLeftRef.current = targetRef.current.scrollLeft
    if (direction === 'left') {
      moveMaxXRef.current = offsetLeftRef.current
    } else {
      moveMaxXRef.current = targetRef.current.scrollWidth - targetRef.current.offsetWidth - offsetLeftRef.current
    }

    maxFrameCountRef.current = parseInt(moveMaxXRef.current / 300 * frameUnit)      // 移動距離に応じて300px/20フレームの速さで移動
    if (maxFrameCountRef.current <= frameUnit) maxFrameCountRef.current = frameUnit // 移動距離が短い時は20フレーム使う
    frameCountRef.current = 0

    scrollDelayIDRef.current = setTimeout(animate, 200)
  }

  function handleMouseLeave() {
    isHoverRef.current = false
    clearTimeout(scrollDelayIDRef.current)
  }

  function animate() {
    if (moveMaxXRef.current === 0) return
    if (!isHoverRef.current) return

    if (direction === 'left') {
      const moveLeft = offsetLeftRef.current - Math.floor(moveMaxXRef.current * easeOutSine(frameCountRef.current / maxFrameCountRef.current))
      targetRef.current.scrollLeft = moveLeft
    } else {
      const moveRight = Math.floor(moveMaxXRef.current * easeOutSine(frameCountRef.current / maxFrameCountRef.current)) + offsetLeftRef.current
      targetRef.current.scrollLeft = moveRight
    }

    frameCountRef.current += 1
    if (frameCountRef.current <= maxFrameCountRef.current) {
      animationIDRef.current = requestAnimationFrame(animate)
    } else {
      isHoverRef.current = false
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
    if (initializedRef.current) false

    targetRef.current.onwheel = (() => {
      cancelAnimationFrame(animationIDRef.current)
    })
    initializedRef.current = true
  }, [initializedRef, targetRef])

  return (
    <button css={buttonStyle} onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
      <img src="/img/icon/double-arrows.svg" css={iconStyle} alt='画像エリアスクロールボタン' />
    </button>
  )
}

const buttonStyle = css({
  opacity: '0.3',
  transition: 'opacity 0.5s',
  ':hover': {
    opacity: '1',
  },
})