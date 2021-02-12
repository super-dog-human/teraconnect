import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Provider } from 'next-auth/client'
import { ErrorDialogContext, ErrorDialogProvider } from '../libs/contexts/errorDialogContext'
import ErrorBoundary from '../components/errorBoundary'
import ErrorDialog from '../components/errorDialog'
import Dialog from '../components/dialog'
import * as gtag from '../libs/gtag'
import whyDidYouRender from '@welldone-software/why-did-you-render'
import '../app.css'

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
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
    <Provider session={pageProps.session}>
      <ErrorDialogProvider>
        <ErrorDialogContext.Consumer>
          {({ showError }) => (
            <ErrorBoundary showError={showError}>
              <ErrorDialog />
              <Dialog />
              <Component {...pageProps} />
            </ErrorBoundary>
          )}
        </ErrorDialogContext.Consumer>
      </ErrorDialogProvider>
    </Provider>
  )
}