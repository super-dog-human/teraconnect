/** @jsxImportSource @emotion/react */
import React, { useRef, useState, useCallback, useEffect } from 'react'
import { css } from '@emotion/core'
import useResizeDetector from '../../libs/hooks/useResizeDetector'
import useAvatar from '../../libs/hooks/lesson/useAvatar'
import Flex from '../flex'

const avatar = {
  url: '/model/alone.vrm',
  config: {
    scale: 1,
    positions: [0.5, -1.05, 0],
    initialPoses: [
      { 'boneName': 'hips',                    'rotations': [-0.1, -2.5, -0.1] },
      { 'boneName': 'chest',                   'rotations': [0, -1.24, 2] },
      { 'boneName': 'neck',                    'rotations': [0.3, 0, 0] },
      { 'boneName': 'rightLowerArm',           'rotations': [0, 0, -0.04] },
      { 'boneName': 'leftLowerArm',            'rotations': [0, 0, 0.04] },
      { 'boneName': 'rightUpperArm',           'rotations': [-0.04, 0.03, -1.22] },
      { 'boneName': 'leftUpperArm',            'rotations': [-0.04, 0.03, 1.22] },
      { 'boneName': 'rightLowerLeg',           'rotations': [-0.06, 0, 0] },
      { 'boneName': 'leftLowerLeg',            'rotations': [-0.06, 0, 0] },
      { 'boneName': 'rightUpperLeg',           'rotations': [-0.2, 0, 0] },
      { 'boneName': 'leftUpperLeg',            'rotations': [-0.2, 0, 0] },
      { 'boneName': 'rightIndexDistal',        'rotations': [0, 0, -0.6] },
      { 'boneName': 'leftIndexDistal',         'rotations': [0, 0, 0.6] },
      { 'boneName': 'rightIndexIntermediate',  'rotations': [0, 0, -0.6] },
      { 'boneName': 'leftIndexIntermediate',   'rotations': [0, 0, 0.6] },
      { 'boneName': 'rightIndexProximal',      'rotations': [0, 0, -0.6] },
      { 'boneName': 'leftIndexProximal',       'rotations': [0, 0, 0.6] },
      { 'boneName': 'rightLittleDistal',       'rotations': [0, 0, -0.6] },
      { 'boneName': 'leftLittleDistal',        'rotations': [0, 0, 0.6] },
      { 'boneName': 'rightLittleIntermediate', 'rotations': [0, 0, -0.6] },
      { 'boneName': 'leftLittleIntermediate',  'rotations': [0, 0, 0.6] },
      { 'boneName': 'rightLittleProximal',     'rotations': [0, 0, -0.6] },
      { 'boneName': 'leftLittleProximal',      'rotations': [0, 0, 0.6] },
      { 'boneName': 'rightMiddleDistal',       'rotations': [0, 0, -0.6] },
      { 'boneName': 'leftMiddleDistal',        'rotations': [0, 0, 0.6] },
      { 'boneName': 'rightMiddleIntermediate', 'rotations': [0, 0, -0.6] },
      { 'boneName': 'leftMiddleIntermediate',  'rotations': [0, 0, 0.6] },
      { 'boneName': 'rightMiddleProximal',     'rotations': [0, 0, -0.6] },
      { 'boneName': 'leftMiddleProximal',      'rotations': [0, 0, 0.6] },
      { 'boneName': 'rightRingDistal',         'rotations': [0, 0, -0.6] },
      { 'boneName': 'leftRingDistal',          'rotations': [0, 0, 0.6] },
      { 'boneName': 'rightRingIntermediate',   'rotations': [0, 0, -0.6] },
      { 'boneName': 'leftRingIntermediate',    'rotations': [0, 0, 0.6] },
      { 'boneName': 'rightRingProximal',       'rotations': [0, 0, -0.6] },
      { 'boneName': 'leftRingProximal',        'rotations': [0, 0, 0.6] },
      { 'boneName': 'rightThumbDistal',        'rotations': [0, -0.46, 0] },
      { 'boneName': 'leftThumbDistal',         'rotations': [0, 0.46, 0] },
      { 'boneName': 'rightThumbIntermediate',  'rotations': [0, -0.28, 0] },
      { 'boneName': 'leftThumbIntermediate',   'rotations': [0, 0.28, 0] },
      { 'boneName': 'rightThumbProximal',      'rotations': [0, -0.17, 0] },
      { 'boneName': 'leftThumbProximal',       'rotations': [0, 0.17, 0] },
    ]
  }
}
const lightColor = '136,136,136,0.5'

export default function AloneAvatar() {
  const containerRef = useRef()
  const { hasResize } = useResizeDetector(containerRef)
  const [isLoading, setIsLoading] = useState(true)
  const { setAvatarConfig, avatarRef } = useAvatar({ setIsLoading, hasResize })

  const startAnimation = useCallback(() => {
    const canvasStyle = avatarRef.current.children[0].style
    const opacity = parseFloat(canvasStyle.opacity) || 0
    if (opacity >= 1) return
    canvasStyle.opacity = opacity + 0.01
    requestAnimationFrame(startAnimation)
  }, [avatarRef])

  useEffect(() => {
    setAvatarConfig({ avatar, lightColor, playAnimation: true })
  }, [setAvatarConfig])

  useEffect(() => {
    if (isLoading) return
    startAnimation()
  }, [avatarRef, isLoading, startAnimation])

  return (
    <div css={bodyStyle} ref={containerRef}>
      <Flex justifyContent='center'>
        <div css={canvasStyle} ref={avatarRef} />
      </Flex>
    </div>
  )
}

const bodyStyle = css({
  width: '100%',
  height: '100%',
  textAlign: 'center'
})

const canvasStyle = css({
  width: 'auto',
  minWidth: '800px',
  height: '450px',
  'canvas': {
    opacity: 0,
  }
})
