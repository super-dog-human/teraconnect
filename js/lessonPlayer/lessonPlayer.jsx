import React from 'react';
import { Clock } from 'three';
import FontAwesome from 'react-fontawesome'
import LessonTexts from './lessonTexts';
import LessonVoicePlayer from './lessonVoicePlayer';

export default class LessonPlayer extends React.Component {
    constructor(props) {
        super(props);

        this.lesson         = {};
        this.material       = {};
        this.clock          = new Clock(false);
        this.oldElapsedTime = 0;
        this.element;
        new LessonVoicePlayer().then((player) => {
            this.voicePlayer = player;
        });

        this.state = {
            isLoading: true,
            isPlaying: false,
            texts:     [],
            graphics:  [],
        }
        this.panelClick = this.panelClick.bind(this);
    }

    render() {
        return(
            <div id="lesson-player" ref={(e) => { this.element = e; }}>
                <div id="control-panel">
                    <div id="loading-indicator" style={{ display: this.state.isLoading ? 'table' : 'none' }}>
                        <div id="loading-indicator-icon">
                            <FontAwesome name="spinner" spin />
                        </div>
                    </div>
                    <button className="control-btn" style={{ display: this.state.isLoading ? 'none' : 'block' }} onClick={this.panelClick}>
                        <FontAwesome name="play-circle" />
                    </button>
                </div>
                <LessonTexts texts={this.state.texts}/>
                <style jsx>{`
                    #lesson-player {
                        position: relative;
                        padding-top: 56.25%;
                    }
                    #loading-indicator {
                        position: absolute;
                        top: 0;
                        width: 100%;
                        height: 100%;
                    }
                    #loading-indicator-icon {
                        display: table-cell;
                        text-align: center;
                        vertical-align: middle;
                        font-size: 10vw;
                        opacity: 0.5;
                    }
                    #control-panel {
                        position: absolute;
                        top: 0;
                        z-index: 100;
                        width: 100%;
                        height: 100%;
                    }
                    .control-btn {
                        border: none;
                        cursor: pointer;
                        width: 100%;
                        height: 100%;
                        font-size: 10vw;
                        opacity: 0;
                    }
                    .control-btn:hover {
                        opacity: 0.2;
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

        this.voicePlayer.play(isStart); // for stop and resume
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

        this.hideTimeline(until);

        this.lesson.timelines.filter((t) => {
            return t.timeSec > since && t.timeSec <= until;
        }).forEach((timeline) => {
            this.playTimelineVoice(timeline.voice);
            this.showTimelineText(timeline.text, until);
            this.showTimelineGraphic(timeline.graphics);
        });

        this.oldElapsedTime = this.clock.elapsedTime;
    }

    playTimelineVoice(voice) {
        if (!voice) return;

        const url = this.material.voices[voice.id].url;
        this.voicePlayer.setAndPlay(url, voice.durationSec);
    }

    showTimelineText(text, elapsedTime) {
        if (!text) return;

        const newTexts = this.state.texts;
        text.hiddenAtSec = text.durationSec + elapsedTime;
        newTexts.push(text);
        this.setState({ texts: newTexts });
    }

    hideTimeline(elapsedTime) {
        const currentTextLength = this.state.texts.length;
        if (currentTextLength == 0) return;

        const newTexts = this.state.texts.filter((text) => {
            return text.hiddenAtSec > elapsedTime;
        });

        if (newTexts.length != currentTextLength) {
            this.setState({ texts: newTexts });
        }
    }

    showTimelineGraphic(graphics) {
        /*
        if (graphics == null || graphics.length == 0) return;

        graphics.forEach((graphic) => {
            const div = document.createElement('div');
            div.setAttribute('style', 'position: absolute; top: 0; z-index: -100; width: 100%; margin: auto; text-align: center; vertical-align: middle;');

            const img = document.createElement('img');
            const url = this.material.graphics[graphic.id].url;
            img.src = url;

            div.append(img);
            ReactDOM.findDOMNode(this.element).append(div);
        });
        */
    }
}