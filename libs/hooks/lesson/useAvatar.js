import { useRef, useState, useEffect } from 'react'
import { Clock } from 'three'
import AvatarLoader from '../../avatar/loader'
import { useLessonRecorderContext } from '../../contexts/lessonRecorderContext'

const clock = new Clock()
const avatar = new AvatarLoader()
let startDraggingTime
let isDragging = false

export default function useLessonAvatar(setIsLoading, isSpeaking, hasResize) {
  const [config, setConfig] = useState({})
  const containerRef = useRef(null)
  const { setRecord } = useLessonRecorderContext()

  function startDragging(e) {
    if (avatar.prepareMovePosition(e.nativeEvent.offsetX, e.nativeEvent.offsetY)) {
      isDragging = true
      startDraggingTime = new Date()
    }
  }

  function inDragging(e) {
    if (isDragging) {
      e.target.style.cursor = 'move'
      avatar.movePosition(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
      return
    }

    if(avatar.isOverAvatar(e.nativeEvent.offsetX, e.nativeEvent.offsetY)) {
      e.target.style.cursor = 'move'
    } else {
      e.target.style.cursor = 'default'
    }
  }

  function endDragging() {
    if (isDragging) {
      isDragging = false
      setRecord({
        kind: 'avatarMoving',
        duration: new Date() - startDraggingTime,
        value: avatar.currentPosition(),
      })
    }
  }

  async function changeAvatar() {
    setIsLoading(true)

    const dom = await avatar.render(config.avatar, containerRef.current)
    avatar.play()
    animate()

    containerRef.current.append(dom)

    setIsLoading(false)
  }

  function changeLightColor() {
    const color = parseInt(rgb2hex(Object.values(config.lightColor).slice(0, 3)), 16)
    avatar.setLightColor(color, config.lightColor.a * 2)
  }

  function changeSpeakMotion() {
    avatar.switchSpeaking(isSpeaking)
  }

  function changeScreenSize() {
    if (!hasResize) return
    avatar.updateSize(containerRef.current)
  }

  function rgb2hex(rgb) {
    return rgb.map((value) => (
      ('0' + value.toString(16)).slice(-2)
    )).join('')
  }

  function animate() {
    avatar.animate(clock.getDelta())
    requestAnimationFrame(() => animate())
  }

  useEffect(() => {
    return () => {
      avatar.clearBeforeUnload()
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