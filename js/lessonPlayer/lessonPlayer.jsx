import React from 'react';
import { Clock } from 'three';
import FontAwesome from 'react-fontawesome'
import LessonTexts from './lessonTexts';
import LessonGraphics from './lessonGraphics';
import LessonVoicePlayer from './lessonVoicePlayer';

export default class LessonPlayer extends React.Component {
    constructor(props) {
        super(props);

        this.lesson            = {};
        this.material          = {};
        this.clock             = new Clock(false);
        this.preElapsedTime    = 0;
        this.pausedElapsedTime = 0;
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

        this.animate();
    }

    render() {
        return(
            <div id="lesson-player" ref={(e) => { this.element = e; }}>
                <div id="control-panel">
                    <div id="loading-indicator">
                        <div id="loading-indicator-icon">
                            <FontAwesome name="spinner" spin />
                        </div>
                    </div>
                    <button className="control-btn" onClick={this.panelClick}>
                        <FontAwesome name="play-circle" />
                    </button>
                </div>

                <LessonTexts texts={this.state.texts}/>
                <LessonGraphics graphics={this.state.graphics} />

                <style jsx>{`
                    #lesson-player {
                        position: relative;
                        padding-top: 56.25%;
                    }
                    #loading-indicator {
                        position: absolute;
                        top: 0;
                        display: ${this.state.isLoading ? 'table' : 'none'};
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
                        display: ${this.state.isLoading ? 'none' : 'block'};
                        border: none;
                        cursor: pointer;
                        width: 100%;
                        height: 100%;
                        font-size: 10vw;
                        opacity: 0;
                    }
                    .control-btn:hover {
                        opacity: ${this.state.isLoading || this.state.isPlaying ? 0: 0.2};
                    }
                `}</style>
            </div>
        )
    }

    componentDidUpdate() {
        if (!this.state.isLoading) return;

        this.lesson   = this.props.loader.lesson;
        this.material = this.props.loader.material;

        this.setState({ isLoading: false });
    }

    panelClick() {
        if (this.state.isPlaying){
            this.play(false);
        } else {
            this.play(true);
        }
    }

    play(isStart) {
        if (isStart) {
            this.clock.start();
            if (this.pausedElapsedTime > 0) this.voicePlayer.play(true);
            this.setState({ isPlaying: true });
        } else {
            this.pausedElapsedTime += this.clock.elapsedTime;
            this.clock.stop();
            this.voicePlayer.play(false);
            this.setState({ isPlaying: false });
        }

        this.props.avatar.play(isStart);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (!this.state.isPlaying) return;

        const elapsedTime = this.clock.elapsedTime + this.pausedElapsedTime;

        if (elapsedTime >= this.lesson.durationSec) {
            this.play(false);
            this.preElapsedTime = 0;
            this.pausedElapsedTime = 0;
            return;
        }

        this.props.avatar.animate(this.clock.getDelta());

        const since = this.preElapsedTime;
        const until = elapsedTime;

        this.hideTimelineTextIfNeeded(elapsedTime);

        this.lesson.timelines.filter((t) => {
            return t.timeSec > since && t.timeSec <= until;
        }).forEach((timeline) => {
            this.playTimelineVoice(timeline.voice);
            this.showTimelineText(timeline.text, elapsedTime);
            this.showTimelineGraphic(timeline.graphics);
        });

        this.preElapsedTime = elapsedTime;
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

    hideTimelineTextIfNeeded(elapsedTime) {
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
        if (graphics == null || graphics.length == 0) return;

        graphics.forEach((graphic) => {
            let newGraphics = [];
            switch(graphic.action) {
                case 'show':
                    graphic.url = this.material.graphics[graphic.id].url;
                    newGraphics = this.state.graphics;
                    newGraphics.push(graphic);
                    this.setState({ graphics: newGraphics });
                    break;
                case 'hide':
                    const currentGraphicsLength = this.state.graphics.length;
                    if (currentGraphicsLength == 0) break;

                    const targetGraphicID = graphic.id;
                    newGraphics = this.state.graphics.filter((graphic) => {
                        return graphic.id != targetGraphicID;
                    });

                    if (newGraphics.length != this.state.graphics) {
                        this.setState({ graphics: newGraphics });
                    }
                    break;
            }
        });
    }
}