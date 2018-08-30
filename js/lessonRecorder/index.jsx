import React from 'react';
import Menu from '../menu';
import { setupPoseDetector, detectPoseInRealTime } from './poseDetector';
//import { loadDetector, setPreviewVideoSize, detectPoseInRealTime } from './voiceRecorder';
import AvatarPreview from './avatarPreview';
import * as Const from '../common/constants';

export default class LessonRecorder extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            previewScaleX: 1,
            previewScaleY: 1,
            isRecording: false,
            detectedPose: {},
        };

        // TODO loading resources.
        this.avatarURL = "http://localhost:1234/bdiuotgrbj8g00l9t3ng.vrm";
        this.avatarPreview;
    }

    async componentDidMount() {
        setupPoseDetector(() => {
            this.setState({ isRecording: true });
            this.poseDetectionFrame();
        });
    }

    render() {
        return(
            <div>
                <Menu selectedIndex='2' />

                <div id="lesson-recorder" ref={(e) => { this.avatarPreview = e; }}>
                    <AvatarPreview avatar={{ url: this.avatarURL, pose: this.state.detectedPose }} />

                    <video id="pose-video" playsInline></video>
                    <div id="pose-keypoint">
                        <canvas id="pose-keypoint-canvas"></canvas>
                    </div>

                    <div id="control-panel">
                        <div id="recording-status"></div>
                        <div id="recording-controller">
                            <button>prev image</button>
                            <button>next image</button>

                            <button>start</button>
                            <button>stop</button>
                            <button>resume</button>
                        </div>
                        <div id="avatar-controller">
                            <button type="button" className="btn-danger">収録を開始</button>
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
                        position: absolute;
                        top: 0;
                        left: 0;
                    }
                    #control-panel {
                        position: absolute;
                        top: 0;
                        left:0;
                        text-align: center;
                        z-inde: 100;
                    }
                `}</style>
            </div>
        )
    }

    async poseDetectionFrame() {
//        if (!this.state.isRecording) return;

        const pose = await detectPoseInRealTime();
        this.setState({ detectedPose: pose });

        requestAnimationFrame(() => this.poseDetectionFrame());
    }
}