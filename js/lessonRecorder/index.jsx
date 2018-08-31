import React from 'react';
import Menu from '../menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { setupPoseDetector, detectPoseInRealTime, clearPoseCanvas } from './poseDetector';
//import VoiceRecorder from './voiceRecorder';
import LessonRecorder from './lessonRecorder';
import AvatarPreview from './avatarPreview';
import LessonGraphic from './lessonGraphic';

export default class LessonRecorderScreen extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            detectedPose: {},
            graphicURL: '',
            faceName: 'Default',
            moveDirection: 'stop',
            isLoading: true,
            isRecording: false,
            isPause: false,
            isPoseDetecting: false,
        };

        // TODO loading resources.
        this.avatarURL = "http://localhost:1234/bdiuotgrbj8g00l9t3ng.vrm";
        this.graphicURLs = [
            {
                id: 1,
                url: 'https://s3-ap-northeast-1.amazonaws.com/ftext/mathII/p143.png',
            },
            {
                id: 2,
                url: 'https://s3-ap-northeast-1.amazonaws.com/ftext/mathII/p144-1.png',
            },
            {
                id: 3,
                url: 'https://s3-ap-northeast-1.amazonaws.com/ftext/mathI/numberline.png',
            },
        ];
        this.graphicURLIndex = -1;
        this.avatarPreview;
        this.recorder = new LessonRecorder();
