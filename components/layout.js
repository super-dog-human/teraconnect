/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import Header from './header/'
import Footer from './footer'

const Layout = ({ currentPage, children }) => (
  <>
    <Header currentPage={currentPage} />
    <main css={marginStyle}>
      { children }
    </main>
    <Footer />
  </>
)

const marginStyle = css({
  marginTop: '60px',
})

export default Layout