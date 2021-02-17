import React, { useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Provider } from 'next-auth/client'
import { ErrorDialogContext, ErrorDialogProvider } from '../libs/contexts/errorDialogContext'
import ErrorBoundary from '../components/errorBoundary'
import ErrorDialog from '../components/errorDialog'
import { DialogProvider } from '../libs/contexts/dialogContext'
import Dialog from '../components/dialog'
import * as gtag from '../libs/gtag'
import '../app.css'

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render')
  whyDidYouRender(React)
}

export default function App ({ Component, pageProps }) {
  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0" />
      </Head>
      <Provider session={pageProps.session}>
        <ErrorDialogProvider>
          <DialogProvider>
            <ErrorDialogContext.Consumer>
              {({ showError }) => (
                <ErrorBoundary showError={showError}>
                  <ErrorDialog />
                  <Dialog />
                  <Component {...pageProps} />
                </ErrorBoundary>
              )}
            </ErrorDialogContext.Consumer>
          </DialogProvider>
        </ErrorDialogProvider>
      </Provider>
    </>
  )
}