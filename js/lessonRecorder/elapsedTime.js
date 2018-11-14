import React from 'react'
import { stringToMinutesFormat } from '../common/utility'

export default class ElapsedTime extends React.Component {
    constructor(props) {
        super(props)

        this.maxRecordingTimeSec = 60 * 10
        this.state = {
            elapsedTimeString: stringToMinutesFormat(0)
        }
    }

    componentDidMount() {
        this._updateCurrentRecordingTime()
    }

    _updateCurrentRecordingTime() {
        const interval = setInterval(() => {
            const currentSec = this.props.currentRecordingTime()
            this.setState({
                elapsedTimeString: stringToMinutesFormat(currentSec)
            })

            if (this.maxRecordingTimeSec <= currentSec) {
                this.props.stopRecording()
                clearInterval(interval)
            }

            if (!this.props.isRecording) {
                clearInterval(interval)
            }
        }, 100)
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.isRecording && this.props.isRecording) {
            this._updateCurrentRecordingTime()
            return
        }
    }

    render() {
        return (
            <div id="elapsed-time">
                {this.state.elapsedTimeString}
                <style jsx>{`
                    #elapsed-time {
                        font-size: 1.5vw;
                        font-weight: bold;
                    }
                `}</style>
            </div>
        )
    }
}
