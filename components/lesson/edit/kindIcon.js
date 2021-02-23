/** @jsxImportSource @emotion/react */
import React from 'react'
import Image from 'next/image'
import { css } from '@emotion/core'

export default function LessonEditKindIcon({ kind, status, className }) {
  const bodyStyle = css({
    filter: status === 'on' ? 'grayscale(0)' : 'grayscale(1)',
  })

  return(
    <div className={className}>
      {kind && <Image src={`/img/icon/timeline-${kind}.svg`} width={18} height={18} css={bodyStyle} />}
    </div>
  )
}