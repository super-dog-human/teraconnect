import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactTooltip from 'react-tooltip'
import VoiceText from './voiceText';
import LessonController from '../lessonPlayer/lessonController';
import LessonMaterialLoader from './lessonMaterialLoader';
import LessonUtility from '../common/lessonUtility';
import * as Const from '../common/constants';

export default class LessonEditor extends React.Component {
    constructor(props) {
        super(props)

        this.lessonID = props.match.params.id;

        this.state ={
            isLoading: true,
            isUpdating: false,
            isGraphicLoaded: false,
            isTextVoiceLoaded: false,
            avatar: null,
            lesson: {},
            durationSec: 0,
            isPublic: false,
            timelines: [],
            poseKey: {},
        };

        this.loader = new LessonMaterialLoader(this.lessonID);
    }

    async componentDidMount() {
        this._loadMaterials().catch((err) => {
            console.error(err);
            // error modal
        });
    }

    async _loadMaterials() {
        await this._loadLesson();

        if (this.state.lesson.isPacked) { // lesson has been published.
            this.setState({ isTextVoiceLoaded: true, isGraphicLoaded: true });
            this.props.history.push(`/${this.lessonID}`); // FIXME
            return;
        }

        await this._loadRawMaterial();
        await this._loadAvatar();

        await this._setGraphicToTimeline();
        await this._setVoiceTextToTimeline();
    }

    async _loadLesson() {
        const lesson = await LessonUtility.fetchLesson(this.lessonID);
        this.setState({ lesson: lesson });
    }

    async _loadRawMaterial() {
        const material = await LessonUtility.fetchRawLessonMaterial(this.lessonID);
        this.setState({ durationSec: material.durationSec });
        this.setState({ timelines: material.timelines });
        this.setState({ poseKey: material.poseKey });
    }

    async _loadAvatar() {
        const avatarObjectURL = await LessonUtility.fetchAvatarObjectURL(this.state.lesson.avatar);
        const avatar = await this.loader.loadAvatar(avatarObjectURL, this.playerContainer, this.playerElement);
        this.setState({ avatar: avatar });
    }

    async _setGraphicToTimeline() {
        const allGraphicInitCount = this.state.timelines.filter((t) => { return t.graphics; }).length;

        if (allGraphicInitCount == 0) {
            this.setState({ isGraphicLoaded: true });
            return;
        }

        const timelines = await this.loader.fetchAndMergeGraphicToTimeline(this.state.lesson.graphics, this.state.timelines);
        this.setState({ timelines: timelines, isGraphicLoaded: true });
    }

    async _setVoiceTextToTimeline() {
        const allVoiceInitCount = this.state.timelines.filter((t) => { return t.voice.id != ''; }).length; // id has blank when not voice.

        if (allVoiceInitCount == 0) {
            this.setState({ isTextVoiceLoaded: true });
            return;
        }

        const voiceTexts = await LessonUtility.fetchVoiceTexts(this.lessonID);
        if (voiceTexts.length == 0) {
            setTimeout((async () => { await this._setVoiceTextToTimeline(); }), 1000);
            return;
        }

        const timelines = await this.loader.fetchAndMergeVoiceTextToTimeline(this.state.timelines, voiceTexts);
        this.setState({ timelines: timelines });

        if (allVoiceInitCount > voiceTexts.filter((v) => { return v.isConverted && v.isTexted }).length) {
            setTimeout((async () => { await this._setVoiceTextToTimeline(); }), 1000);
            return;
        }

        this.setState({ isTextVoiceLoaded: true });
    }

    async componentDidUpdate() {
        if (!this.state.isLoading) return;

        if (this.state.isGraphicLoaded && this.state.isTextVoiceLoaded) {
            const timelines = await this.loader.fetchVoiceURLsToTimelines(this.lessonID, this.state.timelines);
            this.setState({ isLoading: false, timelines: timelines });
        }
    }

    _changeTimelines(timelines) {
        this.setState({ timelines: timelines });
    }

    _changePublic(event) {
        this.setState({ isPublic: event.target.checked });
    }

