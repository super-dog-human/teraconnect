/** @jsxImportSource @emotion/react */
import React, { useState, useRef, useEffect } from 'react'
import { css } from '@emotion/core'

export default function ContextMenu({ labels=[], actions=[], position={}, disableMenuIndexes=[], handleDismiss }) {
  const [isShow, setIsShow] = useState(false)
  const [menuPosition, setMenuPosition] = useState({})
  const menuRef = useRef()
  const positionAdjustedRef = useRef(false)

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
    top: menuPosition.y,
    left: menuPosition.x,
    borderRadius: '5px',
    backgroundColor: 'var(--dark-gray)',
    paddingTop: '5px',
    paddingBottom: '5px',
  })

  useEffect(() => {
    if (Object.keys(labels).length > 0) {
      setMenuPosition({ x: position.x, y: position.y })
      setIsShow(true)
      positionAdjustedRef.current = false
    } else {
      setIsShow(false)
    }
  }, [labels, position])

  useEffect(() => {
    if (!isShow) return
    if (positionAdjustedRef.current) return
    positionAdjustedRef.current = true

    // 表示後にしかmenuRefのサイズが確定しないのでuseEffect内で表示位置を調整
    let x = menuPosition.x
    let y = menuPosition.y
    if (window.innerWidth <= menuPosition.x + menuRef.current.clientWidth) {
      x = window.innerWidth - menuRef.current.clientWidth
    }

    if (window.innerHeight <= menuPosition.y + menuRef.current.clientHeight) {
      y = window.innerHeight - menuRef.current.clientHeight
    }

    setMenuPosition({ x, y })
  }, [isShow, menuPosition])

  return (
    <>
      {isShow && <div className='context-menu-z' css={bodyStyle} onClick={handleDismiss}>
        <div css={menuStyle} ref={menuRef}>
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
              whiteSpace: 'nowrap',
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