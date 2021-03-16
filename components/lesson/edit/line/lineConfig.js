/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react'
import { css } from '@emotion/core'

export default function LineConfig({ config }) {
  const[isShow, setIsShow] = useState(false)

  const bodyStyle = css({
    display: isShow ? 'block' : 'none',
  })

  useEffect(() => {
    if (Object.keys(config).length > 0) {
      setIsShow(true)
    } else {
      setIsShow(false)
    }
  }, [config])

  return (
    <>
      {isShow && <div css={bodyStyle}>
        {config.kind === 'speech' && <div>音声編集</div>}
      </div>
      }
    </>
  )
}