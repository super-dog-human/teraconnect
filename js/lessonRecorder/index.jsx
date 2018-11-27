import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Indicator from '../shared/components/indicator'
import FaceDetector from './utils/faceDetector'
import MainRecorder from './utils/mainRecorder'
import VoiceRecorder from './utils/voiceRecorder'
import { uploadRecord } from './utils/recordUploader'
import AvatarPreview from './avatarPreview'
import LessonAvatar from '../shared/utils/lessonAvatar'
import LessonGraphic from './lessonGraphic'
import {
    fetchLesson,
    fetchAvatarObjectURL
} from '../shared/utils/networkManager'
import {
    fetchLessonGraphicURLs,
    clearLessonObject
} from './utils/lessonRecorderUtil'
import ElapsedTime from './elapsedTime'
import ReactTooltip from 'react-tooltip'
import { disableAllButtons, sendExceptionToGA } from '../shared/utils/utility'
import * as Const from '../shared/utils/constants'

export default class LessonRecorder extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            avatarURL: '',
            graphicURL: '',
            graphicURLs: [],
            faceWeight: {},
            pose: {},
            moveDirection: 'stop',
            isLoading: true,
            isDetectorLoading: true,
            isLostFaceTracking: true,
            isEyesBlink: false,
            isAvatarLoading: true,
            isRecording: false,
            isPause: false,
            isPosting: false,
            isReachedTimeLimit: false
        }

        this.lesson = {}
        this.graphicURLIndex = -1
        this.avatar = new LessonAvatar()
        this.avatarPreview
        this.userVideo
        this.userVideoPreview
        this.saveRecordButton

        this.recorder = new MainRecorder()
        this.lessonID = props.match.params.id
        this.faceDetector = new FaceDetector(
            // callback when completed loading
            () => {
                this.setState({ isDetectorLoading: false })
            },
            // callback when get face
            (weight, neckPoses, isBlink) => {
                this.recorder.recordDetectedMoving(weight, neckPoses, isBlink)
                this.setState({
                    isLostFaceTracking: false,
                    isEyesBlink: isBlink,
                    faceWeight: weight,
                    pose: { neck: neckPoses }
                })

                if (isBlink) {
                    setTimeout(() => {
                        this.setState({ isEyesBlink: false })
                    }, 100)
                }
            },
            // callback when lost face tracking
            () => {
                this.setState({ isLostFaceTracking: true })
            }
        )
        this.voiceRecorder = new VoiceRecorder(this.lessonID, voice => {
            this.recorder.recordVoice(voice)
        })
    }

    async componentDidMount() {
        this.lesson = await fetchLesson(this.lessonID)

        if (this.lesson.isPacked) {
            this.props.history.push(`/${this.lessonID}`)
            return
        }

        const avatarObjectURL = await fetchAvatarObjectURL(this.lesson.avatar)
        this.setState({ avatarURL: avatarObjectURL })

        const graphics = await fetchLessonGraphicURLs(this.lesson.graphics)
        this.setState({ graphicURLs: graphics })

        await this.faceDetector.setup(this.userVideo, this.userVideoPreview)
    }

    componentDidUpdate(_, prevState) {
        if (prevState.isRecording != this.state.isRecording) {
            if (this.state.isRecording) {
                this.recorder.startRecording()
            } else {
                this.recorder.stopRecording()
            }
            this.voiceRecorder.start(this.state.isRecording)
        }

        if (
            this.state.isLoading &&
            !this.state.isDetectorLoading &&
            !this.state.isAvatarLoading
        ) {
            this.faceDetectionInFrame()
            this.setState({ isLoading: false })
        }
    }

    componentWillUnmount() {
        const graphicURLs = this.state.graphicURLs.map(g => {
            return g.url
        })
        clearLessonObject([this.state.avatarURL, ...graphicURLs])
        this.faceDetector.stop()
        this.voiceRecorder.turnOff()
    }

    async faceDetectionInFrame() {
        this.faceDetector.detectFaceLandmarksInRealTime()
        requestAnimationFrame(() => this.faceDetectionInFrame())
    }

    handleStartRecordingClick() {
        if (this.state.isReachedTimeLimit) {
            return
        }

        this.setState({ isRecording: true })
    }

    handleStopRecordingClick() {
        this.setState({ isRecording: false, isPause: true })
    }

    handleResumeRecordingClick() {
        this.setState({ isRecording: true, isPause: false })
    }

    handleSwitchFaceClick(faceName) {
        this.faceDetector.setBaseFace(faceName)
    }

    handleSwitchGraphicClick(diff) {
        this.graphicURLIndex += diff
        const graphic =
            this.graphicURLIndex > -1
                ? this.state.graphicURLs[this.graphicURLIndex]
                : { id: null, url: '', fileType: '' }
        this.setState({ graphicURL: graphic.url })
        this.recorder.recordSwitchingGraphic(graphic)
    }

    async handleMoveAvatarPositionClick(direction) {
        await this.setState({ moveDirection: direction })
        this.recorder.setAvatarStartMovingPositionTime()
    }

    async handleStopAvatarPositionMouseUp() {
        if (this.state.moveDirection === 'stop') return

        await this.setState({ moveDirection: 'stop' })
        const position = this.avatar.currentPosition()
        this.recorder.recordAvatarPosition(position)
    }

    async handleSaveRecordClick() {
        disableAllButtons()
        await this.setState({ isPosting: true })
        this.waitAndPostRecord()
    }

    waitAndPostRecord() {
        const interval = setInterval(async () => {
            if (this.recorder.hasAllVoicesUploaded()) {
                clearInterval(interval)

                const record = this.recorder.recordForUpload()
                uploadRecord(this.lessonID, record)
                    .then(() => {
                        this.setState({ isPosting: false })
                        this.props.history.push(
                            `/lessons/${this.lessonID}/edit`
                        )
                    })
                    .catch(err => {
                        sendExceptionToGA(this.constructor.name, err, false)
                        this.saveRecordButton.disabled = false
                        // modal
                    })
            }
        }, 1000)
    }

    render() {
        return (
            /*
            <LessonRecorder>
                <AvatarPreview />
                <LessonGraphic />
                <UserVideo />
                <UserVideoPreview />
                <ControlPanel>
                    <RecordingIndicator>
                        <ElapsedTime />
                        <RecordingStatus />
                    </RecordingIndicator>
                    <EmotionSwitcher />
                    <GraphicSwitcher />
                    <RecordingController />
                    <PositionController />
                </ControlPanel>
            </LessonRecorder>
            */
            <div id="lesson-recorder-screen">
                <Indicator
                    isLoading={this.state.isLoading || this.state.isPosting}
                />
                <div
                    id="lesson-recorder"
                    ref={e => {
                        this.avatarPreview = e
                    }}
                >
                    <AvatarPreview
                        avatar={this.avatar}
                        avatarURL={this.state.avatarURL}
                        faceWeight={this.state.faceWeight}
                        isEyesBlink={this.state.isEyesBlink}
                        pose={this.state.pose}
                        moveDirection={this.state.moveDirection}
                        loadingCompleted={() => {
                            this.setState({ isAvatarLoading: false })
                        }}
                        previewContainer={this.avatarPreview}
                    />

                    <LessonGraphic url={this.state.graphicURL} />

                    <video
                        id="video"
                        playsInline
                        ref={e => {
                            this.userVideo = e
                        }}
                    />
                    <canvas
                        id="video-preview"
                        ref={e => {
                            this.userVideoPreview = e
                        }}
                    />

                    <div id="control-panel" disabled={this.state.isPosting}>
                        <div id="recording-status" className="text-danger">
                            <div id="recording-status-icon">
                                <FontAwesomeIcon icon={['fas', 'video']} /> REC
                            </div>
                            <ElapsedTime
                                currentRecordingTime={() => {
                                    return this.recorder.currentRecordingTime()
                                }}
                                isRecording={this.state.isRecording}
                                stopRecording={() => {
                                    this.handleStopRecordingClick()
                                    this.setState({ isReachedTimeLimit: true })
                                }}
                            />
                        </div>

                        <div id="emotion-controller" data-tip="表情の切り替え">
                            <button
                                type="button"
                                className="btn btn-dark"
                                onClick={this.handleSwitchFaceClick.bind(
                                    this,
                                    'Default'
                                )}
                                disabled={this.state.isLostFaceTracking}
                            >
                                <FontAwesomeIcon icon={['far', 'meh-blank']} />
                            </button>
                            <button
                                type="button"
                                className="btn btn-dark"
                                onClick={this.handleSwitchFaceClick.bind(
                                    this,
                                    'AllJoy'
                                )}
                                disabled={this.state.isLostFaceTracking}
                            >
                                <FontAwesomeIcon icon={['fas', 'laugh-beam']} />
                            </button>
                            <button
                                type="button"
                                className="btn btn-dark"
                                onClick={this.handleSwitchFaceClick.bind(
                                    this,
                                    'AllSorrow'
                                )}
                                disabled={this.state.isLostFaceTracking}
                            >
                                <FontAwesomeIcon icon={['fas', 'frown-open']} />
                            </button>
                            <button
                                type="button"
                                className="btn btn-dark"
                                onClick={this.handleSwitchFaceClick.bind(
                                    this,
                                    'AllAngry'
                                )}
                                disabled={this.state.isLostFaceTracking}
                            >
                                <FontAwesomeIcon icon={['fas', 'angry']} />
                            </button>
                            <button
                                type="button"
                                className="btn btn-dark"
                                onClick={this.handleSwitchFaceClick.bind(
                                    this,
                                    'AllSurprised'
                                )}
                                disabled={this.state.isLostFaceTracking}
                            >
                                <FontAwesomeIcon icon={['fas', 'surprise']} />
                            </button>
                        </div>

                        <div>
                            <button
                                type="button"
                                id="prev-graphic-btn"
                                className="btn btn-dark graphic-btn"
                                disabled={this.graphicURLIndex === -1}
                                onClick={this.handleSwitchGraphicClick.bind(
                                    this,
                                    -1
                                )}
                                data-tip="前の画像を表示"
                            >
                                <FontAwesomeIcon icon={['fas', 'image']} />
                            </button>
                            <button
                                type="button"
                                id="next-graphic-btn"
                                className="btn btn-dark graphic-btn"
                                disabled={
                                    this.graphicURLIndex ==
                                    this.state.graphicURLs.length - 1
                                }
                                onClick={this.handleSwitchGraphicClick.bind(
                                    this,
                                    1
                                )}
                                data-tip="次の画像を表示"
                            >
                                <FontAwesomeIcon icon={['fas', 'image']} />
                            </button>
                        </div>

                        <div id="rec-single-btns">
                            <button
                                type="button"
                                id="start-record-btn"
                                className="btn btn-danger rec-btn"
                                onClick={this.handleStartRecordingClick.bind(
                                    this
                                )}
                                data-tip="収録を開始します"
                            >
                                <FontAwesomeIcon icon={['far', 'dot-circle']} />{' '}
                                収録開始
                            </button>
                            <button
                                type="button"
                                id="btn-stop-record"
                                className="btn btn-secondary btn-with-hover rec-btn"
                                onClick={this.handleStopRecordingClick.bind(
                                    this
                                )}
                                data-tip="録画を一時停止します"
                            >
                                <FontAwesomeIcon
                                    icon={['far', 'pause-circle']}
                                />{' '}
                                停止
                            </button>
                        </div>
                        <div id="rec-pair-btns" className="btn-in-stop">
                            <button
                                type="button"
                                id="save-record-btn"
                                className="btn btn-primary rec-btn"
                                ref={e => {
                                    this.saveRecordButton = e
                                }}
                                onClick={this.handleSaveRecordClick.bind(this)}
                                data-tip="収録を終了し、編集画面へ移動します"
                            >
                                <FontAwesomeIcon
                                    icon={['fas', 'cloud-upload-alt']}
                                />{' '}
                                収録終了
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger rec-btn"
                                onClick={this.handleResumeRecordingClick.bind(
                                    this
                                )}
                                disabled={this.state.isReachedTimeLimit}
                                data-tip="収録を再開します"
                            >
                                <FontAwesomeIcon icon={['far', 'dot-circle']} />{' '}
                                再開
                            </button>
                        </div>

                        <div id="position-controller">
                            <div
                                id="position-controller-pad"
                                onMouseOut={this.handleStopAvatarPositionMouseUp.bind(
                                    this
                                )}
                            >
                                <button
                                    type="button"
                                    className="btn btn-dark"
                                    onMouseDown={this.handleMoveAvatarPositionClick.bind(
                                        this,
                                        'back'
                                    )}
                                    onMouseUp={this.handleStopAvatarPositionMouseUp.bind(
                                        this
                                    )}
                                    data-tip="奥へ移動"
                                >
                                    <span>
                                        <FontAwesomeIcon
                                            icon={['fas', 'arrow-up']}
                                        />
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-dark"
                                    onMouseDown={this.handleMoveAvatarPositionClick.bind(
                                        this,
                                        'front'
                                    )}
                                    onMouseUp={this.handleStopAvatarPositionMouseUp.bind(
                                        this
                                    )}
                                    data-tip="手前へ移動"
                                >
                                    <span>
                                        <FontAwesomeIcon
                                            icon={['fas', 'arrow-down']}
                                        />
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-dark"
                                    onMouseDown={this.handleMoveAvatarPositionClick.bind(
                                        this,
                                        'left'
                                    )}
                                    onMouseUp={this.handleStopAvatarPositionMouseUp.bind(
                                        this
                                    )}
                                    data-tip="左へ移動"
                                >
                                    <span>
                                        <FontAwesomeIcon
                                            icon={['fas', 'arrow-left']}
                                        />
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-dark"
                                    onMouseDown={this.handleMoveAvatarPositionClick.bind(
                                        this,
                                        'right'
                                    )}
                                    onMouseUp={this.handleStopAvatarPositionMouseUp.bind(
                                        this
                                    )}
                                    data-tip="右へ移動"
                                >
                                    <span>
                                        <FontAwesomeIcon
                                            icon={['fas', 'arrow-right']}
                                        />
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <ReactTooltip
                        className="tooltip"
                        place="top"
                        type="warning"
                        offset={{ top: 70 }}
                    />
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
                    #video {
                        display: none;
                    }
                    #video-preview {
                        display: none;
                    }
                    #control-panel {
                        display: ${this.state.isLoading ? 'none' : 'block'};
                        position: absolute;
                        z-index: 200; // control-panel
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
                    }
                    #recording-status-icon {
                        visibility: ${this.state.isRecording
                ? 'visible'
                : 'hidden'};
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
                        display: ${this.state.graphicURLs.length === 0
                ? 'none'
                : 'block'};
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
                        display: ${!this.state.isRecording &&
                        !this.state.isPause &&
                        !this.state.isReachedTimeLimit
                ? 'inline-block'
                : 'none'};
                    }
                    #btn-stop-record {
                        display: ${this.state.isRecording
                ? 'inline-block'
                : 'none'};
                    }
                    .btn-in-stop {
                        display: ${this.state.isPause ||
                        this.state.isReachedTimeLimit
                ? 'inline-block'
                : 'none'};
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
                    #position-controller-pad button span {
                        pointer-events: none;
                    }
                    #position-controller button {
                        position: absolute;
                        width: 3vw;
                        height: 3vw;
                        font-size: 1vw;
                    }
                    #position-controller button:nth-child(1) {
                        top: 0;
                        left: 3vw;
                        right: 3vw;
                    }
                    #position-controller button:nth-child(2) {
                        top: 6vw;
                        left: 3vw;
                        right: 3vw;
                        bottom: 0;
                    }
                    #position-controller button:nth-child(3) {
                        top: 3vw;
                        left: 0;
                        right: 6vw;
                        bottom: 3vw;
                    }
                    #position-controller button:nth-child(4) {
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
