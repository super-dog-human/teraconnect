import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { randomBytes } from "crypto"
import { GA_TRACKING_ID } from '../libs/constants'

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    const nonce = randomBytes(128).toString("base64");
    return { ...initialProps, nonce }
  }

  render() {
    const nonce = this.props.nonce
    const csp = `script-src 'nonce-${nonce}' 'unsafe-inline' 'unsafe-eval' 'strict-dynamic' https: http:; object-src 'none'; base-uri 'none';`

    return (
      <Html lang="ja-JP">
        <Head nonce={nonce}>
          <meta name="description" content="アバターを通じて簡単に授業を収録・編集し、公開できるプラットフォームです。" />
          <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION} />
          <meta httpEquiv="Content-Security-Policy" content={csp} />
          <script src='https://www.youtube.com/iframe_api' nonce={nonce} />
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} nonce={nonce} />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_TRACKING_ID}', {
                    page_path: window.location.pathname,
                    transport_type: 'beacon'
                  });
                  `,
            }}
            nonce={nonce}
          />
        </Head>
        <body>
          <Main />
          <NextScript nonce={nonce} />
        </body>
      </Html>
    )
  }
}
