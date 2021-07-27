import React, { useEffect, useState, useRef } from 'react'
import TransitionContainer from './transitionContainer'

export default function FlashContainer({ children, isShow, timeoutMs, transitionDuration }) {
  const [isContainerShow, setIsContainerShow] = useState(false)
  const timerRef = useRef()

  useEffect(() => {
    if (isShow) {
      setIsContainerShow(true)
      if (timerRef.current) return // タイムアウト設定済みなら何もしない

      timerRef.current = setTimeout(() => {
        setIsContainerShow(false)
        timerRef.current = null
      }, timeoutMs)
    } else {
      setIsContainerShow(false)
    }

    return () => {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [isShow, timeoutMs])

  return (
    <TransitionContainer isShow={isContainerShow} duration={transitionDuration}>
      {children}
    </TransitionContainer>
  )
}