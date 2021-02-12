import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Provider } from 'next-auth/client'
import { ErrorDialogProvider } from '../libs/contexts/errorDialogContext'
import ClientErrorDialog from '../components/errorDialog/clientError'
import GlobalErrorDialog from '../components/errorDialog/globalError'
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
    <GlobalErrorDialog>
      <Provider session={pageProps.session}>
        <ErrorDialogProvider>
          <ClientErrorDialog />
          <Component {...pageProps} />
        </ErrorDialogProvider>
      </Provider>
    </GlobalErrorDialog>
  )
}