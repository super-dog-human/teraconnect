import auth0 from 'auth0-js'
import { AUTH0_CLIENT_ID } from './constants'

export const webAuth = new auth0.WebAuth({
    domain: 'teraconnect.auth0.com',
    clientID: AUTH0_CLIENT_ID,
    responseType: 'token id_token',
    scope: 'openid profile',
    language: 'ja'
    //    options: { language: 'ja' }
})

export function isLoggedIn() {
    const auth = localStorage.getItem('auth')
    return auth != undefined
}

export function login() {
    webAuth.authorize()
}

export function afterLoggedIn(params, suceededCallback, failedCallback) {
    if (/access_token|id_token|error/.test(params)) {
        webAuth.parseHash((err, authResult) => {
            if (err) {
                console.error(err)
                failedCallback()
                return
            }

            if (authResult && authResult.accessToken && authResult.idToken) {
                localStorage.setItem('auth', JSON.stringify(authResult))
                webAuth.client.userInfo(authResult.accessToken, function(
                    err,
                    user
                ) {
                    if (err) {
                        failedCallback()
                        return
                    }

                    // Now you have the user's information
                    console.log(user)
                    // scheduleRenewal()
                    suceededCallback()
                })
            } else {
                failedCallback()
            }
        })
    } else {
        failedCallback()
    }
}

export function logout() {
    localStorage.removeItem('auth')
}

function scheduleRenewal() {
    //    renewToken()
}

function renewToken() {
    webAuth.checkSession({}, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            localLogin(result)
        }
    })
}
