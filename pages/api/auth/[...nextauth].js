import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import TwitterProvider from 'next-auth/providers/twitter'

const options = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    jwt: true,
    maxAge: 24 * 60 * 60, // 1 day
  },
  jwt: {
    signingKey: process.env.JWT_SIGNING_PRIVATE_KEY,
    verificationOptions:  {},
  },
  cookies: {
    sessionToken: {
      name: '__Secure-session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        domain: process.env.NEXT_PUBLIC_TERACONNECT_COOKIE_DOMAIN,
      },
    },
  },
  pages: {
    // signIn: '/api/auth/signin',  // Displays signin buttons
    // signOut: '/api/auth/signout', // Displays form with sign out button
    // error: '/api/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/api/auth/verify-request', // Used for check email page
    // newUser: null // If set, new users will be directed here on first sign in
  },
  callbacks: {
    // signIn: async (user, account, profile) => { return Promise.resolve(true) },
    redirect: async (url) => {
      return Promise.resolve(url)
    },
    // session: async (session, user) => { return Promise.resolve(session) },
    jwt: async (token, _, account) => {
      if (account && account.provider) { token.provider = account.provider }
      if (account && account.id) { token.id = account.id }
      return Promise.resolve(token)
    }
  },
  // Events are useful for logging
  // https://next-auth.js.org/configuration/events
  events: { },
  debug: true,
}

export default (req, res) => NextAuth(req, res, options)