/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react'
import { css } from '@emotion/core'

export default function ContextMenu({ menuOption }) {
  const[isShow, setIsShow] = useState(false)

  const bodyStyle = css({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    filter: 'drop-shadow(2px 2px 2px gray)',
    display: isShow ? 'block' : 'none',
  })

  const menuStyle = css({
    position: 'absolute',
    top: menuOption.position?.y,
    left: menuOption.position?.x,
    borderRadius: '5px',
    backgroundColor: 'var(--dark-gray)',
    paddingTop: '5px',
    paddingBottom: '5px',
  })

  useEffect(() => {
    if (Object.keys(menuOption).length > 0) {
      setIsShow(true)
    } else {
      setIsShow(false)
    }
  }, [menuOption])

  return (
    <>
      {isShow && <div css={bodyStyle} onClick={() => setIsShow(false)}>
        <div css={menuStyle}>
          {menuOption.labels.length > 0 && menuOption.labels.map((label, i) =>
            <div key={i} onClick={menuOption.actions[i]} css={menuTextStyle}>{label}</div>
          )}
        </div>
      </div>
      }
    </>
  )
}

const menuTextStyle = css({
  height: '20px',
  lineHeight: '20px',
  color: 'white',
  fontSize: '14px',
  marginTop: '5px',
  marginBottom: '5px',
  paddingTop: '5px',
  paddingBottom: '5px',
  paddingLeft: '20px',
  paddingRight: '20px',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: 'var(--soft-white)',
    color: 'var(--dark-gray)',
  },
})