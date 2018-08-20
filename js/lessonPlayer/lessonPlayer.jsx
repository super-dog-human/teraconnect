import React from 'react';
import { Clock } from 'three';
import FontAwesome from 'react-fontawesome'

export default class LessonPlayer extends React.Component {
    constructor(props) {
        super(props);

        this.timelines = [];
        this.clock = new Clock(false);
        this.oldElapsedTime = 0;

        this.state = {
            isLoading: true,
            isPlaying: false,
        }
        this.panelClick = this.panelClick.bind(this);
    }

    panelClick() {
        if (this.state.isPlaying){
            this.play(false);
            this.setState({ isPlaying: false });
        } else {
            this.play(true);
            this.setState({ isPlaying: true });
        }
    }
    //  style={{ display: this.state.isLoading ? 'table-cell' : 'none' }}
    render() {
        return(
            <div id="lesson-player">
                <div id="loading-indicator">
                    <FontAwesome name="spinner" spin style={{ display: this.state.isLoading ? 'inline-block' : 'none' }} />
                </div>
                <div id="control-panel">
                    <button className="control-btn" style={{ display: this.state.isLoading ? 'none' : 'block' }} onClick={this.panelClick}>
                        <FontAwesome name="play-circle" />
                    </button>
                </div>
                <style jsx>{`
                    #lesson-player {
                        position: relative;
                        padding-top: 56.25%;
                    }
                    #loading-indicator {
                        position: absolute;
                        display: table-cell;
                        top: 0;
                        z-index: 100;
                        width: 100%;
                        height: 100%;
                        font-size: 300px;
                        opacity: 0.5;
                    }
                    #control-panel {
                        position: absolute;
                        top: 0;
                        z-index: 100;
                        width: 100%;
                        height: 100%;
                        opacity: 0;
                    }
                    #control-panel:hover {
                        opacity: 0.4;
                    }
                    .control-btn {
                        border: none;
                        cursor: pointer;
                        display: table;
                        width: 100%;
                        height: 100%;
                        font-size: 300px;
                    }
                    .control-btn span {
                        text-align: center;
                        vertical-align: middle;
                    }
                `}</style>
            </div>
        )
    }

    componentDidUpdate() {
        if (!this.state.isLoading) return;

        console.log('componentDidUpdate');
        this.timelines = this.props.loader.lesson.timelines;
        this.animate();
        // set fadeout after length sec.

        this.setState({ isLoading: false });
    }

    play(isStart) {
        if (isStart) {
            this.clock.start();
        } else {
            this.clock.stop();
        }
        this.props.avatar.play(isStart);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.props.avatar.animate(this.clock.getDelta());

        const since = this.oldElapsedTime;
        const until = this.clock.elapsedTime;

        this.timelines.filter((t) => {
            return t.timeSec > since && t.timeSec <= until;
        }).forEach((timeline) => {
            this.showTimelineText(timeline.text);
            this.showTimelineGraphic(timeline.graphics);
        });

        this.oldElapsedTime = this.clock.elapsedTime;
    }

    showTimelineText(text) {

    }

    showTimelineGraphic(graphics) {

    }
}