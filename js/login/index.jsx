import React from 'react'
import { login } from '../shared/utils/authentication'

export default class Login extends React.Component {
    render() {
        return (
            <button
                onClick={() => {
                    login()
                }}
            >
                ログイン
            </button>
        )
    }
}
