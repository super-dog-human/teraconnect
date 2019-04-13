import React from 'react'
import { Redirect } from 'react-router-dom'
import { isLoggedIn } from '../shared/utils/authentication'

export default props => {
    return isLoggedIn() ? props.children : <Redirect to={'/login'} />
}
