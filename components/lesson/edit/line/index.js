/** @jsxImportSource @emotion/react */
import React, { useState } from 'react'
import { css } from '@emotion/react'
import ErrorNotice from './errorNotice'

export default function LessonLine({ hasError, kind, isLineProcessing, isTouchDevice, children }) {
  const [isEditButtonShow, setIsEditButtonShow] = useState(isTouchDevice)

  function handleMouseOver() {
    if (isTouchDevice) return
    setIsEditButtonShow(true)
  }

  function handleMouseLeave() {
    if (isTouchDevice) return
    setIsEditButtonShow(false)
  }

  const backgroundStyle = css({
    backgroundColor: hasError && 'var(--error-light-pink)',
  })

  return (
    <div css={backgroundStyle}>
      <div css={bodyStyle} onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
        {children.map((child, key) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { key, isEditButtonShow, isLineProcessing })
          }
          return child
        })}
      </div>
      {hasError && <ErrorNotice kind={kind} />}
    </div>
  )
}

const bodyStyle = css({
  display: 'flex',
  width: '100%',
  minHeight: '55px',
})