import React from 'react'
import { useSpring, animated } from 'react-spring'

export default function ExpandContainer({ isExpand, initialHeight, expandedHeight, children }) {
  const styles = useSpring({ height: isExpand ? expandedHeight : initialHeight } )

  return <animated.div style={styles}>{children}</animated.div>
}