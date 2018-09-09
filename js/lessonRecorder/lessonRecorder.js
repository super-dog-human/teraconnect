import axios from 'axios';
import { Euler, Quaternion } from 'three';
import LessonUtility from '../common/lessonUtility';
import * as Const from '../common/constants';

export default class LessonRecorder {
    constructor(lessonID) {
        this.lessonID = lessonID;
        this.accuracyThresholdMin = 0.7;
        this.recordingStartSec = 0;
        this.elapsedTimeSec = 0;
        this.isRecording = false;
        this.prevGraphicID;
        this.recordWhileNotRecording = {};
        this.timelines = [];
        this.leftShoulderInitRotation  = [0, 0,  0.573576436351046, 0.8191520442889918];
        this.rightShoulderInitRotation = [0, 0, -0.573576436351046, 0.8191520442889918];
        this.poseKey = {
            leftHands:      [],
            rightHands:     [],
            leftElbows:     [],
            rightElbows:    [],
            leftShoulders:  [{ rot: this.leftShoulderInitRotation, time: 0 }],
            rightShoulders: [{ rot: this.rightShoulderInitRotation, time: 0 }],
            necks:          [],
            coreBodies:     [{ pos: [0, 0, 85], time: 0 }],
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

    async fetchLesson() {
        const materialURL = Const.LESSON_API_URL.replace('{lessonID}', this.lessonID);
        const result = await axios.get(materialURL).catch((err) => {
            throw new Error(err);
        });

        return result.data;
    }

    async fetchLessonGraphicURLs() {
        const lessonGraphics = await this._fetchLessonGraphics().catch((err) => {
            throw new Error(err);
        });

        if (lessonGraphics.length == 0) {
            return [];
        }

        const urlHeaders = lessonGraphics.map((graphic) => {
            return {
                id:        graphic.id,
                entity:    'Graphic',
                extension: graphic.fileType,
            };
        });

        const urls = await LessonUtility.fetchSignedURLs(urlHeaders);

        return lessonGraphics.map((graphic, i) => {
            return {
                id:       graphic.id,
                url:      urls[i],
                fileType: graphic.fileType,
            };
        });
    }

    async _fetchLessonGraphics() {
        const graphicURL = Const.LESSON_GRAPHIC_API_URL.replace('{lessonID}', this.lessonID);
        const result = await axios.get(graphicURL).catch((err) => {
            if (err.response.status == '404') {
                return false;
            }
            throw new Error(err);
        });

        return result ? result.data.graphics : [];
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
            if (!shoulder || !elbow || !wrist) return;

            if (!self.isRecording) {
                self.recordWhileNotRecording.pose = pose;
                // not early return because to needs reflection to pose when not recording.
            }

            const shoulderZRad = (side == 'left') ?
                Math.atan2(elbow.x - shoulder.x, elbow.y - shoulder.y) - Const.RAD_90 :
                Math.atan2(shoulder.x - elbow.x, shoulder.y - elbow.y) - Const.RAD_90;

            const elbowZRad = (side == 'left') ?
                Math.atan2(elbow.x - wrist.x, elbow.y - wrist.y) + Const.RAD_90 - shoulderZRad :
                Math.atan2(wrist.x - elbow.x, wrist.y - elbow.y) + Const.RAD_90 - shoulderZRad;
            const elbowXRad = (Math.abs(elbowZRad) > Const.RAD_90 || Math.abs(elbowZRad) > 0 ) ? Math.PI : 0;

            const parmXRad  = (Math.abs(elbowZRad) > Const.RAD_90) ? -Const.RAD_90 : 0;

            const shoulderEuler = new Euler(0, 0, -shoulderZRad, 'XYZ');
            const shoulderQuaternion = (new Quaternion).setFromEuler(shoulderEuler);
            const parmEuler = new Euler(parmXRad, 0, 0, 'XYZ');
            const parmQuaternion = (new Quaternion).setFromEuler(parmEuler);

            if (side == 'left') {
                if (self.isRecording) {
                    self.poseKey.leftShoulders.push({ rot: shoulderQuaternion.toArray(), time: time });
                    self.poseKey.leftHands.push({ rot: parmQuaternion.toArray(), time: time });

                    const leftElbowEuler = new Euler(elbowXRad, -0.5, elbowZRad, 'XYZ');
                    const leftElbowQuaternion = (new Quaternion).setFromEuler(leftElbowEuler);
                    self.poseKey.leftElbows.push({ rot: leftElbowQuaternion.toArray(), time: time });
                }
                avatarPose.leftArm = {
                    shoulderZ: -shoulderZRad,
                    elbowX:    elbowXRad,
                    elbowZ:    elbowZRad,
                    parmX:     parmXRad,
                };
            } else {
                if (self.isRecording) {
                    self.poseKey.rightShoulders.push({ rot: shoulderQuaternion.toArray(), time: time });
                    self.poseKey.rightHands.push({ rot: parmQuaternion.toArray(), time: time });

                    const rightElbowEuler = new Euler(-elbowXRad, 0.5, elbowZRad, 'XYZ');
                    const rightElbowQuaternion = (new Quaternion).setFromEuler(rightElbowEuler);
                    self.poseKey.rightElbows.push({ rot: rightElbowQuaternion.toArray(), time: time });
                }
                avatarPose.rightArm = {
                    shoulderZ: -shoulderZRad,
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
                const neckEuler = new Euler(0, faceAngleRatio, 0, 'XYZ');
                const neckQuaternion = (new Quaternion).setFromEuler(neckEuler);
                self.poseKey.necks.push({ rot: neckQuaternion.toArray(), time: time });
            }
            avatarPose.neck = { neckY: faceAngleRatio };
        }
    }

    addAvatarPosition(position) {
        if (!this.isRecording) {
            this.recordWhileNotRecording.position = position;
            return;
        }

        const time = this.currentRecordingTime();
        this.poseKey.coreBodies.push({ pos: position.toArray(), time: time });
    }

    addAvatarInitArmPose() {
        if (!this.isRecording) return;

        const time = this.currentRecordingTime();
        this.poseKey.leftHands.push({ rot: [0, 0, 0, 1], time: time });
        this.poseKey.leftElbows.push({ rot: [0, 0, 0, 1], time: time });
        this.poseKey.leftShoulders.push({ rot: this.leftShoulderInitRotation, time: time });
        this.poseKey.rightHands.push({ rot: [0, 0, 0, 1], time: time });
        this.poseKey.rightElbows.push({ rot: [0, 0, 0, 1], time: time });
        this.poseKey.rightShoulders.push({ rot: this.rightShoulderInitRotation, time: time });
    }

    addVoice(voice) {
        const timeline = this.timelines.find((t) => { return t.timeSec == voice.timeSec });

        if (timeline && voice.fileID) {
            // voice field is update twice because voice-id is fixed after voice uploading.
            timeline.voice.id = voice.fileID;
        } else if (timeline) {
            timeline.text  = { durationSec: voice.durationSec };
            timeline.voice = { durationSec: voice.durationSec };
        } else {
            this.timelines.push({
                timeSec: voice.timeSec,
                text:    { durationSec: voice.durationSec },
                voice:   { durationSec: voice.durationSec },
            });
        }
    }

    addSwitchingGraphic(targetGraphic) {
        if (!this.isRecording && targetGraphic.id) {
            this.recordWhileNotRecording.graphicID = targetGraphic.id;
            return;
        }

        const time = this.currentRecordingTime();
        const graphics = [];

        if (this.prevGraphicID) {
            graphics.push({
                id:     this.prevGraphicID,
                action: 'hide',
            });
        }

        if (targetGraphic.id) {
            graphics.push({
                id:       targetGraphic.id,
                fileType: targetGraphic.fileType,
                action:  'show',
            });
        }

        this.timelines.push({
            timeSec: time,
            graphics: graphics,
        });

        this.prevGraphicID = targetGraphic.id;
    }

    addSwitchingFace(faceName) {
        if (!this.isRecording) {
            this.recordWhileNotRecording.faceName = faceName;
            return;
        }

        const time = this.currentRecordingTime();
        const spAction = {
            faceExpression: faceName,
        };

        this.timelines.push({
            timeSec: time,
            spAction: spAction,
        });
    }

    hasAllVoicesUploaded() {
        const voices = this.timelines.filter((t) => { return t.voice; }).map((t) => t.voice);
        const nowUploadingVoiceCount = voices.filter((v) => { return v.id == null; }).length;

        return !(voices.length > 0 && nowUploadingVoiceCount > 0);
    }

    async uploadRecord() {
        if (!await this._uploadGraphicIDs()) return false;
        if (!await this._uploadLessonMaterial()) return false;

        return true;
    }

    async _uploadGraphicIDs() {
        const nestedGraphicIDs = this.timelines.filter((t) => { return t.graphics; })
            .map((t) => { return t.graphics.map((g) => { return g.id }); });
        if (nestedGraphicIDs.length ==0) return true;

        const graphicIDs = Array.prototype.concat.apply([], nestedGraphicIDs)
            .filter((x, i, self) => {
                return self.indexOf(x) === i;
            });
        const graphicBody = { graphicIDs: graphicIDs };
        const graphicURL = Const.LESSON_GRAPHIC_API_URL.replace('{lessonID}', this.lessonID);
        await axios.post(graphicURL, graphicBody).catch((err) => {
            console.error(err);
            return false;
        });

        return true;
    }

    async _uploadLessonMaterial() {
        const materialBody = {
            durationSec: this.elapsedTimeSec / 1000,
            timelines:   this.timelines,
            poseKey:     this.poseKey,
        };
        const materialURL = Const.LESSON_MATERIAL_API_URL.replace('{lessonID}', this.lessonID);
        await axios.post(materialURL, materialBody).catch((err) => {
            console.error(err);
            return false;
        });

        return true;
    }

    _addLatestRecordIfNeeded() {
        if (this.recordWhileNotRecording == {}) return;

        for (let type of Object.keys(this.recordWhileNotRecording)) {
            const record = this.recordWhileNotRecording[type];
            if (type == 'pose') {
                this.addAvatarPose(record);
            } else if (type == 'position') {
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