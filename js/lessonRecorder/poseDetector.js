import * as posenet from '@tensorflow-models/posenet';
import { drawKeypoints, drawSkeleton } from './demo_util';

let net;
let video;
let canvas;
let context;
const modelVersion = 0.75;
const minPoseConfidence = Number(0.3);
const minPartConfidence = Number(0.5);
const imageScaleFactor = 0.5;
const flipHorizontal = true;
const outputStride = 16;

export const setupPoseDetector = (async (callback) => {
    net = await posenet.load(modelVersion);

    const stream = await navigator.mediaDevices.getUserMedia({
        'audio': false,
        'video': {
            facingMode: 'user',
            width:      { min: 320, ideal: 320, max: 640 },
            height:     { min: 240, ideal: 240, max: 480 },
            frameRate:  { max: 30 },
        },
    });

    video = document.getElementById('pose-video');
    video.srcObject = stream;
    video.onloadedmetadata = () => {
        video.play();

        const videoRatio = video.videoWidth / video.videoHeight;
        video.width  = video.clientHeight * videoRatio;
        video.height = video.clientHeight;

        canvas = document.getElementById('pose-keypoint-canvas');
        canvas.width  = video.width;
        canvas.height = video.height;
        context = canvas.getContext('2d');

        callback();
    };
});

export async function detectPoseInRealTime() {
    const pose = await net.estimateSinglePose(video, imageScaleFactor, flipHorizontal, outputStride);
    _drawDetectedPoseAsync(pose);

    const keypoint = pose.keypoints.reduce((o, c) => {
        return Object.assign(o, { [c.part]: { "x": c.position.x, "y": c.position.y, "score": c.score } })
    }, {});
    keypoint["score"] = pose.score;

    return keypoint;
}

async function _drawDetectedPoseAsync(pose) {
    context.clearRect(0, 0, video.width, video.height);
    context.save();
    context.scale(-1, 1);
    context.translate(-video.width, 0);
    context.drawImage(video, 0, 0, video.width, video.height);
    context.restore();

    if (pose.score >= minPoseConfidence) {
        drawKeypoints(pose.keypoints, minPartConfidence, context);
        drawSkeleton(pose.keypoints, minPartConfidence, context);
    }
}

export function clearPoseCanvas() {
    // FIXME this method has no effect for some reason...
    context.clearRect(0, 0, video.width, video.height);
}