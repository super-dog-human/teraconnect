/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react'
import { css } from '@emotion/core'

export default function ContextMenu({ labels=[], actions=[], position={}, disableMenuIndexes=[], handleDismiss }) {
  const [isShow, setIsShow] = useState(false)

  const bodyStyle = css({
    position: position.fixed ? 'fixed' : 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    filter: 'drop-shadow(2px 2px 2px gray)',
    userSelect: 'none',
  })

  const menuStyle = css({
    position: 'absolute',
    top: position.y,
    left: position.x,
    borderRadius: '5px',
    backgroundColor: 'var(--dark-gray)',
    paddingTop: '5px',
    paddingBottom: '5px',
  })

  useEffect(() => {
    if (Object.keys(labels).length > 0) {
      setIsShow(true)
    } else {
      setIsShow(false)
    }
  }, [labels])

  return (
    <>
      {isShow && <div className='context-menu-z' css={bodyStyle} onClick={handleDismiss}>
        <div css={menuStyle}>
          {labels.length > 0 && labels.map((label, i) => {
            const disabled = disableMenuIndexes.includes(i)
            const menuTextStyle = css({
              height: '20px',
              lineHeight: '20px',
              color: disabled ? 'var(--text-gray)' : 'white',
              fontSize: '14px',
              marginTop: '5px',
              marginBottom: '5px',
              padding: '5px 20px',
              cursor: disabled ? 'auto' : 'pointer',
              ':hover': {
                backgroundColor: disabled ? 'var(--dark-gray)' : 'var(--soft-white)',
                color: disabled ? 'var(--text-gray)' : 'var(--dark-gray)',
              },
            })

            return (
              <div key={i} onClick={disabled ? null : actions[i]} css={menuTextStyle}>{label}</div>
            )
          })}
        </div>
      </div>
      }
    </>
  )
}