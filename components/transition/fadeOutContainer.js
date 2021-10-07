import React, { useState } from 'react'
import { useTransition, animated } from 'react-spring'
import useUnmountRef from '../../libs/hooks/useUnmountRef'

export default function FadeOutContainer({ duration, children }) {
  const [isContainerShow, setIsContainerShow] = useState(true)
  const unmountRef = useUnmountRef()
  const transition = useTransition(isContainerShow, {
    from: { opacity: 1 },
    enter: { opacity: 0 },
    leave: { opacity: 1 },
    delay: duration,
    onRest: () => {
      if (unmountRef.current) return
      setIsContainerShow(false)
    },
  })

  return transition(
    (styles, item) => !!item && <animated.div style={styles}>{isContainerShow && children}</animated.div>
  )
}