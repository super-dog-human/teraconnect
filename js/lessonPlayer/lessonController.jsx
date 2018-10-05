import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Clock } from 'three';
import LessonTexts from './lessonTexts';
import LessonGraphics from './lessonGraphics';
import LessonVoicePlayer from './lessonVoicePlayer';
import * as Const from '../common/constants';

export default class LessonController extends React.Component {
    constructor(props) {
        super(props);

        this.clock             = new Clock(false);
        this.preElapsedTime    = 0;
        this.pausedElapsedTime = 0;
        this.voicePlayer = {};

        this.state = {
            isPlaying: false,
            texts:     [],
            voices:    [],
            graphics:  [],
        }

        this._animate();
    }

    _panelClick(event) {
        this._play(!this.state.isPlaying);
        event.target.blur();
    }

    _play(isStart) {
        if (isStart) {
            this.clock.start();
            if (this.pausedElapsedTime > 0) this.voicePlayer.play(true); // for resume audio
            this.setState({ isPlaying: true });
        } else {
            this.pausedElapsedTime += this.clock.elapsedTime;
            this.clock.stop();
            this.voicePlayer.play(false);
            this.setState({ isPlaying: false });
        }

        this.props.avatar.play(isStart);
    }

    _animate() {
        requestAnimationFrame(() => this._animate());

        if (!this.state.isPlaying) return;

        const elapsedTime = this._elapsedTime();
        if (elapsedTime >= this.props.lesson.durationSec) {
            this._endPlaying();
            return;
        }

        this.props.avatar.animate(this.clock.getDelta());
        this._reflectCurrentContents(elapsedTime);
        this.preElapsedTime = elapsedTime;
    }

    _elapsedTime() {
        return this.clock.elapsedTime + this.pausedElapsedTime;
    }

    _reflectCurrentContents(elapsedTime) {
        const since = this.preElapsedTime;
        const until = elapsedTime;

        this._hideTimelineTextIfNeeded(elapsedTime);

        this.props.lesson.timelines.filter((t) => {
            return t.timeSec > since && t.timeSec <= until;
        }).forEach((timeline) => {
            this._avatarAction(timeline.spAction);
            this._playTimelineVoice(timeline.voice, elapsedTime);
            this._showTimelineText(timeline.text, elapsedTime);
            this._showTimelineGraphic(timeline.graphics);
        });
    }

    _endPlaying() {
        this._play(false);
        this.props.avatar.resetAnimation();
        this.voicePlayer.resetPlaying();

        this.preElapsedTime = 0;
        this.pausedElapsedTime = 0;
        this.setState({ texts: [], voices: [], graphics: [] });
    }

    _avatarAction(action) {
        if (!action) return;

        const faceName = action.faceExpression;
        if (faceName) {
            this.props.avatar.changeFace(faceName);
        }
    }

    _playTimelineVoice(voice, elapsedTime) {
        if (voice.id =='') return;

        this.voicePlayer.setAndPlay(voice.url, voice.durationSec);

        voice.stopAtSec = voice.durationSec + elapsedTime;
        const newVoices = this.state.voices;
        newVoices.push(voice);
        this.setState({ voices: newVoices });
    }

    _showTimelineText(text, elapsedTime) {
        if (text.durationSec == 0) return;

        const newTexts = this.state.texts;
        text.hiddenAtSec = text.durationSec + elapsedTime;
        newTexts.push(text);
        this.setState({ texts: newTexts });
    }

    _hideTimelineTextIfNeeded(elapsedTime) {
        const currentShowingTextLength = this.state.texts.length;
        if (currentShowingTextLength == 0) return;

        const shouldShowingTexts = this.state.texts.filter((text) => {
            return text.hiddenAtSec > elapsedTime;
        });

        if (shouldShowingTexts.length < currentShowingTextLength) {
            this.setState({ texts: shouldShowingTexts });
        }
    }

    _showTimelineGraphic(graphics) {
        if (graphics == null) return;

        graphics.forEach((graphic) => {
            let newGraphics = [];
            switch(graphic.action) {
                case 'show':
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

    componentDidUpdate(prevProps) {
        if (this.props.isLoading) return;

        if (prevProps.isLoading && !this.props.isLoading) {
            this.voicePlayer = new LessonVoicePlayer(this.props.avatar);
            this.props.avatar.setDefaultAnimation();
            this.props.avatar.loadRecordedAnimation(this.props.lesson.poseKey, this.props.lesson.timelines[0]);
            return;
        }

        if (prevProps.lesson.timelines != this.props.lesson.timelines) { // FIXME array comparing
            this._reflectCurrentContents(this._elapsedTime());
        }

        if (prevProps.lesson.poseKey      != this.props.poseKey ||
            prevProps.lesson.timelines[0] != this.props.lesson.timelines[0]) {
            this.props.avatar.loadRecordedAnimation(this.props.lesson.poseKey, this.props.lesson.timelines[0]);
        }
    }

    render() {
        return(
            <div id="lesson-player">
                <div id="control-panel">
                    <div id="loading-indicator">
                        <div id="loading-indicator-icon">
                            <FontAwesomeIcon icon="spinner" spin />
                        </div>
                    </div>
                    <button className="control-btn" onClick={this._panelClick.bind(this)}>
                        <FontAwesomeIcon icon="play-circle" />
                    </button>
                </div>

                <LessonGraphics graphics={this.state.graphics} />
                <LessonTexts texts={this.state.texts} />

                <style jsx>{`
                    #lesson-player {
                        position: relative;
                        width: ${Const.RATIO_9_TO_16 * 100}vh;
                        height: ${Const.RATIO_16_TO_9 * 100}vw;
                        max-width: 100%;
                        max-height: 100%;
                        margin-left: auto;
                        margin-right: auto;
                    }
                    #control-panel {
                        position: absolute;
                        top: 0;
                        z-index: 1000; // control panel
                        width: 100%;
                        height: 100%;
                    }
                    #loading-indicator {
                        position: absolute;
                        top: 0;
                        display: ${this.props.isLoading ? 'table' : 'none'};
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
                    .control-btn {
                        display: ${this.props.isLoading ? 'none' : 'block'};
                        border: none;
                        cursor: pointer;
                        width: 100%;
                        height: 100%;
                        font-size: 10vw;
                        opacity: 0;
                    }
                    .control-btn:focus {
                        outline: 0;
                    }
                    .control-btn:hover {
                        opacity: ${this.props.isLoading || this.state.isPlaying ? 0: 0.2};
                    }
                `}</style>
            </div>
        )
    }
}