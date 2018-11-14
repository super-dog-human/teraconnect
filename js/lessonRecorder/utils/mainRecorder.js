import { Euler, Quaternion } from 'three'

const coreBodyInitPosition = [0, 0, 100]
const baseFaceWeights = [
    'brwAngry',
    'brwFun',
    'brwJoy',
    'brwSorrow',
    'eyeAngry',
    'eyeJoy',
    'eyeSorrow',
    'eyeSurprised'
]

export default class MainRecorder {
    constructor() {
        this._isRecording = false
        this._recordingStartSec = 0
        this._elapsedTimeSec = 0
        this._startMovingPositionTime = 0
        this._prevGraphicID
        this._lessonID
        this._recordWhileNotRecording = {}
        this._timelines = []
        this._poseKey = {
            leftHands: [],
            rightHands: [],
            leftElbows: [],
            rightElbows: [],
            leftShoulders: [],
            rightShoulders: [],
            necks: [],
            coreBodies: []
        }
        this._faceKey = {
            allAngry: { values: [], times: [] },
            allFun: { values: [], times: [] },
            allJoy: { values: [], times: [] },
            allSorrow: { values: [], times: [] },
            allSurprised: { values: [], times: [] },
            brwAngry: { values: [], times: [] },
            brwFun: { values: [], times: [] },
            brwJoy: { values: [], times: [] },
            brwSorrow: { values: [], times: [] },
            brwSurprised: { values: [], times: [] },
            eyeAngry: { values: [], times: [] },
            eyeClose: { values: [], times: [] },
            eyeCloseR: { values: [], times: [] },
            eyeCloseL: { values: [], times: [] },
            eyeJoy: { values: [], times: [] },
            eyeJoyR: { values: [], times: [] },
            eyeJoyL: { values: [], times: [] },
            eyeSorrow: { values: [], times: [] },
            eyeSurprised: { values: [], times: [] },
            eyeExtra: { values: [], times: [] },
            mouthUp: { values: [], times: [] },
            mouthDown: { values: [], times: [] },
            mouthAngry: { values: [], times: [] },
            mouthCorner: { values: [], times: [] },
            mouthFun: { values: [], times: [] },
            mouthJoy: { values: [], times: [] },
            mouthSorrow: { values: [], times: [] },
            mouthSurprised: { values: [], times: [] },
            mouthA: { values: [], times: [] },
            mouthI: { values: [], times: [] },
            mouthU: { values: [], times: [] },
            mouthE: { values: [], times: [] },
            mouthO: { values: [], times: [] },
            fung1: { values: [], times: [] },
            fung1Low: { values: [], times: [] },
            fung1Up: { values: [], times: [] },
            fung2: { values: [], times: [] },
            fung2Low: { values: [], times: [] },
            fung2Up: { values: [], times: [] },
            eyeExtraOn: { values: [], times: [] }
        }
    }

    startRecording() {
        this._isRecording = true

        this._recordingStartSec = performance.now()
        this._recordUnderSuspensionIfNeeded()
    }

    stopRecording() {
        this._isRecording = false

        this._elapsedTimeSec += performance.now() - this._recordingStartSec
    }

    _recordUnderSuspensionIfNeeded() {
        if (this._recordWhileNotRecording === {}) return

        for (let type of Object.keys(this._recordWhileNotRecording)) {
            const record = this._recordWhileNotRecording[type]
            if (type === 'pose') {
                this._recordAvatarPose(record)
            } else if (type === 'position') {
                this.recordAvatarPosition(record)
            } else if (type === 'graphic') {
                this.recordSwitchingGraphic(record)
            } else if (type === 'faceWeight') {
                this._recordAvatarFaceWeight(record)
            }
        }

        this._recordWhileNotRecording = {}
    }

    currentRecordingTime() {
        if (!this._isRecording) {
            return this._elapsedTimeSec / 1000
        } else {
            const recordingTimeMilliSec =
                performance.now() -
                this._recordingStartSec +
                this._elapsedTimeSec
            return recordingTimeMilliSec / 1000
        }
    }

    setAvatarStartMovingPositionTime() {
        this._startMovingPositionTime = this.currentRecordingTime()
    }

    _recordAvatarPose(pose, time = this.currentRecordingTime()) {
        if (!this._isRecording) {
            this._recordWhileNotRecording.pose = pose
            return
        }

        Object.keys(pose).forEach(part => {
            if (part === 'neck') {
                const neckEuler = new Euler(...pose[part], 'XYZ')
                const neckQuaternion = new Quaternion().setFromEuler(neckEuler)
                this._poseKey.necks.push({
                    rot: neckQuaternion.toArray(),
                    time: time
                })
            }
        })
    }

