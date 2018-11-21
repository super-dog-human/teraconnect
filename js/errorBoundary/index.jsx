import React from 'react'
import ReactGA from 'react-ga'
import { isProduction } from '../shared/utils/utility'

export default class ErrorBoundary extends React.Component {
    constructor() {
        super()

        this.state = { hasError: false }
    }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    componentDidCatch(err) {
        if (isProduction()) {
            ReactGA.exception({
                description: `${err.message} ${err.stack}`,
                fatal: true
            })
        }
    }

    render() {
        if (this.state.hasError) {
            return <>致命的なエラーが発生しました。</>
        }

        return <>{this.props.children}</>
    }
}