    async _publish() {
        this.setState({ isUpdating: true });

        const lesson = {
            id:          this.lessonID,
            version:     this.state.lesson.version + 1,
            durationSec: this.state.durationSec,
            timelines:   this.state.timelines,
            poseKey:     this.state.poseKey,
            isPublic:    this.state.isPublic,
        }

        const result = LessonUtility.publishLesson(lesson).catch((err) => {
            console.error(err);
            // error modal;
            return false;
        });

        if (!result) return;

        this.setState({ isUpdating: false });
        this.props.history.push(`/${this.lessonID}`);
    }

    async _destroy() {
        this.setState({ isUpdating: true });

        this.setState({ isUpdating: false });
    }

    render() {
        return(
            <div id="lesson-editor" className="app-back-color-dark-gray">
                <div className="container-fluid">
                    <div id="lesson-control-panel">
                        <div className="row">
                            <div className="col text-right">
                                <button className="btn btn-primary btn-lg" onClick={this._publish.bind(this)} disabled={this.state.isLoading}>授業を公開する</button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col text-right">
                                <button className="btn btn-danger btn-lg" onClick={this._destroy.bind(this)} disabled={this.state.isLoading}>破棄する</button>
                                {/*
                                <div id="publish-checkbox" className="form-check">
                                    <input type="checkbox" id="is-publish-checkbox" onChange={this._changePublic.bind(this)} />
                                    <label htmlFor="is-publish-checkbox" className="app-text-color-soft-white" data-tip="トップページに作成した授業のリンクを表示します">&nbsp;一般公開</label>
                                </div>
                                */}
                            </div>
                        </div>
                    </div>
                    <div id="editor-body" className="row">
                        <div id="text-editor" className="col-lg-7">
                            <h5 className="app-text-color-soft-white">テキスト編集</h5>
                            <VoiceText isLoading={this.state.isLoading} lessonID={this.lessonID} timelines={this.state.timelines} changeTimelines={this._changeTimelines.bind(this)} />
                            <div id="text-loading-indicator">
                                <FontAwesomeIcon icon="spinner" spin />
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <h5 className="app-text-color-soft-white mb-4">プレビュー</h5>
                            <div id="lesson-preview" className="app-back-color-soft-white m-2" ref={(e) => { this.playerContainer = e; }}>
                                <LessonController
                                    avatar={this.state.avatar}
                                    lesson={{ durationSec: this.state.durationSec, timelines: this.state.timelines, poseKey: this.state.poseKey }}
                                    isLoading={this.state.isLoading}
                                    isPreview={true}
                                    ref={(e) => { this.playerElement = e; }} />
                            </div>
                        </div>
                    </div>
                </div>
                <ReactTooltip />
                <style jsx>{`
                    #lesson-editor {
                        opacity: ${this.state.isLoading ? '0.8' : '1'};
                        width: 100%;
                        height: 100%;
                    }
                    #lesson-control-panel {
                        padding-top: 1.5vw;
                        padding-right: 1vw;
                    }
                    #lesson-control-panel button {
                        width: 13vw;
                        margin-bottom: 1vw;
                        font-size: 1.2vw;
                    }
                    #publish-checkbox {
                        display: none;
                        margin-top: 10px;
                        font-size: 13px;
                    }
                    #publish-checkbox label {
                        cursor: pointer;
                    }
                    #editor-body h5 {
                        font-size: 1vw;
                        margin-left: 1vw;
                    }
                    #text-editor {
                        position: relative;
                        max-height: 100%;
                    }
                    #text-loading-indicator {
                        position: absolute;
                        z-index: 100;
                        width: 10vw;
                        height: 10vw;
                        top: 0;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        margin: auto;
                        display: ${this.state.isLoading || this.state.isUpdating ? 'display' : 'none'};
                        font-size: 10vw;
                        opacity: 0.5;
                    }
                    #lesson-preview {
                        width: 38vw;
                        height: ${38 / Const.RATIO_9_TO_16}vw;
                    }
                `}</style>
            </div>
        )
    }
}