    recordAvatarPosition(position) {
        if (!this._isRecording) {
            this._recordWhileNotRecording.position = position
            return
        }

        // record of move starting
        if (this._poseKey.coreBodies.length > 0) {
            const startedPosition = this._poseKey.coreBodies[
                this._poseKey.coreBodies.length - 1
            ].pos
            this._poseKey.coreBodies.push({
                pos: startedPosition,
                time: this._startMovingPositionTime
            })
        } else if (this._startMovingPositionTime > 0) {
            this._poseKey.coreBodies.push({
                pos: coreBodyInitPosition,
                time: this._startMovingPositionTime
            })
        }

        // record of move stopping
        const time = this.currentRecordingTime()
        this._poseKey.coreBodies.push({ pos: position.toArray(), time: time })
    }

    recordVoice(voice) {
        const timeline = this._timelines.find(t => {
            return t.timeSec === voice.timeSec
        })

        if (timeline && voice.fileID) {
            // voice field is update twice because voice-id is fixed after voice uploading.
            timeline.voice.id = voice.fileID
        } else if (timeline) {
            timeline.text = { durationSec: voice.durationSec }
            timeline.voice = { durationSec: voice.durationSec }
        } else {
            this._timelines.push({
                timeSec: voice.timeSec,
                text: { durationSec: voice.durationSec },
                voice: { durationSec: voice.durationSec }
            })
        }
    }

    recordSwitchingGraphic(targetGraphic) {
        if (!this._isRecording && targetGraphic.id) {
            this._recordWhileNotRecording.graphic = targetGraphic
            return
        }

        const time = this.currentRecordingTime()
        const graphics = []

        if (this._prevGraphicID) {
            graphics.push({
                id: this._prevGraphicID,
                action: 'hide'
            })
        }

        if (targetGraphic.id) {
            graphics.push({
                id: targetGraphic.id,
                fileType: targetGraphic.fileType,
                action: 'show'
            })
        }

        this._timelines.push({
            timeSec: time,
            graphics: graphics
        })

        this._prevGraphicID = targetGraphic.id
    }

    recordDetectedMoving(weight, neckPoses, isBlink) {
        const time = this.currentRecordingTime()

        this._recordAvatarFaceWeight(weight, time)
        if (isBlink) this._recordAvatarBlink(time)
        this._recordAvatarPose({ neck: neckPoses }, time)
    }

    _recordAvatarFaceWeight(weight, time = this.currentRecordingTime()) {
        if (!this._isRecording) {
            this._recordWhileNotRecording.faceWeight = weight
            return
        }

        Object.keys(weight).forEach(weightName => {
            const lastIndex = this._faceKey[weightName].values.length - 1
            const lastValue = this._faceKey[weightName].values[lastIndex]

            // skip storing when useless values
            if (lastValue === undefined && weight[weightName] === 0) {
                return
            }

            // store first values
            if (lastValue === undefined && weight[weightName] != 0) {
                this._faceKey[weightName].times.push(0)
                this._faceKey[weightName].values.push(0)

                const insertTime = time - 0.1
                if (insertTime > 0) {
                    this._faceKey[weightName].times.push(insertTime)
                    this._faceKey[weightName].values.push(0)
                }

                this._faceKey[weightName].times.push(time)
                this._faceKey[weightName].values.push(weight[weightName])

                return
            }

            // overwrite record time when last two records has repeatedly same values , it's for reducing record size.
            const preLastValue = this._faceKey[weightName].values[lastIndex - 1]
            if (
                lastValue === weight[weightName] &&
                preLastValue === weight[weightName]
            ) {
                this._faceKey[weightName].times[lastIndex] = time
                return
            }

            // normal recording
            if (
                baseFaceWeights.includes(weightName) &&
                lastValue != weight[weightName]
            ) {
                const lastTime = this._faceKey[weightName].times[lastIndex]
                const insertTime = time - 0.1
                if (lastTime < insertTime) {
                    this._faceKey[weightName].times.push(insertTime)
                    this._faceKey[weightName].values.push(lastValue)
                }
            }

            this._faceKey[weightName].times.push(time)
            this._faceKey[weightName].values.push(weight[weightName])
        })
    }

    _recordAvatarBlink(time) {
        if (!this._isRecording) {
            // don't record blink when stopping
            return
        }

        let beginBlinkTime = time - 0.1 // begin blink time is past.
        const endBlinkTime = time + 0.1

        const deletableBlinkIndex = this._faceKey.eyeClose.times.findIndex(
            time => time >= beginBlinkTime
        )
        if (deletableBlinkIndex === -1) {
            this._faceKey.eyeClose.times.push(beginBlinkTime)
            this._faceKey.eyeClose.values.push(0)
        }
        this._faceKey.eyeClose.times.push(time, endBlinkTime)
        this._faceKey.eyeClose.values.push(1, 0)
    }

    hasAllVoicesUploaded() {
        const voices = this._timelines
            .filter(t => {
                return t.voice
            })
            .map(t => t.voice)
        const nowUploadingVoiceCount = voices.filter(v => {
            return v.id === null
        }).length

        return !(voices.length > 0 && nowUploadingVoiceCount > 0)
    }

    recordForUpload() {
        return {
            currentTime: this.currentRecordingTime(),
            timelines: this._timelines,
            poseKey: this._poseKey,
            faceKey: this._faceKey
        }
    }
}
