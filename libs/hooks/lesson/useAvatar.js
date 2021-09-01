import { useRef, useState, useCallback, useEffect } from 'react'
import { Clock, Vector3 } from 'three'
import AvatarLoader from '../../avatar/loader'
import { switchSwipable, mouseOrTouchPositions, rgbToHex } from '../../utils'

export default function useAvatar({ setIsLoading, isSpeaking, hasResize, movingCallback }) {
  const clock = new Clock()
  const avatarRef = useRef()
  const startDraggingTimeRef = useRef()
  const isDraggingRef = useRef(false)
  const [config, setConfig] = useState({})
  const containerRef = useRef(null)

  function startDragging(e) {
    const positions = mouseOrTouchPositions(e, ['touchstart'])
    if (avatarRef.current.prepareMovePosition(...positions)) {
      switchSwipable(false)
      isDraggingRef.current = true
      startDraggingTimeRef.current = new Date()
    }
  }

  function inDragging(e) {
    const positions = mouseOrTouchPositions(e, ['touchmove'])

    if (isDraggingRef.current) {
      e.target.style.cursor = 'move'
      avatarRef.current.movePosition(...positions)
      return
    }

    if (avatarRef.current.isOverAvatar(...positions)) {
      e.target.style.cursor = 'move'
    } else {
      e.target.style.cursor = 'default'
    }
  }

  function endDragging() {
    if (isDraggingRef.current) {
      switchSwipable(true)
      isDraggingRef.current = false
      if (movingCallback) {
        movingCallback({
          kind: 'avatarMoving',
          durationMillisec: new Date() - startDraggingTimeRef.current,
          value: Object.values(avatarRef.current.currentPosition()),
        })
      }
    }
  }

  function setPosition(positions) {
    avatarRef.current.movePositions(positions)
  }

  function resetPosition(avatar) {
    avatarRef.current.setDefaultPose(avatar)
  }

  function startMoving({ durationSec, realDurationSec, startPositions, destinationPositions, animations }) {
    const startVector = new Vector3(...startPositions)
    const destinationVector = new Vector3(...destinationPositions)
    startVector.lerp(destinationVector, 1 - realDurationSec / durationSec)

    avatarRef.current.setMovingAnimation({ durationSec: realDurationSec, startPositions: Object.values(startVector), destinationPositions, animations } )
  }

  function stopMoving() {
    avatarRef.current.removeMovingAnimation()
  }

  function playAnimation() {
    avatarRef.current.play()
  }

  function stopAnimation() {
    avatarRef.current.stop()
  }

  async function changeAvatar(shouldStartAnimation) {
    setIsLoading(true)

    const dom = await avatarRef.current.render(config.avatar, containerRef.current)
    if (shouldStartAnimation) playAnimation()
    animate()

    removeCurrentCanvas()
    containerRef.current.append(dom)
    setIsLoading(false)
  }

  function changeLightColor() {
    const colors = config.lightColor.split(',')
    const color = parseInt(rgbToHex(colors.slice(0, 3).map(c => parseInt(c))), 16)
    avatarRef.current.setLightColor(color, colors[3] * 2)
  }

  const changeSpeakingMotion = useCallback(() => {
    avatarRef.current.switchSpeaking(isSpeaking)
  }, [isSpeaking])

  const changeScreenSize = useCallback(() => {
    if (!hasResize) return
    avatarRef.current.updateSize(containerRef.current)
  }, [hasResize])

  function animate() {
    avatarRef.current.animate(clock.getDelta())
    requestAnimationFrame(() => animate())
  }

  function removeCurrentCanvas() {
    if (!containerRef.current) return

    Array.from(containerRef.current.getElementsByTagName('canvas')).forEach(canvas => {
      canvas.remove() // 描画済みのアバターをcanvasごと削除
    })
  }

  useEffect(() => {
    avatarRef.current = new AvatarLoader()
    return () => {
      avatarRef.current.clearBeforeUnload()
      removeCurrentCanvas()
    }
  }, [])

  useEffect(() => {
    const keys = Object.keys(config)
    keys.forEach(key => {
      switch(key) {
      case 'avatar':
        changeAvatar(keys.includes('playAnimation'))
        break
      case 'lightColor':
        changeLightColor()
        break
      case 'playAnimation':
        if (!keys.includes('avatar')) playAnimation()
        break
      case 'stopAnimation':
        stopAnimation()
        break
      }
    })
  }, [config])

  useEffect(() => {
    changeSpeakingMotion()
  }, [isSpeaking, changeSpeakingMotion])

  useEffect(() => {
    changeScreenSize()
  }, [hasResize, changeScreenSize])

  return { setAvatarConfig: setConfig, avatarRef: containerRef, startDragging, inDragging, endDragging, setPosition, resetPosition, startMoving, stopMoving }
}