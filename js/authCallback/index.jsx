import React, { useEffect, useContext } from 'react'
import { __RouterContext } from 'react-router'
import { afterLoggedIn } from '../shared/utils/authentication'

export default props => {
    const router = useContext(__RouterContext)
    useEffect(() => {
        const suceededCallback = () => {
            router.history.replace('/')
        }
        const failedCallback = err => {
            console.error('login failed', err)
        }
        afterLoggedIn(props.location.hash, suceededCallback, failedCallback)
    }, [])

    return <div>ログイン中...</div>
}
