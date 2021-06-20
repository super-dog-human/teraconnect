/** @jsxImportSource @emotion/react */
import React, { useState } from 'react'
import { css } from '@emotion/core'
import ErrorNotice from './errorNotice'

export default function LessonLine({ hasError, kind, children }) {
  const [isEditButtonShow, setIsEditButtonShow] = useState(false)

  function handleMouseOver() {
    setIsEditButtonShow(true)
  }

  function handleMouseLeave() {
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
            return React.cloneElement(child, { key, isEditButtonShow })
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