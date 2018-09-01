import axios from 'axios';
import Utility from '../common/utility';
import * as Const from '../common/constants';

export default class LessonRecorder {
    constructor() {
        this.accuracyThresholdMin = 0.7;
        this.recordingStartSec = 0;
        this.elapsedTimeSec = 0;
        this.isRecording = false;
        this.prevGraphicID;
        this.recordWhileNotRecording = {};
        this.timelines = [];
        this.poseKey = {
            leftHands:      [],
            rightHands:     [],
            leftElbows:     [],
            rightElbows:    [],
            leftShoulders:  [],
            rightShoulders: [],
            necks:          [],
            coreBodies:     [],
        };
    }

    start(isStart) {
        this.isRecording = isStart;
        if (isStart) {
            this.recordingStartSec = performance.now();
            this._addLatestRecordIfNeeded();
        } else {
            this.elapsedTimeSec += performance.now() - this.recordingStartSec;
        }
    }

    currentRecordingTime() {
        const recordingTimeMilliSec = this.elapsedTimeSec + performance.now() - this.recordingStartSec;
        return recordingTimeMilliSec / 1000;
    }

    addAvatarPose(pose) {
        const time = this.currentRecordingTime();

        for (let part in pose) {
            if (part == 'score') continue;
            if (!pose[part]) continue;
            if (pose[part].score >= this.accuracyThresholdMin) continue;
            pose[part] = null;
        }

        const avatarPose = {};
        recordAvatarArmPose(this, pose.leftElbow, pose.leftShoulder, pose.leftWrist, 'left');
        recordAvatarArmPose(this, pose.rightElbow, pose.rightShoulder, pose.rightWrist, 'right');
        recordAvatarNeckPose(this, pose.nose, pose.leftEar, pose.rightEar);

        return avatarPose;

        function recordAvatarArmPose(self, elbow, shoulder, wrist, side) {
            if (!elbow || !shoulder || !wrist) return;

            const shoulderZRad = (side == 'left') ?
                Math.atan2(elbow.x - shoulder.x, elbow.y - shoulder.y) - Const.RAD_90 :
                Math.atan2(shoulder.x - elbow.x, shoulder.y - elbow.y) - Const.RAD_90;

            const elbowZRad = (side == 'left') ?
                Math.atan2(elbow.x - wrist.x, elbow.y - wrist.y) + Const.RAD_90 - shoulderZRad :
                Math.atan2(wrist.x - elbow.x, wrist.y - elbow.y) + Const.RAD_90 - shoulderZRad;
            const elbowXRad = (Math.abs(elbowZRad) > Const.RAD_90 || Math.abs(elbowZRad) > 0 ) ? Math.PI : 0;

            const parmXRad  = (Math.abs(elbowZRad) > Const.RAD_90) ? -Const.RAD_90 : 0;

            if (side == 'left') {
                if (self.isRecording) {
                    self.poseKey.leftShoulders.push({ rot: [0, 0, -shoulderZRad, 1], time: time });
                    self.poseKey.leftElbows.push({ rot: [elbowXRad, -0.5, elbowZRad, 1], time: time });
                    self.poseKey.leftHands.push({ rot: [parmXRad, 0, 0, 1], time: time });
                }
                avatarPose.leftArm = {
                    shoulderZ: -shoulderZRad,
                    elbowX:    elbowXRad,
                    elbowZ:    elbowZRad,
                    parmX:     parmXRad,
                };
            } else {
                if (self.isRecording) {
                    self.poseKey.rightShoulders.push({ rot: [0, 0, shoulderZRad, 1], time: time });
                    self.poseKey.rightElbows.push({ rot: [-elbowXRad, 0.5, elbowZRad, 1], time: time });
                    self.poseKey.rightHands.push({ rot: [parmXRad, 0, 0, 1], time: time });
                }
                avatarPose.rightArm = {
                    shoulderZ: shoulderZRad,
                    elbowX:    -elbowXRad,
                    elbowZ:    elbowZRad,
                    parmX:     parmXRad,
                };
            }
        }

        function recordAvatarNeckPose(self, nose, leftEar, rightEar) {
            if (!nose || !leftEar || !rightEar) return;

            const rightFaceLength = nose.x - rightEar.x;
            const leftFaceLength = leftEar.x - nose.x;
            const faceAngleRatio = (rightFaceLength > leftFaceLength) ?
                1  - (leftFaceLength / rightFaceLength) :
                -1 + (rightFaceLength / leftFaceLength);

            if (self.isRecording) {
                self.poseKey.necks.push({ rot: [0, faceAngleRatio, 0, 1], time: time });
            }
            avatarPose.neck = { neckY: faceAngleRatio };
        }
    }

    addAvatarPosition(position) {
        if (!this.isRecording) {
            this.recordWhileNotRecording.position = position;
            return;
        }

        const positions = position.toArray().push(1);
        const time = this.currentRecordingTime();
        this.poseKey.coreBodies.push({ pos: positions, time: time });
    }

    addVoice(voice) {
        console.log(voice);
    }

    addSwitchingGraphic(graphicID) {
        if (!this.isRecording) {
            this.recordWhileNotRecording.graphicID = graphicID;
            return;
        }

        const time = this.currentRecordingTime();
        const graphics = [];

        if (this.prevGraphicID) {
            const hideGraphic = this._defaultGraphicRecord();
            hideGraphic.id = this.prevGraphicID;
            hideGraphic.action = 'hide';
            graphics.push(hideGraphic);
        }

        if (graphicID) {
            const showGraphic = this._defaultGraphicRecord();
            showGraphic.id = graphicID;
            showGraphic.action = 'show';
            graphics.push(showGraphic);
        }

        this.timelines.push({
            timeSec: time,
            graphics: graphics,
        });

        this.prevGraphicID = graphicID;
    }

    addSwitchingFace(faceName) {
        if (!this.isRecording) {
            this.recordWhileNotRecording.faceName = faceName;
            return;
        }

        const time = this.currentRecordingTime();
        const spAction = this._defaultSpActionRecord();
        spAction.faceExpression = faceName;

        this.timelines.push({
            timeSec: time,
            spAction: spAction,
        });
    }

    sendRecord() {
        const time = this.currentRecordingTime();
        console.log(this.timelines);
        console.log(this.poseKey);
    }

    _defaultGraphicRecord() {
        return {
            "sizePct": 90,
            "horizontalAlign": "center",
            "verticalAlign": "middle",
        };
    }

    _defaultSpActionRecord() {
        return {
            "spAction": {
                "action": null,
                "faceExpression": null,
            }
        };
    }

    _addLatestRecordIfNeeded() {
        if (this.recordWhileNotRecording == {}) return;

        for (let type in this.recordWhileNotRecording) {
            const record = this.recordWhileNotRecording[type];
            if (type == 'position') {
                this.addAvatarPosition(record);
            } else if (type == 'graphicID') {
                this.addSwitchingGraphic(record);
            } else if (type == 'faceName') {
                this.addSwitchingFace(record);
            }
        }

        this.recordWhileNotRecording = {};
    }
}