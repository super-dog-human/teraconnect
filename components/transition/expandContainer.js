import React from 'react'
import { useSpring, animated } from 'react-spring'

export default function ExpandContainer({ isExpand, initialHeight, expandedHeight, initialWidth, expandedWidth, onRest, children }) {
  const styles = useSpring({
    width: isExpand ? expandedWidth : initialWidth,
    height: isExpand ? expandedHeight : initialHeight,
    onRest,
  })

  return <animated.div style={styles}>{children}</animated.div>
}