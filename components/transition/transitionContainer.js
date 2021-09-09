import React, { useEffect, useState } from 'react'
import { useTransition, animated } from 'react-spring'
import useUnmountRef from '../../libs/hooks/useUnmountRef'

export default function TransitionContainer({ isShow, duration, children }) {
  const [isContainerShow, setIsContainerShow] = useState(false)
  const unmountRef = useUnmountRef()
  const transition = useTransition(isShow, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    expires: false,
    config: { duration },
    onRest: () => {
      if (unmountRef.current) return
      if (!isShow) setIsContainerShow(false)
    },
  })

  useEffect(() => {
    if (isShow) setIsContainerShow(true)
  }, [isShow])

  return transition(
    (styles, item) => item && <animated.div style={styles}>{isContainerShow && children}</animated.div>
  )
}