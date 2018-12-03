import auth0 from 'auth0-js'
import { isProduction } from './utility'

const productionClientID = 'm0b05bVI1hIfAjNE20V6YDHU4lmk5eG4'
const developmentClientID = 'fKN9OEt7vlcyspp8qLrvPqFteSXGI8DO'
const productionRedirectURL = 'https://teraconnect.org/auth_callback'
const developmentRedirectURL = 'http://localhost:3000/auth_callback'

export default class Auth {
    auth0 = new auth0.WebAuth({
        domain: 'teraconnect.auth0.com',
        clientID: isProduction() ? productionClientID : developmentClientID,
        redirectUri: isProduction()
            ? productionRedirectURL
            : developmentRedirectURL,
        responseType: 'token id_token',
        scope: 'openid'
    })

    login() {
        this.auth0.authorize()
    }
}
