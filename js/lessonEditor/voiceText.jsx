import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LessonUtility from '../common/lessonUtility';

export default class VoiceText extends React.Component {
    constructor(props) {
        super(props);

        this.urls = [];
        this.playingVoices = [];
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.isLoading && !this.props.isLoading) {

            const filePath = `voice/${this.props.lessonID}`;
            const files = this._lessonVoice().map((voice) => {
                return {
                    id:        voice.id,
                    entity:    filePath,
                    extension: 'ogg',
                }
            });
            this.urls = await LessonUtility.fetchSignedURLs(files);
        }
    }

    _lessonVoice() {
        return this.props.timelines
            .filter((t) => { return t.voice.id != ''; })
            .map((t) => { return t.voice; });
    }

    _changeText(event) {
        const targetIndex = event.target.getAttribute('custom-index');
        const newText = event.target.value;

        const timelines = this.props.timelines;
        let textIndex = -1;
        for (const [i, t] of timelines.entries()) {
            if (t.voice.id == '') continue;

            textIndex ++;
            if (textIndex != targetIndex) continue;
            if (textIndex == targetIndex) {
                t.text.body = newText;
                break;
            }
        }

        this.props.changeTimelines(timelines);
    }

    _playVoice(event) {
        const voiceIndex = event.currentTarget.value;
        if (this.playingVoices[voiceIndex]) {
            this.playingVoices[voiceIndex].pause();
            this.playingVoices[voiceIndex] = null;
        } else {
            const audioElement = new Audio();
            this.playingVoices[voiceIndex] = audioElement;
            const url = this.urls[voiceIndex]
            audioElement.src = url;
            audioElement.addEventListener('ended', () => {
                this.playingVoices[voiceIndex] = null;
            }, true);
            audioElement.play();
        }
    }

    render() {
        return (
            <div id="lesson-text" className="app-back-color-dark-gray">
                <div id="lesson-text-lines">
                    {
                        this.props.timelines
                            .filter((t) => { return t.voice.id != ''; })
                            .map((t, i) => {
                                if (t.text.body != '') {
                                    return <div key={i} className="line">
                                        <button value={i} className="voice-play-btn app-text-color-dark-gray" onClick={this._playVoice.bind(this)} disabled={this.props.isLoading}><FontAwesomeIcon icon="volume-up" /></button>
                                        <input type="text" custom-index={i} className="form-control voice-text" defaultValue={t.text.body} disabled={this.props.isLoading} onChange={this._changeText.bind(this)} />
                                    </div>
                                } else if (this.props.isLoading) {
                                    return <div key={i} className="line text-detecting">
                                        <FontAwesomeIcon icon="spinner" spin />
                                    </div>
                                } else {
                                    return <div key={i} className="line">
                                        <button value={i} className="voice-play-btn app-text-color-dark-gray" onClick={this._playVoice.bind(this)} disabled={this.props.isLoading}><FontAwesomeIcon icon="volume-up" /></button>
                                        <input type="text" custom-index={i} className="form-control voice-text" placeholder="（検出なし）" disabled={this.props.isLoading} onChange={this._changeText.bind(this)} />
                                    </div>
                                }
                            })
                    }
                </div>
                <style jsx>{`
                    #lesson-text-lines {
                        width: 100%;
                        height: 100%;
                        height: calc(100% - 55px - 85px);
                        overflow-y: scroll;
                    }
                    .line {
                        position: relative;
                        display: block;
                        width: 500px;
                        height: 40px;
                        margin-top: 20px;
                        margin-left: auto;
                        margin-right: auto;
                    }
                    .voice-play-btn {
                        position: absolute;
                        height: 25px;
                        border: none;
                        cursor: pointer;
                        top: 0;
                        left: 3px;
                        right: 0;
                        bottom: 0;
                        margin: auto;
                        font-size: 18px;
                    }
                    .voice-text {
                        text-indent: 30px;
                    }
                    .text-detecting {
                        padding-top: 8px;
                        padding-left: 10px;
                        border: 1px solid #D8D8D8;
                        border-radius: 5px;
                        font-size: 20px;
                        color: #D8D8D8;
                    }
                `}</style>
            </div>
        )
    }
}