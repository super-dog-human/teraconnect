import React, { useEffect, useContext } from 'react'
import { __RouterContext } from 'react-router'
import { afterLoggedIn } from '../shared/utils/authentication'

export default props => {
    const router = useContext(__RouterContext)
    useEffect(() => {
        const suceededCallback = () => {
            console.log('成功')
            router.history.replace('/')
        }
        const failedCallback = () => {
            console.error('ログイン失敗')
        }
        afterLoggedIn(props.location.hash, suceededCallback, failedCallback)
    }, [])

    return <div>ログイン中...</div>
}
