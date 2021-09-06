import React, { useState } from 'react'
import { useTransition, animated } from 'react-spring'

export default function FadeOutContainer({ duration, children }) {
  const [isContainerShow, setIsContainerShow] = useState(true)
  const transition = useTransition(isContainerShow, {
    from: { opacity: 1 },
    enter: { opacity: 0 },
    leave: { opacity: 1 },
    delay: duration,
    onRest: () => {
      setIsContainerShow(false)
    },
  })

  return transition(
    (styles, item) => item && <animated.div style={styles}>{isContainerShow && children}</animated.div>
  )
}