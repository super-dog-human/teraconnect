/** @jsxImportSource @emotion/react */
import React, { useState } from 'react'
import { css } from '@emotion/core'

export default function LessonLine({ children }) {
  const [isEditButtonShow, setIsEditButtonShow] = useState(false)

  function handleMouseOver() {
    setIsEditButtonShow(true)
  }

  function handleMouseLeave() {
    setIsEditButtonShow(false)
  }

  return (
    <div css={bodyStyle} onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
      {children.map((child, key) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { key, isEditButtonShow })
        }
        return child
      })}
    </div>
  )
}

const bodyStyle = css({
  display: 'flex',
  width: '100%',
  minHeight: '55px',
})