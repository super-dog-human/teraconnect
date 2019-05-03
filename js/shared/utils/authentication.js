import auth0 from 'auth0-js'
import { AUTH0_CLIENT_ID } from './constants'

const REQUEST_MARGIN_MSEC = 10000
let tokenRenewalTimeout

export const webAuth = new auth0.WebAuth({
    domain: 'teraconnect.auth0.com',
    clientID: AUTH0_CLIENT_ID,
    responseType: 'token id_token',
    scope: 'openid profile'
})

export function isLoggedIn() {
    const authString = localStorage.getItem('auth')
    if (authString === null) return false

    const auth = JSON.parse(authString)
    if (auth.expiresAt - REQUEST_MARGIN_MSEC > Date.now()) {
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
            } else if (
                authResult &&
                authResult.accessToken &&
                authResult.idToken
            ) {
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
    webAuth.checkSession({}, (err, authResult) => {
        if (err) {
            console.error(err)
        } else {
            storeAuthToken(authResult)
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
