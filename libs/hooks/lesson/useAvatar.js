import { useRef, useState, useEffect } from 'react'
import AvatarLoader from '../../avatar/loader'
import { Clock } from 'three'

const clock = new Clock()
const avatar = new AvatarLoader()
let startDraggingTime
let isDragging = false

export default function useLessonAvatar(setIsLoading, isTalking, hasResize) {
  const [config, setConfig] = useState({})
  const containerRef = useRef(null)
  //    ReactDOM.findDOMNode(containerRef).append(dom)

  function animate() {
    avatar.animate(clock.getDelta())
    requestAnimationFrame(() => animate())
  }

  function startDragging(e) {
    if (avatar.prepareMovePosition(e.nativeEvent.offsetX, e.nativeEvent.offsetY)) {
      //      e.target.style.cursor = 'move'
      isDragging = true
      //      startDraggingTime
    }
  }

  function inDragging(e) {
    if (isDragging) {
      e.target.style.cursor = 'move'
      avatar.movePosition(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
      return
    }

    if(avatar.isMouseOver(e.nativeEvent.offsetX, e.nativeEvent.offsetY)) {
      e.target.style.cursor = 'move'
    } else {
      e.target.style.cursor = 'default'
    }
  }

  function endDragging() {
    isDragging = false
  }

  async function changeAvatar() {
    setIsLoading(true)

    // avatarごと渡してurlとかdefaultActionとかをclassないで見てもらう
    const dom = await avatar.render(config.avatar.url, containerRef.current)
    avatar.setDefaultAnimation()
    avatar.initAnimationPlaying()
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
    console.log(isTalking)
  }

  function changeScreenSize() {
    console.log('hasResize', hasResize)
    //    avatar.updateSize(containerRef.current)
  }

  function rgb2hex(rgb) {
    return rgb.map((value) => (
      ('0' + value.toString(16)).slice(-2)
    )).join('')
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
    // start speech motion.
  }, [isTalking])

  useEffect(() => {
    changeScreenSize()
  }, [hasResize])

  return { setAvatarConfig: setConfig, avatarRef: containerRef, startDragging, inDragging, endDragging }
}