/** @jsxImportSource @emotion/react */
import React, { useRef, useEffect, useState } from 'react'
import { css } from '@emotion/core'

export default function StrokeText({ children, parentWidth, sizeVW, color, borderColor }) {
  const containerRef = useRef()
  const [fontStyle, setFontStyle] = useState({})

  useEffect(() => {
    const multiplier = parentWidth / window.innerWidth
    setFontStyle({
      sizeVW: sizeVW * multiplier,
      shadowHarfSize: 0.5 * multiplier,
      shadowQuarterSize: 0.25 * multiplier,
    })
  }, [parentWidth, sizeVW])

  const bodyStyle = css({
    color,
    fontSize: sizeVW && `${fontStyle.sizeVW}vw`,
    textShadow: `
        ${borderColor}  ${fontStyle.shadowHarfSize}vw     0,
        ${borderColor} -${fontStyle.shadowHarfSize}vw     0,
        ${borderColor}  0                                -${fontStyle.shadowHarfSize}vw,
        ${borderColor}  0                                 ${fontStyle.shadowHarfSize}vw,
        ${borderColor}  ${fontStyle.shadowHarfSize}vw     ${fontStyle.shadowHarfSize}vw,
        ${borderColor} -${fontStyle.shadowHarfSize}vw     ${fontStyle.shadowHarfSize}vw,
        ${borderColor}  ${fontStyle.shadowHarfSize}vw    -${fontStyle.shadowHarfSize}vw,
        ${borderColor} -${fontStyle.shadowHarfSize}vw    -${fontStyle.shadowHarfSize}vw,
        ${borderColor}  ${fontStyle.shadowQuarterSize}vw  ${fontStyle.shadowHarfSize}vw,
        ${borderColor} -${fontStyle.shadowQuarterSize}vw  ${fontStyle.shadowHarfSize}vw,
        ${borderColor}  ${fontStyle.shadowQuarterSize}vw -${fontStyle.shadowHarfSize}vw,
        ${borderColor} -${fontStyle.shadowQuarterSize}vw -${fontStyle.shadowHarfSize}vw,
        ${borderColor}  ${fontStyle.shadowHarfSize}vw     ${fontStyle.shadowQuarterSize}vw,
        ${borderColor} -${fontStyle.shadowHarfSize}vw     ${fontStyle.shadowQuarterSize}vw,
        ${borderColor}  ${fontStyle.shadowHarfSize}vw    -${fontStyle.shadowQuarterSize}vw,
        ${borderColor} -${fontStyle.shadowHarfSize}vw    -${fontStyle.shadowQuarterSize}vw
    `
  })

  return (
    <span css={bodyStyle} ref={containerRef}>{children}</span>
  )
}