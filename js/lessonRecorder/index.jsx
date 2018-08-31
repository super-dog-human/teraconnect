import React from 'react';
import Menu from '../menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { setupPoseDetector, detectPoseInRealTime, clearPoseCanvas } from './poseDetector';
//import { loadDetector, setPreviewVideoSize, detectPoseInRealTime } from './voiceRecorder';
import LessonRecorder from './lessonRecorder';
import AvatarPreview from './avatarPreview';
import LessonGraphic from './/lessonGraphic';

export default class LessonRecorderScreen extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            detectedPose: {},
            graphicURL: '',
            facialName: 'Default',
            isLoading: true,
            isRecording: false,
            isPause: false,
            isPoseDetecting: false,
        };

        // TODO loading resources.
        this.avatarURL = "http://localhost:1234/bdiuotgrbj8g00l9t3ng.vrm";
        this.graphicURLs = [
            '',
            '',
            '',
        ];
        this.graphicURLIndex = -1;
        this.avatarPreview;
        this.recorder = new LessonRecorder();
        this.isLoading = true;
    }

    async componentDidMount() {
        setupPoseDetector(() => {
            this._poseDetectionFrame();
            this.setState({ isLoading: false });
        });
    }

    componentWillUpdate(_, nextState) {
        if (this.state.isPoseDetecting && !nextState.isPoseDetecting) {
            clearPoseCanvas();
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
        const isPoseDetecting = this.state.isPoseDetecting;
        this.setState({ isPoseDetecting: !isPoseDetecting });
    }

    async _poseDetectionFrame() {
        if (!this.state.isPoseDetecting) {
            requestAnimationFrame(() => this._poseDetectionFrame());
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
                        facialName={this.state.facialName}
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
                            <button>prev image</button>
                            <button>next image</button>
                            <button onClick={this._switchPoseDetection.bind(this)}>ポーズ検出</button>
                            <button type="button" id="btn-start-record" className="btn-danger"
                                onClick={this._recordingStart.bind(this)}>
                                <FontAwesomeIcon icon={['far', 'dot-circle']} />
                                収録開始
                            </button>
                            <button type="button" id="btn-stop-record" className="btn-secondary"
                                onClick={this._recordingStop.bind(this)}>
                                <FontAwesomeIcon icon={['far', 'pause-circle']} />
                                停止
                            </button>
                            <button type="button" id="btn-resume-record" className="btn-primaryr"
                                onClick={this._recordingResume.bind(this)}>
                                <FontAwesomeIcon icon={['far', 'dot-circle']} />
                                再開
                            </button>
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
                    #btn-start-record {
                        display: ${!this.state.isRecording && !this.state.isPause ? 'inline-block' : 'none'};
                    }
                    #btn-stop-record {
                        display: ${this.state.isRecording ? 'inline-block' : 'none'};
                    }
                    #btn-resume-record {
                        display: ${this.state.isPause ? 'inline-block' : 'none'};
                    }
                `}</style>
            </div>
        )
    }
}