import React from 'react'
import { IndicatorContext } from '../context'

export default class Indicator extends React.Component {
    static contextType = IndicatorContext

    constructor() {
        super()
    }

    render() {
        return <div>{this.context.isLoading}</div>
    }
}
