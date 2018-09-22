import React from 'react';
import Menu from '../menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactTooltip from 'react-tooltip'
import VoiceText from './voiceText';
import LessonPlayer from '../lessonPlayer';
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
            lesson: {},
            durationSec: 0,
            isPublic: false,
            timelines: [],
            poseKey: {},
        };

        this.loader = new LessonMaterialLoader(this.lessonID);
    }

    async componentDidMount() {
        await this._loadLesson();
        await this._loadRawLessonMaterial();

        if (this.state.lesson.isPacked) {
            this.setState({ isTextVoiceLoaded: true, isGraphicLoaded: true });
            this.props.history.push(`/${this.lessonID}`); // FIXME
            return;
        }

        await this._loadAndMergeGraphicToTimeline();
        await this._loadAndMergeVoiceTextToTimeline();
    }

    async _loadLesson() {
        const lesson = await LessonUtility.fetchLesson(this.lessonID).catch((err) => {
            console.error(err);
            return false;
        });

        if (!lesson) {
            // error modal
            return;
        }

        this.setState({ lesson: lesson });
    }

    async _loadRawLessonMaterial() {
        const material = await this.loader.fetchRawLessonMaterial().catch((err) => {
            console.error(err);
            return false;
        });

        if (!material) {
            // error modal
            return;
        }

        this.setState({ durationSec: material.durationSec });
        this.setState({ timelines: material.timelines });
        this.setState({ poseKey: material.poseKey });
    }

    async _loadAndMergeGraphicToTimeline() {
        const allGraphicInitCount = this.state.timelines.filter((t) => { return t.graphics; }).length;

        if (allGraphicInitCount == 0) {
            this.setState({ isGraphicLoaded: true });
            return;
        }

        const timelines = await this.loader.fetchAndMergeGraphicToTimeline(this.state.lesson.graphics, this.state.timelines).catch((err) => {
            console.error(err);
            // error modal
            return false;
        });

        if (!timelines) return;

        this.setState({ timelines: timelines, isGraphicLoaded: true });
    }

    async _loadAndMergeVoiceTextToTimeline() {
        const allVoiceInitCount = this.state.timelines.filter((t) => { return t.voice.id != ''; }).length; // id has blank when not voice.

        if (allVoiceInitCount == 0) {
            this.setState({ isTextVoiceLoaded: true });
            return;
        }

        const voiceTexts = await this.loader.fetchVoiceTexts().catch((err) => {
            console.error(err);
            // error modal
            return false;
        });

        if (!voiceTexts)　return;

        if (voiceTexts.length == 0) {
            setTimeout((async () => { await this._loadAndMergeVoiceTextToTimeline(); }), 1000);
            return;
        }

        const timelines = await this.loader.fetchAndMergeVoiceTextToTimeline(this.state.timelines, voiceTexts).catch((err) => {
            console.error(err);
            // error modal
            return false;
        });

        if (!timelines) return;

        this.setState({ timelines: timelines });

        if (allVoiceInitCount > voiceTexts.filter((v) => { return v.isConverted && v.isTexted }).length) {
            setTimeout((async () => { await this._loadAndMergeVoiceTextToTimeline(); }), 1000);
            return;
        }

        this.setState({ isTextVoiceLoaded: true });
    }

    async componentDidUpdate() {
        if (!this.state.isLoading) return;

        if (this.state.isGraphicLoaded && this.state.isTextVoiceLoaded) {
            this.setState({ isLoading: false });
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

// <LessonPlayer isPreview={true} />
    render() {
        return(
            <div id="lesson-editor-screen" className="app-back-color-dark-gray">
                <div id="lesson-control-panel">
                    <div id="publish-btn">
                        <button className="btn btn-primary btn-lg" onClick={this._publish.bind(this)} data-tip="作成した授業は、一定時間後に消去されます">完了</button>
                        <div id="publish-checkbox" className="form-check">
                            <input type="checkbox" id="is-publish-checkbox" onChange={this._changePublic.bind(this)} />
                            <label htmlFor="is-publish-checkbox" className="app-text-color-soft-white" data-tip="トップページに作成した授業のリンクを表示します">&nbsp;一般公開</label>
                        </div>
                    </div>
                </div>
                <div id="lesson-editor" ref={(e) => { this.avatarPreview = e; }}>
                    <VoiceText isLoading={this.state.isLoading} lessonID={this.lessonID} timelines={this.state.timelines} changeTimelines={this._changeTimelines.bind(this)} />
                    <div id="loading-indicator">
                        <FontAwesomeIcon icon="spinner" spin />
                    </div>
                </div>
                <ReactTooltip />
                <style jsx>{`
                    #lesson-editor-screen {
                        width: 100%;
                        height: 100%;
                        opacity: ${this.state.isLoading ? '0.8' : '1'};
                    }
                    #lesson-editor {
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
                    #lesson-control-panel {
                        height: 80px;
                        padding-top: 1.5vw;
                        padding-right: 1vw;
                    }
                    #publish-btn {
                        text-align: right;
                    }
                    #publish-checkbox {
                        margin-top: 10px;
                        font-size: 13px;
                    }
                    #publish-checkbox label {
                        cursor: pointer;
                    }
                `}</style>
            </div>
        )
    }
}