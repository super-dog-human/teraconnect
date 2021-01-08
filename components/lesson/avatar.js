/** @jsxImportSource @emotion/react */
import React, { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
//import { GLTFLoader } from './GLTFLoader'
import { VRM } from '@pixiv/three-vrm'
import { css } from '@emotion/core'

export default function LessonAvatar(props) {
  const containerRef = useRef(null)
  /*
  const renderer = new THREE.WebGLRenderer({
    alpha: true
    //      antialias: true
  })
  const camera = new THREE.PerspectiveCamera(
    1,
    domSize.width / domSize.height,
    150.0,
    160.0
  )
  const his.scene = new THREE.Scene()
  const light = new THREE.DirectionalLight(0x888888)
  this.scene.add(light)

  this.camera.position.set(-0.6, 1.05, 155.0)
*/
  function loadAvatar() {
    //    console.log(containerElement.current.clientWidth)
    //    console.log(containerElement.current.clientHeight)
    //    renderer.setPixelRatio(window.devicePixelRatio)
    //    renderer.setSize(containerElement.width, containerElement.height)
    //    renderer.render(this.scene, this.camera)
    // renderer.domElement

    // avatarElement.current = render.domElement
    // ReactDOM.findDOMNode(containerElement).append(dom)

    props.setIsLoading(false)
  }

  useEffect(() => {
    Object.keys(props.config).forEach(key => {
      switch(key) {
      case 'url':
        loadAvatar()
        break
      case 'lightColor':
        console.log(props.config.lightColor)
        // ここでavatarのlightcolorを変更する
        break
      }
    })

    // resize

  }, [props.config])

  /*
  useEffect(() => {

  }, [props.hasResize])
  // avatar消すやつreturnした方がよさそう
*/
  return (
    <div css={bodyStyle} className='avatar-z' ref={containerRef}>
    </div>
  )
}

const bodyStyle = css({
  position: 'absolute',
  top: 0,
  width: '100%',
  height: '100%',
})