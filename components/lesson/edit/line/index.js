import React, { useState } from 'react'

export default function LessonLine({ className, children }) {
  const [isEditButtonShow, setIsEditButtonShow] = useState(false)

  function handleMouseOver() {
    setIsEditButtonShow(true)
  }

  function handleMouseLeave() {
    setIsEditButtonShow(false)
  }

  return (
    <div className={className} onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
      {children.map((child, key) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { key, isEditButtonShow })
        }
        return child
      })}
    </div>
  )
}