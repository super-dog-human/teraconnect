/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function SearchBox() {
  return (
    <>
      <input type="text" css={searchInputStyle} />
      <button>
        <img
          src="/img/search.png"
          srcSet="/img/search.png 1x, /img/search@2x.png 2x"
          alt='検索ボタン'
        />
      </button>
    </>
  )
}

const searchInputStyle = css({
  width: '230px',
  minHeight: '30px',
  padding: '5px',
  lineHeight: '30px',
  fontSize: '16px',
  color: 'var(--dark-gray)',
  letterSpacing: '1px',
})
