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

    async _confirmPublish() {
        const result = confirm('授業を公開しますか？\n\n・授業は約10日間公開され、その後自動で削除されます\n・再生画面のURLへアクセスすると、誰でも閲覧可能な状態になります');
        if (result) {
            this._publish();
        }
    }

    async _confirmDestroy() {
        const result = confirm('収録した授業を、公開せずに削除しますか？');
        if (result) this._destroy();
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
            return false;
        });

        this.setState({ isUpdating: false });

        if (result) {
            this.props.history.push(`/${this.lessonID}`);
        } else {
            alert('授業の公開に失敗しました。再度試しても失敗する場合は、運営者に連絡してください。');
            return;
        }
    }

    async _destroy() {
        this.setState({ isLoading: true });

        const result = await LessonUtility.deleteLesson(this.lessonID).catch((err) => {
            console.error(err);
            return false;
        });

        this.setState({ isLoading: false });

        if (result) {
            alert('授業を削除しました。');
            location.href = '/';
        } else {
            alert('授業の削除に失敗しました。再度試しても失敗する場合は、運営者に連絡してください。');
        }
    }

    render() {
        return(
            <div id="lesson-editor" className="app-back-color-dark-gray">
                <div className="container-fluid">
                    <div id="lesson-control-panel">
                        <div className="row">
                            <div className="col text-right">
                                <button className="btn btn-primary btn-lg" onClick={this._confirmPublish.bind(this)} disabled={this.state.isLoading} data-tip="授業を公開状態にします">授業を公開する</button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col text-right">
                                <button className="btn btn-danger btn-lg" onClick={this._confirmDestroy.bind(this)} disabled={this.state.isLoading} data-tip="授業をすぐに破棄します">破棄する</button>
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
                <ReactTooltip className="tooltip" place="bottom" type="warning" />
                <style jsx>{`
                    #lesson-editor {
                        opacity: ${this.state.isLoading ? '0.8' : '1'};
                        width: 100%;
                        height: 100%;
                    }
                    #lesson-control-panel {
                        padding-top: 20px;
                        padding-right: 20px;
                    }
                    #lesson-control-panel button {
                        width: 150px;
                        margin-bottom: 20px;
                        font-size: 17px;
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
                        z-index: 1100; // indicator
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