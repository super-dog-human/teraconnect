/** @jsxImportSource @emotion/react */
import React, { useEffect } from 'react'
import { css } from '@emotion/core'

export default function LessonAvatar(props) {
  const bodyStyle = css({
    position: 'absolute',
    top: 0,
    display: props.loading ? 'none' : 'block',
    width: '100%',
    height: '100%',
  })

  useEffect(() => {
    props.setLoading(false)

  }, [props.config])

  /*
  function handleLoad() {
    props.setLoading(false)
  }
*/

  return (
    <div css={bodyStyle} className='avatar-z'>
      avatar
    </div>
  )
}
