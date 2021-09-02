/** @jsxImportSource @emotion/react */
import React, { useState, useCallback, useEffect } from 'react'
import { css } from '@emotion/core'
import Script from 'next/script'

const geogebraAppURL = 'https://cdn.geogebra.org/apps/deployggb.js'
const containerName = 'ggb-element'

export default function GeogebraPlayer({ isPlaying, file }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isShow, setIsShow] = useState(false)

  const containerStyle = css({
    width: '100%',
    height: '100%',
    display: isShow ? 'flex' : 'none',
    alignItems: 'center',
  })

  const setPlayer = useCallback(() => {
    const parameters = {
      ggbBase64: file, borderColor: 'rgba(0, 0, 0, 0)', showAlgebraInput: false, showToolBarHelp: false, enableLabelDrags: false, enableShiftDragZoom: false, enableRightClick: false, errorDialogsActive: false,
      width: 1280, height: 720, scale: 1, // 画面幅に応じて再計算が必要
      appletOnLoad: () => {
        if (!isPlaying) window.ggbApplet.stopAnimation()
        window.ggbApplet.evalCommand('CenterView((0, 0))')
        // window.ggbApplet.setCoordSystem(-10, 10, -10, 10) 元の座標が分からない
        setIsShow(true) // 一瞬元のサイズで表示されてしまうので読み込み完了後に表示する
      }
    }
    new window.GGBApplet(parameters).inject(containerName)
  }, [isPlaying, file])

  useEffect(() => {
    if (window.GGBApplet) {
      setPlayer()
    }
  }, [isLoaded, setPlayer])

  useEffect(() => {
    if (!window.ggbApplet) return
    if (isPlaying) {
      window.ggbApplet.startAnimation()
    } else {
      window.ggbApplet.stopAnimation()
    }
  }, [isPlaying])

  return (
    <>
      <Script src={geogebraAppURL} strategy='afterInteractive' onLoad={() => {setIsLoaded(true)}} />
      <div css={containerStyle}>
        <div id={containerName}></div>
      </div>
    </>
  )
}