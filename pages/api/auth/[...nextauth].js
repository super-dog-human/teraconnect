import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const options = {
  providers: [
    Providers.Apple({
      clientId: process.env.APPLE_CLIENT_ID,
      clientSecret: process.env.APPLE_CLIENT_SECRET
    }),
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    Providers.Twitter({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    jwt: true,
    maxAge: 1 * 24 * 60 * 60, // 1 day
  },
  jwt: {
    signingKey: process.env.JWT_SIGNING_PRIVATE_KEY,
    verificationOptions:  {},
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
  debug: process.env.IS_DEBUG,
}

export default (req, res) => NextAuth(req, res, options)