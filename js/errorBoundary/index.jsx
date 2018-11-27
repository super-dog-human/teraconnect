import React from 'react'
import { sendExceptionToGA } from '../shared/utils/utility'

export default class ErrorBoundary extends React.Component {
    constructor() {
        super()

        this.state = { hasError: false }
    }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    componentDidCatch(err) {
        sendExceptionToGA(this.constructor.name, err, true)
    }

    render() {
        if (this.state.hasError) {
            return <>致命的なエラーが発生しました。</>
        }

        return <>{this.props.children}</>
    }
}
