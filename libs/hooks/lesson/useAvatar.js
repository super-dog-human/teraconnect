import { useRef, useState, useEffect } from 'react'
import AvatarLoader from '../../avatar/loader'
import { Clock } from 'three'

const clock = new Clock()
const avatarLoader = new AvatarLoader()

export default function useLessonAvatar(setIsLoading, isTalking, hasResize) {
  const [config, setConfig] = useState({})
  const containerRef = useRef(null)
  //    ReactDOM.findDOMNode(containerRef).append(dom)

  function animate() {
    avatarLoader.animate(clock.getDelta())
    requestAnimationFrame(() => animate())
  }

  async function changeAvatar() {
    setIsLoading(true)

    // avatarごと渡してurlとかdefaultActionとかをclassないで見てもらう
    const dom = await avatarLoader.render(config.avatar.url, containerRef.current)
    avatarLoader.setDefaultAnimation()
    avatarLoader.initAnimationPlaying()
    avatarLoader.play()
    animate()

    containerRef.current.append(dom)

    setIsLoading(false)
  }

  function changeLightColor() {
    const color = parseInt(rgb2hex(Object.values(config.lightColor).slice(0, 3)), 16)
    avatarLoader.setLightColor(color, config.lightColor.a * 2)
  }

  function changeSpeakMotion() {
    console.log(isTalking)
  }

  function changeScreenSize() {
    console.log('hasResize', hasResize)
    //    avatarLoader.updateSize(containerRef.current)
  }

  function rgb2hex(rgb) {
    return rgb.map((value) => (
      ('0' + value.toString(16)).slice(-2)
    )).join('')
  }


  useEffect(() => {
    return () => {
      avatarLoader.clearBeforeUnload()
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

  return { setAvatarConfig: setConfig, avatarRef: containerRef }
}