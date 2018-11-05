import React from 'react'
import ReactGA from 'react-ga'
import { isProduction } from '../common/utility'
import { GA_TRACKING_ID } from '../common/constants'

export default class ErrorBoundary extends React.Component {
    constructor() {
        super()

        ReactGA.initialize(GA_TRACKING_ID)
    }

    componentDidCatch(error, errorInfo) {
        if (isProduction()) {
            ReactGA.exception({
                description: `${error}\n${errorInfo}`,
                fatal: true
            })
        }
    }

    render() {
        return <>{this.props.children}</>
    }
}
