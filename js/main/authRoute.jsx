import React from 'react'
import { Redirect } from 'react-router-dom'

export default props =>
    props.isLoggedIn ? props.children : <Redirect to={'/login'} />
