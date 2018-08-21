import React from 'react';
import ReactDOM from 'react-dom';
import { Clock } from 'three';
import FontAwesome from 'react-fontawesome'
import LessonAudioPlayer from './lessonAudioPlayer';

export default class LessonPlayer extends React.Component {
    constructor(props) {
        super(props);

        this.lesson         = {};
        this.material       = {};
        this.clock          = new Clock(false);
        this.oldElapsedTime = 0;
        this.playerElement;
        new LessonAudioPlayer().then((player) => {
            this.audioPlayer = player;
        });

        this.state = {
            isLoading: true,
            isPlaying: false,
        }
        this.panelClick = this.panelClick.bind(this);
    }

    render() {
        return(
            <div id="lesson-player" ref={(e) => { this.playerElement = e; }} >
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

        this.lesson   = this.props.loader.lesson;
        this.material = this.props.loader.material;
        this.animate();

        this.setState({ isLoading: false });
    }

    panelClick() {
        if (this.state.isPlaying){
            this.setState({ isPlaying: false });
            this.play(false);
        } else {
            this.setState({ isPlaying: true });
            this.play(true);
        }
    }

    play(isStart) {
        if (isStart) {
            this.clock.start();
        } else {
            this.clock.stop();
        }

        this.audioPlayer.play(isStart); // for stop and resume
        this.props.avatar.play(isStart);
    }

    animate() {
        if (this.clock.elapsedTime >= this.lesson.durationSec) {
            this.play(false);
            return;
            // TODO show control panel after playing.
        }

        requestAnimationFrame(() => this.animate());

        this.props.avatar.animate(this.clock.getDelta());

        const since = this.oldElapsedTime;
        const until = this.clock.elapsedTime;

        this.lesson.timelines.filter((t) => {
            return t.timeSec > since && t.timeSec <= until;
        }).forEach((timeline) => {
            this.playTimelineVoice(timeline.voice);
            this.showTimelineText(timeline.text);
            this.showTimelineGraphic(timeline.graphics);
        });

        this.oldElapsedTime = this.clock.elapsedTime;
    }

    playTimelineVoice(voice) {
        if (!voice) return;

        const url = this.material.voices[voice.fileID].url;
        this.audioPlayer.setAudio(url, voice.durationSec);
    }

    showTimelineText(text) {
        if (!text) return;

        const div = document.createElement('div');
        div.setAttribute('style', 'position: absolute; top: 0; z-index: 10; width: 100%; margin: auto; text-align: center; vertical-align: middle;');

        const span = document.createElement('span');
        span.innerHTML = text.body;

        div.append(span);
        ReactDOM.findDOMNode(this.playerElement).append(div);
    }

    showTimelineGraphic(graphics) {
        if (graphics == null || graphics.length == 0) return;

        graphics.forEach((graphic) => {
            const div = document.createElement('div');
            div.setAttribute('style', 'position: absolute; top: 0; z-index: -100; width: 100%; margin: auto; text-align: center; vertical-align: middle;');

            const img = document.createElement('img');
            const url = this.material.graphics[graphic.id].url;
            img.src = url;

            div.append(img);
            ReactDOM.findDOMNode(this.playerElement).append(div);
        });

    }
}