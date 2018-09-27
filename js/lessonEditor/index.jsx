import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactTooltip from 'react-tooltip'
import VoiceText from './voiceText';
import LessonPlayer from '../lessonPlayer/lessonPlayer';
import LessonMaterialLoader from './lessonMaterialLoader';
import LessonUtility from '../common/lessonUtility';

export default class LessonEditor extends React.Component {
    constructor(props) {
        super(props)

        this.lessonID = props.match.params.id;

        this.state ={
            isLoading: true,
            isUploading: false,
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
        await this._loadRawMaterial();
        await this._loadAvatar();

        if (this.state.lesson.isPacked) { // lesson has been published.
            this.setState({ isTextVoiceLoaded: true, isGraphicLoaded: true });
            this.props.history.push(`/${this.lessonID}`); // FIXME
            return;
        }

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
            const timelines = this.loader.fetchVoiceURLsToTimelines(this.state.timelines);
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
        this.setState({ isUploading: true });

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

        this.setState({ isUploading: false });
        this.props.history.push(`/${this.lessonID}`);
    }

    render() {
        return(
            <div id="lesson-editor" className="app-back-color-dark-gray">
                <div className="container">
                    <div id="lesson-control-panel" className="row">
                        <div id="publish-btn" className="col">
                            <button className="btn btn-primary btn-lg" onClick={this._publish.bind(this)} disabled={this.state.isLoading} data-tip="授業は約10日後に自動で消去されます">公開する</button>
                            {/*
                            <div id="publish-checkbox" className="form-check">
                                <input type="checkbox" id="is-publish-checkbox" onChange={this._changePublic.bind(this)} />
                                <label htmlFor="is-publish-checkbox" className="app-text-color-soft-white" data-tip="トップページに作成した授業のリンクを表示します">&nbsp;一般公開</label>
                            </div>
                            */}
                        </div>
                    </div>
                    <div className="row">
                        <div id="text-editor" className="col-lg-8">
                            <VoiceText isLoading={this.state.isLoading} lessonID={this.lessonID} timelines={this.state.timelines} changeTimelines={this._changeTimelines.bind(this)} />
                            <div id="loading-indicator">
                                <FontAwesomeIcon icon="spinner" spin />
                            </div>
                        </div>
                        <div id="lesson-preview" className="col-lg-4">
                            <div className="app-back-color-soft-white m-2" ref={(e) => { this.playerContainer = e; }}>
                                <LessonPlayer avatar={this.state.avatar} lesson={{ durationSec: this.state.durationSec, timelines: this.state.timelines, poseKey: this.state.poseKey }} isLoading={this.state.isLoading} ref={(e) => { this.playerElement = e; }} />
                            </div>
                        </div>
                    </div>
                </div>
                <ReactTooltip />
                <style jsx>{`
                    #lesson-editor {
                        width: 100%;
                        height: 100%;
                        opacity: ${this.state.isLoading ? '0.8' : '1'};
                    }
                    #lesson-control-panel {
                        height: 80px;
                        padding-top: 1.5vw;
                        padding-right: 1vw;
                    }
                    #publish-btn {
                        text-align: right;
                    }
                    #publish-checkbox {
                        display: none;
                        margin-top: 10px;
                        font-size: 13px;
                    }
                    #publish-checkbox label {
                        cursor: pointer;
                    }
                    #text-editor {
                        position: relative;
                        width: 100%;
                        max-height: 100%;
                    }
                    #loading-indicator {
                        position: absolute;
                        z-index: 100;
                        width: 10vw;
                        height: 10vw;
                        top: 0;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        margin: auto;
                        display: ${this.state.isLoading || this.state.isUploading ? 'display' : 'none'};
                        font-size: 10vw;
                        opacity: 0.5;
                    }
                    #lesson-preview {
                    }
                `}</style>
            </div>
        )
    }
}