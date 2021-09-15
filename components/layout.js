import React from 'react'
import Header from './header/'
import Footer from './footer'

const Layout = ({ currentPage, children }) => (
  <>
    <Header currentPage={currentPage} />
    <main>
      { children }
    </main>
    <Footer />
  </>
)

export default Layout