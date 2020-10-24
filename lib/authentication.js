/*
import { WebAuth } from 'auth0-js'
import { AUTH0_DOMAIN } from '../constants'
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

const REQUEST_MARGIN_MSEC = 10000
let tokenRenewalTimeout

export const webAuth = new WebAuth({
  domain: AUTH0_DOMAIN,
  clientID: publicRuntimeConfig.AUTH0_CLIENT_ID
  //  redirectUri: publicRuntimeConfig.AUTH0_REDIRECT_URI,
  //  responseType: 'token id_token',
  //  scope: 'openid profile'
})

export function signUp(email, password) {
  webAuth.signup(
    {
      connection: 'Username-Password-Authentication',
      email: email,
      password: password,
      user_metadata: { role: 'teacher' }
    },
    function(err) {
      if (err) return alert('Something went wrong: ' + err.message)
      return alert('success signup without login!')
    }
  )
}

export function isLoggedIn() {
  const authString = localStorage.getItem('auth')
  if (authString === null) return false

  const auth = JSON.parse(authString)
  if (auth.expiresAt - REQUEST_MARGIN_MSEC > Date.now()) {
    if (!tokenRenewalTimeout) {
      const expiresIn =
        (auth.expiresAt - REQUEST_MARGIN_MSEC - Date.now()) / 1000
      scheduleRenewalToken(expiresIn)
    }
    return true
  }

  removeAuthToken()
  return false
}

export function login() {
  webAuth.authorize()
}

export function afterLoggedIn(params, suceededCallback, failedCallback) {
  if (/access_token|id_token|error/.test(params)) {
    webAuth.parseHash((err, authResult) => {
      if (err) {
        failedCallback(err)
      } else if (authResult && authResult.accessToken && authResult.idToken) {
        storeAuthToken(authResult)
        scheduleRenewalToken(authResult.expiresIn)
        suceededCallback()
      }
    })
  } else {
    failedCallback()
  }
}

export function fetchUserAccount(callback) {
  webAuth.client.userInfo(accessToken(), function(err, user) {
    if (err) return
    callback(user)
  })
}

export function accessToken() {
  const auth = localStorage.getItem('auth')
  if (auth === null) return
  return auth.accessToken
}

function scheduleRenewalToken(expiresIn) {
  const expireInMsec = expiresIn * 1000
  const delay = expireInMsec - REQUEST_MARGIN_MSEC
  tokenRenewalTimeout = setTimeout(() => {
    renewToken()
  }, delay)
}

function renewToken() {
  console.log('renewToken', Date.now())
  webAuth.checkSession({}, (err, authResult) => {
    if (err) {
      console.error(err)
    } else {
      storeAuthToken(authResult)
      scheduleRenewalToken(authResult.expiresIn)
    }
  })
}

export function logout(callback) {
  clearTimeout(tokenRenewalTimeout)
  removeAuthToken()
  callback()
}

function storeAuthToken(authResult) {
  const currentTimeMsec = Date.now()
  const expireInMsec = authResult.expiresIn * 1000
  authResult.loggedInAt = currentTimeMsec
  authResult.expiresAt = expireInMsec + currentTimeMsec
  localStorage.setItem('auth', JSON.stringify(authResult))
}

function removeAuthToken() {
  localStorage.removeItem('auth')
}
*/
