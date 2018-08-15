import * as posenet from '@tensorflow-models/posenet';
import {drawKeypoints, drawSkeleton} from './demo_util';

const videoWidth  = 640;
const videoHeight = 480;
let net;
let isReady       = false;
let isRecording   = false;
let unityGameInstance;
let video;

exports.setGameInstance = function(gameInstance) {
    unityGameInstance = gameInstance;
}
exports.start = startDetecting;
exports.stop  = stopDetecting;

function startDetecting() {
    if (isReady) {
        isRecording = true;
        switchVideoPreview(true);
        detectPoseInRealTime();
    } else {
        setTimeout(startDetecting, 100);
    }
}

function stopDetecting() {
    switchVideoPreview(false);
    isRecording = false;
}

function switchVideoPreview(isShow) {
    if (isShow) {
        document.getElementById('preview_guide').style.display = 'none';
        document.getElementById('pose_keypoint').style.display = 'inline-block';
    } else {
        document.getElementById('pose_keypoint').style.display = 'none';
        document.getElementById('preview_guide').style.display = 'inline-block';
    }
}

async function loadVideo() {
    video = await setupCamera();
    video.play();
    isReady = true;
}

async function setupCamera() {
    const video  = document.getElementById('video');
    video.width  = videoWidth;
    video.height = videoHeight;

    const stream = await navigator.mediaDevices.getUserMedia({
        'audio': false,
        'video': {
            facingMode: 'user',
            width: { max: videoWidth },
            height: { max: videoWidth },
            frameRate: { max: 30 },
        },
    });
    video.srcObject = stream;

    return new Promise(resolve => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}

function detectPoseInRealTime() {
    const canvas  = document.getElementById('pose_keypoint');
    const ctx     = canvas.getContext('2d');
    canvas.width  = videoWidth;
    canvas.height = videoHeight;

    async function poseDetectionFrame() {
        if (!net) net = await posenet.load(0.75);
        if (!isRecording) return;

        const imageScaleFactor = 0.5;
        const flipHorizontal = true;
        const outputStride = 16;
        const pose = await net.estimateSinglePose(video, imageScaleFactor, flipHorizontal, outputStride);

        const minPoseConfidence = Number(0.3);
        const minPartConfidence = Number(0.5);
        const keypoint = pose.keypoints.reduce((o, c) => {
            return Object.assign(o, { [c.part]: { "x": c.position.x, "y": c.position.y, "score": c.score } })
        }, {});
        keypoint["score"] = pose.score;
        unityGameInstance.SendMessage("Kaoru", "UpdatePosition", JSON.stringify(keypoint));

        ctx.clearRect(0, 0, videoWidth, videoHeight);
        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-videoWidth, 0);
        ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
        ctx.restore();

        if (pose.score >= minPoseConfidence) {
            drawKeypoints(pose.keypoints, minPartConfidence, ctx);
            drawSkeleton(pose.keypoints, minPartConfidence, ctx);
        }

        requestAnimationFrame(poseDetectionFrame);
    }
    poseDetectionFrame();
}

loadVideo();
