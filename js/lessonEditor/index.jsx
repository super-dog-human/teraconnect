import React from 'react';
import axios from 'axios';
import Menu from '../menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TextForms from './textForms';
import LessonPlayer from '../lessonPlayer';
import * as Const from '../common/constants';

export default class LessonEditor extends React.Component {
    constructor(props) {
        super(props)

        this.lessonID = props.match.params.id;
        this.state ={
            isLoading: true,
            lessonMaterial: {},
            voiceTexts: [],
        }
        // <LessonPlayer isPreview={true} />
    }

    async componentDidMount() {
        await this._fetchLessonMaterial() &&
        await this._fetchVoiceText();
    }

    async _fetchLessonMaterial() {
        const materialURL = Const.LESSON_MATERIAL_API_URL.replace('{lessonID}', this.lessonID);
        const result = await axios.get(materialURL).catch((err) => {
            console.error(err);
            return false;
        });

        if (!result) return false;

        this.setState({ lessonMaterial: result.data });
        return true;
    }

    async _fetchVoiceText() {
        const allVoiceCount = this.state.lessonMaterial.timelines.filter((t) => { return t.voice.id != ''; })
            .map((t) => { return t.voice; }).length;
        if (allVoiceCount == 0) return;

        const url = Const.LESSON_VOICE_TEXT_API_URL.replace('{lessonID}', this.lessonID);
        const result = await axios.get(url).catch((err) => {
            if (err.response.status == 404) return true;
            console.error(err);
            return false;
        });

        if (!result) return;

        const voiceTexts = result.data;
        if (!voiceTexts) { // not yet entities was created.
            setTimeout(() => { this._fetchVoiceText() }, 1000);
            return;
        }

        this.setState({ voiceTexts: voiceTexts });

        if (voiceTexts.filter((t) => { return !t.isConverted || !t.isTexted }).length > 0) {
            setTimeout(() => { this._fetchVoiceText() }, 1000);
            return;
        }

//      await this._createMaterial();
        this.setState({ isLoading: false });
    }

    async _createMaterial() {
        /*
        const url =  Const.LESSON_VOICE_TEXT_API_URL.replace('{lessonID}', this.lessonID);
        const result = await axios.put(url).catch((err) => {
            console.error(err);
            return false;
        });

        if (!result) return;

        this.props.history.push(`/${this.lessonID}`); // TODO change to semantic path name.
        */
    }

    render() {
        return(
            <div id="lesson-editor-screen">
                <Menu selectedIndex='2' />

                <div id="lesson-editor" ref={(e) => { this.avatarPreview = e; }}>
                    <TextForms isLoading={this.state.isLoading} voiceTexts={this.state.voiceTexts} />

                    <div id="loading-indicator">
                        <FontAwesomeIcon icon="spinner" spin />
                    </div>
                </div>
                <style jsx>{`
                    #lesson-editor-screen {
                        width: 100%;
                        height: 100%;
                        opacity: ${this.state.isLoading ? '0.8' : '1'};
                    }
                    #lesson-editor {
                        position: relative;
                        width: 100%;
                        height: ${Const.RATIO_16_TO_9 * 100}vw;
                        max-height: calc(100% - 50px); /* for menu */
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
                        display: ${this.state.isLoading ? 'display' : 'none'};
                        font-size: 10vw;
                        opacity: 0.5;
                    }
                `}</style>
            </div>
        )
    }
}