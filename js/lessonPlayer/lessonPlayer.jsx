import React from 'react';
import { Clock } from 'three';
import FontAwesome from 'react-fontawesome'

export default class LessonPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.timelines = [];
        this.clock = new Clock(false);
        this.oldElapsedTime = 0;

        this.playClick = this.playClick.bind(this);
    }

    playClick() {
        console.log(this);
        this.play(true);
    }

// pause-circle
    render() {
        return(
            <div id="lesson-player">
                <div id="control-panel">
                    <button className="control-btn" onClick={this.playClick}>
                        <FontAwesome name="play-circle" />
                    </button>
                </div>
                <style jsx>{`
                    #lesson-player {
                        position: relative;
                        padding-top: 56.25%;
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
                        cursor: pointer;
                        display: table;
                        width: 100%;
                        height: 100%;
                        font-size: 300px;
                    }
                    .control-btn span {
                        display: table-cell;
                        text-align: center;
                        vertical-align: middle;
                    }
                `}</style>
            </div>
        )
    }

    componentDidUpdate() {
        this.timelines = this.props.loader.lesson.timelines;
        this.animate();
        // set fadeout after length sec.
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