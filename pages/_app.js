import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Provider } from 'next-auth/client'
import { ClientErrorDialogProvider } from '../libs/contexts/clientErrorDialogContext'
import ClientErrorDialog from '../components/clientErrorDialog'
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
      <ClientErrorDialogProvider>
        <ClientErrorDialog />
        <Component {...pageProps} />
      </ClientErrorDialogProvider>
    </Provider>
  )
}