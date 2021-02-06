import React from 'react'
import Header from './header'
import Footer from './footer'
import { ClientErrorDialogProvider } from '../libs/contexts/clientErrorDialogContext'
import ClientErrorDialog from './clientErrorDialog'

const Layout = ({ children }) => (
  <>
    <ClientErrorDialogProvider>
      <ClientErrorDialog />
      <Header />
      <main>
        { children }
      </main>
      <Footer />
    </ClientErrorDialogProvider>
  </>
)

export default Layout