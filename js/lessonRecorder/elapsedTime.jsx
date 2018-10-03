import React from 'react';

export default class ElapsedTime extends React.Component {
    constructor(props) {
        super(props)

        this.maxRecordingTimeSec = 60 * 10;
        this.state = {
            elapsedTimeString: '00:00',
        };
    }

    componentDidMount() {
        this._reflectCurrentRecordingTime();
    }

    _reflectCurrentRecordingTime() {
        const interval = setInterval(() => {
            const currentSec= this.props.recorder.currentRecordingTime();
            this.setState({ elapsedTimeString: this._recordSecondsToString(currentSec) });

            if (this.maxRecordingTimeSec <= currentSec) {
                this.props.stopRecording();
                clearInterval(interval);
            }

            if (!this.props.isRecording) {
                clearInterval(interval);
            }
        }, 100);
    }

    _recordSecondsToString(currentSecWithFloat) {
        const currentSec = Math.floor(currentSecWithFloat);
        const minutes = Math.floor(currentSec / 60).toString();
        const seconds = (currentSec - (minutes * 60)).toString();
        return `${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.isRecording && this.props.isRecording) {
            this._reflectCurrentRecordingTime();
            return;
        }
    }

    render() {
        return(
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