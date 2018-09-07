import React from 'react';
import Menu from '../menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TextForms from './textForms';
import LessonPlayer from '../lessonPlayer';
import LessonMaterialLoader from './lessonMaterialLoader';
import LessonMaterialUploader from './lessonMaterialUploader';

export default class LessonEditor extends React.Component {
    constructor(props) {
        super(props)

        this.lessonID = props.match.params.id;

        this.allGraphicInitCount = 0
        this.allVoiceInitCount = 0;

        this.state ={
            isLoading: true,
            isUploading: false,
            isGraphicLoaded: false,
            isTextVoiceLoaded: false,
            durationSec: 0,
            timelines: [],
            poseKey: {},
        }

        this.loader = new LessonMaterialLoader(this.lessonID);
        this.uploader = new LessonMaterialUploader(this.lessonID);
    }

    async componentDidMount() {
        await this._loadRawLessonMaterial();
        await this._loadAndMergeGraphicToTimeline();
        await this._loadAndMergeVoiceTextToTimeline();
    }

    async _loadRawLessonMaterial() {
        const lesson = await this.loader.fetchRawLessonMaterial().catch((err) => {
            console.error(err);
            return false;
        });

        if (!lesson) {
            // error modal
            return;
        }

        this.setState({ durationSec: lesson.durationSec });
        this.setState({ timelines: lesson.timelines });
        this.setState({ poseKey: lesson.poseKey });

        this.allGraphicInitCount = this.state.timelines
            .filter((t) => { return t.graphics; }).length;

        this.allVoiceInitCount = this.state.timelines
            .filter((t) => { return t.voice.id != ''; }).length; // id has blank when not voice.
    }

    async _loadAndMergeGraphicToTimeline() {
        if (this.allGraphicInitCount == 0) return;

        const timelines = await this.loader.fetchAndMergeGraphicToTimeline(this.state.timelines).catch((err) => {
            console.error(err);
            return false;
        });

        if (!timelines) {
            // error modal
            return;
        }

        this.setState({ timelines: timelines, isGraphicLoaded: true });
    }

    async _loadAndMergeVoiceTextToTimeline() {
        if (this.allVoiceInitCount == 0) return;

        const voiceTexts = await this.loader.fetchVoiceTexts().catch((err) => {
            console.error(err);
            return false;
        });

        if (!voiceTexts) {
            // error modal
            return;
        }

        if (voiceTexts.length == 0) {
            setTimeout((async () => { await this._loadAndMergeVoiceTextToTimeline(); }), 1000);
            return;
        }

        const timelines = await this.loader.fetchAndMergeVoiceTextToTimeline(this.state.timelines, voiceTexts).catch((err) => {
            console.error(err);
            return false;
        });

        if (!timelines) {
            // error modal
            return;
        }

        this.setState({ timelines: timelines });

        if (this.allVoiceInitCount > voiceTexts.filter((v) => { return v.isConverted && v.isTexted }).length) {
            setTimeout((async () => { await this._loadAndMergeVoiceTextToTimeline(); }), 1000);
            return;
        }

        this.setState({ isTextVoiceLoaded: true });
    }

    async componentDidUpdate(prevProps, prevState) {
        if (!this.state.isLoading) return;

        if (this.state.isGraphicLoaded && this.state.isTextVoiceLoaded) {
            this.setState({ isLoading: false });

            this._publish(); // FIXME its calling for demo
        }
    }

    async _publish() {
        this.setState({ isUploading: true });

        const material = {
            durationSec: this.state.durationSec,
            timelines:   this.state.timelines,
            poseKey:     this.state.poseKey,
        }
        const saveResult = await this.uploader.saveMaterial(material).catch((err) => {
            console.error(err);
            return false;
        });

        if (!saveResult) {
            // error modal
            return;
        }

        const packResult = await this.uploader.packMaterial().catch((err) => {
            console.error(err);
            return false;
        });

        if (!packResult) {
            // error modal
            return;
        }

        this.setState({ isUploading: false });
        this.props.history.push(`/${this.lessonID}`);
    }

// <LessonPlayer isPreview={true} />
    render() {
        return(
            <div id="lesson-editor-screen">
                <Menu selectedIndex='2' />

                <div id="lesson-control-panel">
                    <div id="publish-btn">
                        <button className="btn btn-primary" onClick={this._publish.bind(this)}>公開する</button>
                    </div>
                </div>

                <div id="lesson-editor" ref={(e) => { this.avatarPreview = e; }}>
                    <TextForms isLoading={this.state.isLoading} timelines={this.state.timelines} />

                    <div id="loading-indicator">
                        <FontAwesomeIcon icon="spinner" spin />
                    </div>
                </div>
                <style jsx>{`
                    #lesson-editor-screen {
                        background-color: #616163;
                    }
                    #lesson-control-panel {
                        height: 70px;
                        display: none; /* FIXME */
                    }
                    #publish-btn {
                        text-align: right;
                        margin-right: 1vw;
                    }
                    #lesson-editor-screen {
                        width: 100%;
                        height: 100%;
                        opacity: ${this.state.isLoading ? '0.8' : '1'};
                    }
                    #lesson-editor {
                        position: relative;
                        width: 100%;
                        height: 100%;
                        max-height: calc(100% - 50px); /* for menu and lesson-control-panel */
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
                `}</style>
            </div>
        )
    }
}