//        this.voiceRecorder = new VoiceRecorder();
        this.isLoading = true;
    }

    async componentDidMount() {
        setupPoseDetector(() => {
            this.setState({ isLoading: false });
        });
    }

    componentDidUpdate(_, prevState) {
        if (!prevState.isPoseDetecting && this.state.isPoseDetecting) {
            this._poseDetectionFrame();
        }

        if (prevState.isRecording != this.state.isRecording) {
            this.recorder.start(this.state.isRecording);
            // this.voiceRecorder.start(this.state.isRecording);
        }
    }

    _recordingStart() {
        this.setState({ isRecording: true });
    }

    _recordingStop() {
        this.setState({ isRecording: false, isPause: true });
    }

    _recordingResume() {
        this.setState({ isRecording: true, isPause: false });
    }

    _switchPoseDetection() {
        this.setState({ isPoseDetecting: !this.state.isPoseDetecting });
    }

    _switchFace(faceName) {
        if (this.state.faceName == faceName) return;

        this.setState({ faceName: faceName });
        this.recorder.addSwitchingFace(faceName);
    }

    _switchGraphic(diff) {
        this.graphicURLIndex += diff;
        const graphic =  (this.graphicURLIndex > -1) ?
            this.graphicURLs[this.graphicURLIndex] : { id: null, url: ''};
        this.setState({ graphicURL: graphic.url });
        this.recorder.addSwitchingGraphic(graphic.id);
    }

    _movePosition(direction) {
        this.setState({ moveDirection: direction });
    }

    _stopMovingPosition() {
        if (this.state.moveDirection == 'stop') return;
        this.setState({ moveDirection: 'stop' });
    }

    recordMovedPosition(position) {
        this.recorder.addAvatarPosition(position);
    }

    async _poseDetectionFrame() {
        if (!this.state.isPoseDetecting) {
            this.setState({ detectedPose: {} });
            clearPoseCanvas();
            return;
        }

        const pose = await detectPoseInRealTime();
        const avatarPose = this.recorder.addAvatarPose(pose);
        this.setState({ detectedPose: avatarPose });

        requestAnimationFrame(() => this._poseDetectionFrame());
    }

    render() {
        return(
            <div>
                <Menu selectedIndex='2' />

                <div id="lesson-recorder" ref={(e) => { this.avatarPreview = e; }}>
                    <AvatarPreview
                        avatarURL={this.avatarURL}
                        pose={this.state.detectedPose}
                        faceName={this.state.faceName}
                        moveDirection={this.state.moveDirection}
                        movedPosition={(position) => { this.recordMovedPosition(position); }}
                        isPoseDetecting={this.state.isPoseDetecting}
                    />

                    <LessonGraphic url={this.state.graphicURL} />

                    <video id="pose-video" playsInline></video>
                    <div id="pose-keypoint">
                        <canvas id="pose-keypoint-canvas"></canvas>
                    </div>

                    <div id="control-panel">
                        <div id="recording-status">REC</div>
                        <div id="recording-controller">
                            <button type="button" id="prev-graphic-btn" className="btn"
                                disabled={this.graphicURLIndex == -1}
                                onClick={this._switchGraphic.bind(this, -1)}>
                                <FontAwesomeIcon icon={['fas', 'image']} />
                            </button>
                            <button type="button" id="next-graphic-btn" className="btn"
                                disabled={this.graphicURLIndex == this.graphicURLs.length - 1}
                                onClick={this._switchGraphic.bind(this, 1)}>
                                <FontAwesomeIcon icon={['fas', 'image']} />
                            </button>
                            <button type="button" className="btn" onClick={this._switchPoseDetection.bind(this)}>
                                <FontAwesomeIcon icon={['fas', 'walking']} />
                                ポーズ検出
                            </button>

                            <button type="button" id="btn-start-record" className="btn btn-danger"
                                onClick={this._recordingStart.bind(this)}>
                                <FontAwesomeIcon icon={['far', 'dot-circle']} />
                                収録開始
                            </button>
                            <button type="button" id="btn-stop-record" className="btn btn-secondary"
                                onClick={this._recordingStop.bind(this)}>
                                <FontAwesomeIcon icon={['far', 'pause-circle']} />
                                停止
                            </button>
                            <button type="button" id="btn-resume-record" className="btn btn-primary"
                                onClick={this._recordingResume.bind(this)}>
                                <FontAwesomeIcon icon={['far', 'dot-circle']} />
                                再開
                            </button>

                            <div id="change-emotion">
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

                            <div id="move-position" onMouseOut={this._stopMovingPosition.bind(this)}>
                                <button type="button" className="btn btn-dark"
                                    onMouseDown={this._movePosition.bind(this, 'front')}
                                    onMouseUp={this._stopMovingPosition.bind(this)}>
                                    <FontAwesomeIcon icon={['fas', 'arrow-up']} />
                                </button>
                                <button type="button" className="btn btn-dark"
                                    onMouseDown={this._movePosition.bind(this, 'back')}
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
                </div>

                <style jsx>{`
                    #lesson-recorder {
                        position: relative;
                    }
                    #pose-video {
                        position: absolute;
                        top: 0;
                        left: 0;
                        transform: scaleX(-1);
                    }
                    #pose-keypoint {
                        display: ${this.state.isPoseDetecting ? 'block' : 'none'};
                        position: absolute;
                        top: 0;
                        left: 0;
                    }
                    #control-panel {
                        display: ${this.state.isLoading ? 'none' : 'block'};
                        position: absolute;
                        top: 0;
                        left:0;
                        text-align: center;
                        z-inde: 100;
                        width: 100%;
                        height: 100%;
                    }
                    #recording-status {
                        display: ${this.state.isRecording ? 'block' : 'none'};
                    }
                    #prev-graphic-btn {

                    }
                    #next-graphic-btn {

                    }
                    #btn-start-record {
                        display: ${!this.state.isRecording && !this.state.isPause ? 'inline-block' : 'none'};
                    }
                    #btn-stop-record {
                        display: ${this.state.isRecording ? 'inline-block' : 'none'};
                        opacity: 0.2;
                    }
                    #btn-stop-record:hover {
                        opacity: 1;
                    }
                    #btn-resume-record {
                        display: ${this.state.isPause ? 'inline-block' : 'none'};
                        opacity: 0.2;
                    }
                    #btn-resume-record:hover {
                        opacity: 1;
                    }
                    #change-emotion button {
                        width: 4vw;
                        height: 4vw;
                        font-size: 3vw;
                    }
                `}</style>
            </div>
        )
    }
}