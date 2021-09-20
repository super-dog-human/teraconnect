import React, { useEffect } from 'react'
import Head from 'next/head'
import Script from 'next/script'
import { useRouter } from 'next/router'
import { Provider } from 'next-auth/client'
import { ScreenClassProvider } from 'react-grid-system'
import { ErrorDialogContext, ErrorDialogProvider } from '../libs/contexts/errorDialogContext'
import ErrorBoundary from '../components/errorBoundary'
import ErrorDialog from '../components/errorDialog'
import { DialogProvider } from '../libs/contexts/dialogContext'
import Dialog from '../components/dialog/'
import * as gtag from '../libs/gtag'
import '../app.css'

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render')
  whyDidYouRender(React)
}

const youTubePlayerSrc = 'https://www.youtube.com/iframe_api'

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
        <meta name="description" content="アバターを通じて簡単に授業を収録・編集し、公開できるプラットフォームです。" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0" />
        <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION} />
      </Head>
      <Script src={youTubePlayerSrc} strategy="beforeInteractive" />
      <Provider session={pageProps.session}>
        <ScreenClassProvider>
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
        </ScreenClassProvider>
      </Provider>
    </>
  )
}