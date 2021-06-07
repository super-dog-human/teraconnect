import { useRef, useState, useEffect } from 'react'
import { Clock } from 'three'
import AvatarLoader from '../../avatar/loader'
import { switchSwipable, mouseOrTouchPositions } from '../../utils'
import { useLessonRecorderContext } from '../../contexts/lessonRecorderContext'

export default function useAvatar(setIsLoading, isSpeaking, hasResize) {
  const clock = new Clock()
  const avatarRef = useRef()
  const startDraggingTimeRef = useRef()
  const isDraggingRef = useRef(false)
  const [config, setConfig] = useState({})
  const containerRef = useRef(null)
  const { setRecord } = useLessonRecorderContext()

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

    if(avatarRef.current.isOverAvatar(...positions)) {
      e.target.style.cursor = 'move'
    } else {
      e.target.style.cursor = 'default'
    }
  }

  function endDragging() {
    if (isDraggingRef.current) {
      switchSwipable(true)
      isDraggingRef.current = false
      setRecord({
        kind: 'avatarMoving',
        durationMillisec: new Date() - startDraggingTimeRef.current,
        value: { ...avatarRef.current.currentPosition() },
      })
    }
  }

  async function changeAvatar() {
    setIsLoading(true)

    const dom = await avatarRef.current.render(config.avatar, containerRef.current)
    avatarRef.current.play()
    animate()

    containerRef.current.append(dom)

    setIsLoading(false)
  }

  function changeLightColor() {
    const color = parseInt(rgb2hex(Object.values(config.lightColor).slice(0, 3)), 16)
    avatarRef.current.setLightColor(color, config.lightColor.a * 2)
  }

  function changeSpeakMotion() {
    avatarRef.current.switchSpeaking(isSpeaking)
  }

  function changeScreenSize() {
    if (!hasResize) return
    avatarRef.current.updateSize(containerRef.current)
  }

  function rgb2hex(rgb) {
    return rgb.map((value) => (
      ('0' + value.toString(16)).slice(-2)
    )).join('')
  }

  function animate() {
    avatarRef.current.animate(clock.getDelta())
    requestAnimationFrame(() => animate())
  }

  useEffect(() => {
    avatarRef.current = new AvatarLoader()
    return () => {
      avatarRef.current.clearBeforeUnload()
    }
  }, [])

  useEffect(() => {
    Object.keys(config).forEach(key => {
      switch(key) {
      case 'avatar':
        changeAvatar()
        break
      case 'lightColor':
        changeLightColor()
        break
      }
    })
  }, [config])

  useEffect(() => {
    changeSpeakMotion()
  }, [isSpeaking])

  useEffect(() => {
    changeScreenSize()
  }, [hasResize])

  return { setAvatarConfig: setConfig, avatarRef: containerRef, startDragging, inDragging, endDragging }
}