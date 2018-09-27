import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { setupPoseDetector, detectPoseInRealTime, clearPoseCanvas, stopUserMedia } from './poseDetector';
import LessonRecorder from './lessonRecorder';
import VoiceRecorder from './voiceRecorder';
import AvatarPreview from './avatarPreview';
import LessonGraphic from './lessonGraphic';
import LessonUtility from '../common/lessonUtility';
import ElapsedTime from './elapsedTime';
import ReactTooltip from 'react-tooltip';
import * as Const from '../common/constants';

export default class LessonRecorderScreen extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            avatarURL: '',
            detectedPose: {},
            graphicURL: '',
            graphicURLs: [],
            faceName: 'Default',
            moveDirection: 'stop',
            isLoading: true,
            isDetectorLoading: true,
            isAvatarLoading: true,
            isRecording: false,
            isPause: false,
            isPoseDetection: false,
            isSpeaking: false,
            isPosting: false,
            isReachedTimeLimit: false,
        };

        this.lesson = {};
        this.graphicURLIndex = -1;
        this.avatarPreview;

        this.lessonID = props.match.params.id;
        this.recorder = new LessonRecorder(this.lessonID);
        this.voiceRecorder = new VoiceRecorder(
            this.lessonID,
            ((voice) => { this.addVoice(voice); }),
            ((isSpeaking) => { this.detectedVoice(isSpeaking); })
        );
    }

    async componentDidMount() {
        this.lesson = await this._fetchLesson();

        if (await this.lesson.isPacked) {
            this.props.history.push(`/${this.lessonID}`);
            return;
        }

        await this._fetchAvatarURL();
        await this._fetchGraphicURLs(this.lesson.graphics);

        await setupPoseDetector(() => {
            this.setState({ isDetectorLoading: false });
        });
    }

    async _fetchLesson() {
        const lesson = await LessonUtility.fetchLesson(this.lessonID).catch((err) => {
            console.error(err);
            // error modal

            return false;
        });

        if (!lesson) return;

        return lesson;
    }

    async _fetchAvatarURL() {
        const avatarObjectURL = await LessonUtility.fetchAvatarObjectURL(this.lesson.avatar).catch((err) => {
            console.error(err);
            // error modal
            return false;
        });

        if (!avatarObjectURL) return;

        this.setState({ avatarURL: avatarObjectURL });
    }

    async _fetchGraphicURLs() {
        const graphics = await LessonUtility.fetchLessonGraphicURLs(this.lesson.graphics).catch((err) => {
            console.error(err);
            // error modal
            return false;
        });

        if (!graphics) return;

        this.setState({ graphicURLs: graphics});
    }

    componentDidUpdate(_, prevState) {
        if (!prevState.isPoseDetection && this.state.isPoseDetection) {
            this.recorder.addAvatarInitArmPose();
            this._poseDetectionFrame();
        }

        if (prevState.isPoseDetection && !this.state.isPoseDetection) { // when turn off pose detection
            this.recorder.addAvatarInitArmPose();
        }

        if (prevState.isRecording != this.state.isRecording) {
            this.recorder.start(this.state.isRecording);
            this.voiceRecorder.start(this.state.isRecording);
        }

        if (this.state.isLoading && !this.state.isDetectorLoading && !this.state.isAvatarLoading) {
            this.setState({ isLoading: false });
        }
    }

    componentWillUnmount() {
        window.URL.revokeObjectURL(this.state.avatarURL);
        stopUserMedia();
    }

    recordStartMovingPositionTime() {
        this.recorder.addAvatarStartMovingPositionTime();
    }

    recordMovedPosition(position) {
        this.recorder.addAvatarPosition(position);
    }

    avatarLoadingCompleted() {
        this.setState({ isAvatarLoading: false });
    }

    detectedVoice(isSpeaking) {
        this.setState({ isSpeaking: isSpeaking });
    }

    addVoice(voice) {
        this.recorder.addVoice(voice);
    }

    async _poseDetectionFrame() {
        if (!this.state.isPoseDetection) {
            this.setState({ detectedPose: {} });
            clearPoseCanvas();
            return;
        }

        const pose = await detectPoseInRealTime();
        const avatarPose = this.recorder.addAvatarPose(pose);
        this.setState({ detectedPose: avatarPose });

        requestAnimationFrame(() => this._poseDetectionFrame());
    }

    _recordingStart() {
        if (this.state.isReachedTimeLimit) {
            return;
        }

        this.setState({ isRecording: true });
    }

    recordingStop() {
        this.setState({ isRecording: false, isPause: true });
        this.setState({ isSpeaking: false });
    }

    _recordingResume() {
        this.setState({ isRecording: true, isPause: false });
    }

    _switchPoseDetection() {
        this.setState({ isPoseDetection: !this.state.isPoseDetection });
    }

    _switchFace(faceName) {
        if (this.state.faceName == faceName) return;

        this.setState({ faceName: faceName });
        this.recorder.addSwitchingFace(faceName);
    }

    _switchGraphic(diff) {
        this.graphicURLIndex += diff;
        const graphic = (this.graphicURLIndex > -1) ?
            this.state.graphicURLs[this.graphicURLIndex] : { id: null, url: '', fileType: ''};
        this.setState({ graphicURL: graphic.url });
        this.recorder.addSwitchingGraphic(graphic);
    }

    _movePosition(direction) {
        this.setState({ moveDirection: direction });
    }

    _stopMovingPosition() {
        if (this.state.moveDirection == 'stop') return;
        this.setState({ moveDirection: 'stop' });
    }

    _postRecord() {
        const buttons = document.getElementById('control-panel').getElementsByTagName('button');
        for(let b of buttons) { b.disabled = true };
        this.setState({ isPosting: true, isPoseDetection: false });

        this._waitAndPostRecord(async () => { // callback
            const result = await this.recorder.uploadRecord();
            this.setState({ isPosting: false });
            if (result) {
                this.props.history.push(`/lessons/${this.lessonID}/edit`);
            } else {
                document.getElementById('save-record-btn').disabled = false;
            }
        });
    }

    _waitAndPostRecord(post) {
        const interval = setInterval(() => {
            if (this.recorder.hasAllVoicesUploaded()) {
                clearInterval(interval);
                post();
            }
        }, 1000);
    }

    render() {
        return(
            <div id="lesson-recorder-screen">
                <div id="lesson-recorder" ref={(e) => { this.avatarPreview = e; }}>
                    <AvatarPreview
                        avatarURL={this.state.avatarURL}
                        pose={this.state.detectedPose}
                        faceName={this.state.faceName}
                        moveDirection={this.state.moveDirection}
                        startMovingPositionTime={() => { this.recordStartMovingPositionTime(); } }
                        movedPosition={(position) => { this.recordMovedPosition(position); }}
                        loadingCompleted={() => { this.avatarLoadingCompleted(); }}
                        previewContainer={this.avatarPreview}
                        isSpeaking={this.state.isSpeaking}
                        isPoseDetection={this.state.isPoseDetection}
                    />

                    <LessonGraphic url={this.state.graphicURL} />

                    <video id="pose-video" playsInline></video>

                    <div id="pose-keypoint">
                        <canvas id="pose-keypoint-canvas"></canvas>
                    </div>

                    <div id="loading-indicator">
                        <FontAwesomeIcon icon="spinner" spin />
                    </div>

                    <div id="control-panel" disabled={this.state.isPosting}>
                        <div id="recording-status">
                            <ElapsedTime recorder={this.recorder} isRecording={this.state.isRecording} stopRecording={() => {
                                this.recordingStop();
                                this.setState({ isReachedTimeLimit: true });
                            }} />
                            <div id="recording-status-icon"><FontAwesomeIcon icon={['fas', 'video']} /> REC</div>
                        </div>

                        <div id="pose-detector-btn" data-tip="実験的な機能です">
                            <button type="button" className="btn btn-dark" onClick={this._switchPoseDetection.bind(this)}>
                                <FontAwesomeIcon icon={['fas', 'walking']} /> ポーズ検出
                            </button>
                        </div>

                        <div id="emotion-controller" data-tip="表情の切り替え">
                            <button type="button" className="btn btn-dark" onClick={this._switchFace.bind(this, 'Default')}>
                                <FontAwesomeIcon icon={['far', 'meh-blank']} />
                            </button>
                            <button type="button" className="btn btn-dark" onClick={this._switchFace.bind(this, 'AllFun')}>
                                <FontAwesomeIcon icon={['fas', 'smile']} />
                            </button>
                            <button type="button" className="btn btn-dark" onClick={this._switchFace.bind(this, 'AllJoy')}>
                                <FontAwesomeIcon icon={['fas', 'laugh-beam']} />
                            </button>
                            <button type="button" className="btn btn-dark" onClick={this._switchFace.bind(this, 'AllSorrow')}>
                                <FontAwesomeIcon icon={['fas', 'frown-open']} />
                            </button>
                            <button type="button" className="btn btn-dark" onClick={this._switchFace.bind(this, 'AllAngry')}>
                                <FontAwesomeIcon icon={['fas', 'angry']} />
                            </button>
                            <button type="button" className="btn btn-dark" onClick={this._switchFace.bind(this, 'AllSurprised')}>
                                <FontAwesomeIcon icon={['fas', 'surprise']} />
                            </button>
                        </div>

                        <div>
                            <button type="button" id="prev-graphic-btn" className="btn btn-dark graphic-btn"
                                disabled={this.graphicURLIndex == -1}
                                onClick={this._switchGraphic.bind(this, -1)}
                                data-tip="画像の切り替え">
                                <FontAwesomeIcon icon={['fas', 'image']} />
                            </button>
                            <button type="button" id="next-graphic-btn" className="btn btn-dark graphic-btn"
                                disabled={this.graphicURLIndex == this.state.graphicURLs.length - 1}
                                onClick={this._switchGraphic.bind(this, 1)}
                                data-tip="画像の切り替え">
                                <FontAwesomeIcon icon={['fas', 'image']} />
                            </button>
                        </div>

                        <div id="rec-single-btns">
                            <button type="button" id="start-record-btn" className="btn btn-danger rec-btn"
                                onClick={this._recordingStart.bind(this)}>
                                <FontAwesomeIcon icon={['far', 'dot-circle']} /> 収録開始
                            </button>
                            <button type="button" id="btn-stop-record" className="btn btn-secondary btn-with-hover rec-btn"
                                onClick={this.recordingStop.bind(this)}
                                data-tip="録画を一時停止します">
                                <FontAwesomeIcon icon={['far', 'pause-circle']} /> 停止
                            </button>
                        </div>
                        <div id="rec-pair-btns" className="btn-in-stop">
                            <button type="button" id="save-record-btn" className="btn btn-primary rec-btn"
                                onClick={this._postRecord.bind(this)}
                                data-tip="録画を完了し、編集画面へ移動します">
                                <FontAwesomeIcon icon={['fas', 'cloud-upload-alt']} /> 保存
                            </button>
                            <button type="button" className="btn btn-primary rec-btn"
                                onClick={this._recordingResume.bind(this)}
                                disabled={this.state.isReachedTimeLimit}
                                data-tip="録画を再開します">
                                <FontAwesomeIcon icon={['far', 'dot-circle']} /> 再開
                            </button>
                        </div>

                        <div id="position-controller" onMouseOut={this._stopMovingPosition.bind(this)}>
                            <div id="position-controller-pad">
                                <button type="button" className="btn btn-dark"
                                    onMouseDown={this._movePosition.bind(this, 'back')}
                                    onMouseUp={this._stopMovingPosition.bind(this)}>
                                    <FontAwesomeIcon icon={['fas', 'arrow-up']} />
                                </button>
                                <button type="button" className="btn btn-dark"
                                    onMouseDown={this._movePosition.bind(this, 'front')}
                                    onMouseUp={this._stopMovingPosition.bind(this)}>
                                    <FontAwesomeIcon icon={['fas', 'arrow-down']} />
                                </button>
                                <button type="button" className="btn btn-dark"
                                    onMouseDown={this._movePosition.bind(this, 'left')}
                                    onMouseUp={this._stopMovingPosition.bind(this)}>
                                    <FontAwesomeIcon icon={['fas', 'arrow-left']} />
                                </button>
                                <button type="button" className="btn btn-dark"
                                    onMouseDown={this._movePosition.bind(this, 'right')}
                                    onMouseUp={this._stopMovingPosition.bind(this)}>
                                    <FontAwesomeIcon icon={['fas', 'arrow-right']} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <ReactTooltip />
                </div>

                <style jsx>{`
                    #lesson-recorder-screen {
                        width: 100%;
                        height: 100%;
                    }
                    #lesson-recorder {
                        position: relative;
                        width: 100%;
                        height: ${Const.RATIO_16_TO_9 * 100}vw;
                        max-height: 100%;
                    }
                    #pose-video {
                        position: absolute;
                        top: 0;
                        left: 0;
                        transform: scaleX(-1);
                    }
                    #pose-keypoint {
                        display: ${this.state.isPoseDetection ? 'block' : 'none'};
                        position: absolute;
                        top: 0;
                        left: 0;
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
                        display: ${this.state.isLoading || this.state.isPosting ? 'display' : 'none'};
                        font-size: 10vw;
                        opacity: 0.5;
                    }
                    #control-panel {
                        display: ${this.state.isLoading ? 'none' : 'block'};
                        position: absolute;
                        z-index: 100;
                        width: 100%;
                        height: 100%;
                        top: 0;
                        bottom: 0;
                        left: 0;
                        right: 0;
                    }
                    #recording-status {
                        position: absolute;
                        top: 1vh;
                        left: 2vw;
                        font-size: 3vw;
                        font-weight: bold;
                        color: #dc3545;
                    }
                    #recording-status-icon {
                        display: ${this.state.isRecording ? 'block' : 'none'};
                    }
                    #pose-detector-btn {
                        position: absolute;
                        top: 1vh;
                        right: 2vw;
                    }
                    #pose-detector-btn button {
                        width: 12vw;
                        height: 3vw;
                        font-size: 1.5vw;
                        font-weight: bold;
                        color: ${this.state.isPoseDetection ? '#dc3545' : 'white'};
                    }
                    #emotion-controller {
                        position: absolute;
                        top: 1vh;
                        left: 0;
                        right: 0;
                        width: 24vw; // for 6 buttons.
                        margin-left: auto;
                        margin-right: auto;
                        text-align: center;
                    }
                    #emotion-controller button {
                        width: 4vw;
                        height: 4vw;
                        font-size: 2vw;
                    }
                    .graphic-btn {
                        position: absolute;
                        display: ${this.state.graphicURLs.length == 0 ? 'none' : 'block'};
                        width: 5vw;
                        height: 5vw;
                        top: 0;
                        bottom: 0;
                        margin-top: auto;
                        margin-bottom: auto;
                        font-size: 2.5vw;
                        text-align: center;
                    }
                    #prev-graphic-btn {
                        left: 2vw;
                    }
                    #next-graphic-btn {
                        right: 2vw;
                    }
                    .rec-btn {
                        width: 15vw;
                        height: 5vw;
                        font-size: 2vw;
                    }
                    #rec-single-btns button {
                        position: absolute;
                        left: 0;
                        right: 0;
                        bottom: 5vh;
                        margin-left: auto;
                        margin-right: auto;
                    }
                    #rec-pair-btns {
                        position: absolute;
                        left: 0;
                        right: 0;
                        bottom: 5vh;
                        margin-left: auto;
                        margin-right: auto;
                        text-align: center;
                    }
                    #rec-pair-btns button {
                        margin-left: 1vw;
                        margin-right: 1vw;
                    }
                    #start-record-btn {
                        display: ${!this.state.isRecording && !this.state.isPause && !this.state.isReachedTimeLimit ? 'inline-block' : 'none'};
                    }
                    #btn-stop-record {
                        display: ${this.state.isRecording ? 'inline-block' : 'none'};
                    }
                    .btn-in-stop {
                        display: ${this.state.isPause || this.state.isReachedTimeLimit ? 'inline-block' : 'none'};
                    }
                    .btn-with-hover {
                        opacity: 0.2;
                    }
                    .btn-with-hover :hover {
                        opacity: 1;
                    }
                    #position-controller {
                        position: absolute;
                        right: 2vw;
                        bottom: 5vh;
                    }
                    #position-controller-pad {
                        display: relative;
                        width: 9vw;
                        height: 9vw;
                    }
                    #position-controller button {
                        position: absolute;
                        width: 3vw;
                        height: 3vw;
                        font-size: 1vw;
                    }
                    #position-controller button:nth-child(1){
                        top: 0;
                        left: 3vw;
                        right: 3vw;
                    }
                    #position-controller button:nth-child(2){
                        top: 6vw;
                        left: 3vw;
                        right: 3vw;
                        bottom: 0;
                    }
                    #position-controller button:nth-child(3){
                        top: 3vw;
                        left: 0;
                        right: 6vw;
                        bottom: 3vw;
                    }
                    #position-controller button:nth-child(4){
                        top: 3vw;
                        left: 6vw;
                        right: 0;
                        bottom: 3vw;
                    }
                `}</style>
            </div>
        )
    }
}