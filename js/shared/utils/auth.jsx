import auth0 from 'auth0-js'
import { AUTH_REDIRECT_URL, AUTH0_CLIENT_ID } from './constants'

export default class Auth {
    constructor() {
        this.auth0 = new auth0.WebAuth({
            domain: 'teraconnect.auth0.com',
            clientID: AUTH0_CLIENT_ID,
            redirectUri: AUTH_REDIRECT_URL,
            responseType: 'token id_token',
            scope: 'openid profile'
        })
    }

    login() {
        this.auth0.authorize()
    }

    logout() {
        // delete token from localstorage
    }
}
