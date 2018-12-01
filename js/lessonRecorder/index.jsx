import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Indicator from '../shared/components/indicator'
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
import styled from '@emotion/styled'
import { css } from 'emotion'

export default class LessonRecorder extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            avatarURL: '',
            movingDirection: 'stop',
            faceName: 'Default',
            graphicURL: '',
            isLoading: true,
            isLostFaceTracking: true,
            isAvatarLoading: true,
            isRecording: false,
            isPause: false,
            isPosting: false,
            isReachedTimeLimit: false
        }

        this.lesson = {}
        this.graphicURLIndex = -1
        this.graphicURLs = []
        this.avatar = new LessonAvatar()
        this.avatarPreview

        this.recorder = new MainRecorder()
        this.lessonID = props.match.params.id
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

        const avatarURL = await fetchAvatarObjectURL(this.lesson.avatar)
        this.setState({ avatarURL })
        this.graphicURLs = await fetchLessonGraphicURLs(this.lesson.graphics)
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

        if (this.state.isLoading && !this.state.isAvatarLoading) {
            this.setState({ isLoading: false })
        }
    }

    componentWillUnmount() {
        const graphicURLs = this.graphicURLs.map(g => {
            return g.url
        })
        clearLessonObject([this.state.avatarURL, ...graphicURLs])
        this.voiceRecorder.turnOff()
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
        this.setState({ faceName })
    }

    handleSwitchGraphicClick(diff) {
        this.graphicURLIndex += diff
        const graphic =
            this.graphicURLIndex > -1
                ? this.graphicURLs[this.graphicURLIndex]
                : { id: null, url: '', fileType: '' }
        this.setState({ graphicURL: graphic.url })
        this.recorder.recordSwitchingGraphic(graphic)
    }

    async handleMoveAvatarPositionClick(direction) {
        if (this.state.movingDirection === direction) return

        await this.setState({ movingDirection: direction })
        this.recorder.setAvatarStartMovingPositionTime()
    }

    async handleStopAvatarPositionMouseUp() {
        if (this.state.movingDirection === 'stop') return

        await this.setState({ movingDirection: 'stop' })
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
                        this.setState({ isPosting: false })
                        sendExceptionToGA(this.constructor.name, err, false)
                        // modal
                    })
            }
        }, 1000)
    }

    render() {
        return (
            // TODO separate controlpanel component
            <>
                <Indicator
                    isLoading={this.state.isLoading || this.state.isPosting}
                />
                <LessonRecorderContainer
                    ref={e => {
                        this.avatarPreview = e
                    }}
                >
                    <AvatarPreview
                        avatar={this.avatar}
                        previewContainer={this.avatarPreview}
                        avatarURL={this.state.avatarURL}
                        movingDirection={this.state.movingDirection}
                        faceName={this.state.faceName}
                        loadingCompleted={() => {
                            this.setState({ isAvatarLoading: false })
                        }}
                        lostTracking={() => {
                            if (!this.state.isLostFaceTracking) {
                                this.setState({ isLostFaceTracking: true })
                            }
                        }}
                        recordMotion={(weight, neckPoses, isBlink) => {
                            if (this.state.isLostFaceTracking) {
                                this.setState({ isLostFaceTracking: false })
                            }

                            if (!this.state.isRecording) return
                            this.recorder.recordDetectedMoving(
                                weight,
                                neckPoses,
                                isBlink
                            )
                        }}
                    />

                    <LessonGraphic url={this.state.graphicURL} />

                    <ControlPanel
                        isLoading={this.state.isLoading}
                        disabled={this.state.isPosting}
                    >
                        <RecordingIndicator className="text-danger">
                            <RecordingStatusIcon
                                isRecording={this.state.isRecording}
                            >
                                <FontAwesomeIcon icon={['fas', 'video']} /> REC
                            </RecordingStatusIcon>
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
                        </RecordingIndicator>

                        <EmotionSwitcher data-tip="表情の切り替え">
                            <EmotionSwitchButton
                                onClick={this.handleSwitchFaceClick.bind(
                                    this,
                                    'Default'
                                )}
                                disabled={this.state.isLostFaceTracking}
                            >
                                <FontAwesomeIcon icon={['far', 'meh-blank']} />
                            </EmotionSwitchButton>
                            <EmotionSwitchButton
                                onClick={this.handleSwitchFaceClick.bind(
                                    this,
                                    'AllJoy'
                                )}
                                disabled={this.state.isLostFaceTracking}
                            >
                                <FontAwesomeIcon icon={['fas', 'laugh-beam']} />
                            </EmotionSwitchButton>
                            <EmotionSwitchButton
                                onClick={this.handleSwitchFaceClick.bind(
                                    this,
                                    'AllSorrow'
                                )}
                                disabled={this.state.isLostFaceTracking}
                            >
                                <FontAwesomeIcon icon={['fas', 'frown-open']} />
                            </EmotionSwitchButton>
                            <EmotionSwitchButton
                                onClick={this.handleSwitchFaceClick.bind(
                                    this,
                                    'AllAngry'
                                )}
                                disabled={this.state.isLostFaceTracking}
                            >
                                <FontAwesomeIcon icon={['fas', 'angry']} />
                            </EmotionSwitchButton>
                            <EmotionSwitchButton
                                onClick={this.handleSwitchFaceClick.bind(
                                    this,
                                    'AllSurprised'
                                )}
                                disabled={this.state.isLostFaceTracking}
                            >
                                <FontAwesomeIcon icon={['fas', 'surprise']} />
                            </EmotionSwitchButton>
                        </EmotionSwitcher>

                        <GraphicSwitchButton
                            disabled={this.graphicURLIndex === -1}
                            onClick={this.handleSwitchGraphicClick.bind(
                                this,
                                -1
                            )}
                            data-is-prev={true}
                            data-display={this.graphicURLs.length === 0}
                            data-tip="前の画像を表示"
                        />
                        <GraphicSwitchButton
                            disabled={
                                this.graphicURLIndex ==
                                this.graphicURLs.length - 1
                            }
                            onClick={this.handleSwitchGraphicClick.bind(
                                this,
                                1
                            )}
                            data-is-prev={false}
                            data-display={this.graphicURLs.length === 0}
                            data-tip="次の画像を表示"
                        />

                        <SingleRecordingButton
                            type="start"
                            onClick={this.handleStartRecordingClick.bind(this)}
                            data-display={
                                !this.state.isRecording &&
                                !this.state.isPause &&
                                !this.state.isReachedTimeLimit
                            }
                        >
                            <FontAwesomeIcon icon={['far', 'dot-circle']} />{' '}
                            収録開始
                        </SingleRecordingButton>

                        <SingleRecordingButton
                            type="stop"
                            onClick={this.handleStopRecordingClick.bind(this)}
                            data-display={this.state.isRecording}
                        >
                            <FontAwesomeIcon icon={['far', 'pause-circle']} />{' '}
                            停止
                        </SingleRecordingButton>

                        <PairButtonContainer
                            data-display={
                                this.state.isPause ||
                                this.state.isReachedTimeLimit
                            }
                        >
                            <PairRecordingButton
                                type="save"
                                onClick={this.handleSaveRecordClick.bind(this)}
                                disabled={this.state.isPosting}
                            >
                                <FontAwesomeIcon
                                    icon={['fas', 'cloud-upload-alt']}
                                />{' '}
                                収録終了
                            </PairRecordingButton>
                            <PairRecordingButton
                                type="resume"
                                onClick={this.handleResumeRecordingClick.bind(
                                    this
                                )}
                                disabled={this.state.isReachedTimeLimit}
                            >
                                <FontAwesomeIcon icon={['far', 'dot-circle']} />{' '}
                                再開
                            </PairRecordingButton>
                        </PairButtonContainer>

                        <PositionController>
                            <PositionControlPad
                                onMouseOut={this.handleStopAvatarPositionMouseUp.bind(
                                    this
                                )}
                            >
                                <PositionControlButton
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
                                    <PositionControlButtonLabel>
                                        <FontAwesomeIcon
                                            icon={['fas', 'arrow-up']}
                                        />
                                    </PositionControlButtonLabel>
                                </PositionControlButton>

                                <PositionControlButton
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
                                    <PositionControlButtonLabel>
                                        <FontAwesomeIcon
                                            icon={['fas', 'arrow-down']}
                                        />
                                    </PositionControlButtonLabel>
                                </PositionControlButton>

                                <PositionControlButton
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
                                    <PositionControlButtonLabel>
                                        <FontAwesomeIcon
                                            icon={['fas', 'arrow-left']}
                                        />
                                    </PositionControlButtonLabel>
                                </PositionControlButton>

                                <PositionControlButton
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
                                    <PositionControlButtonLabel>
                                        <FontAwesomeIcon
                                            icon={['fas', 'arrow-right']}
                                        />
                                    </PositionControlButtonLabel>
                                </PositionControlButton>
                            </PositionControlPad>
                        </PositionController>
                    </ControlPanel>
                    <ReactTooltip
                        className="tooltip"
                        place="top"
                        type="warning"
                        offset={{ top: 70 }}
                    />
                </LessonRecorderContainer>
            </>
        )
    }
}

const LessonRecorderContainer = styled.div`
    position: relative;
    width: 100%;
    height: ${Const.RATIO_16_TO_9 * 100}vw;
    max-height: 100%;
`

const ControlPanel = styled.div`
    display: ${props => (props.isLoading ? 'none' : 'block')};
    position: absolute;
    z-index: 200; // control-panel
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
`

const RecordingIndicator = styled.div`
    position: absolute;
    top: 1vh;
    left: 2vw;
    font-size: 3vw;
    font-weight: bold;
`

const RecordingStatusIcon = styled.div`
    visibility: ${props => (props.isRecording ? 'visible' : 'hidden')};
`

const PositionController = styled.div`
    position: absolute;
    right: 2vw;
    bottom: 5vh;
`

const EmotionSwitcher = styled.div`
    position: absolute;
    top: 1vh;
    left: 0;
    right: 0;
    width: 20vw; // for 5 buttons.
    margin-left: auto;
    margin-right: auto;
    text-align: center;
`

const EmotionSwitchButton = props => {
    const style = css`
        width: 4vw;
        height: 4vw;
        font-size: 2vw;
    `
    return (
        <button type="button" className={`btn btn-dark ${style}`} {...props}>
            {props.children}
        </button>
    )
}

const GraphicSwitchButton = props => {
    const style = css`
        position: absolute;
        display: ${props['data-display'] ? 'none' : 'block'};
        width: 5vw;
        height: 5vw;
        top: 0;
        left: ${props['data-is-prev'] ? '2vw' : ''};
        right: ${props['data-is-prev'] ? '' : '2vw'};
        bottom: 0;
        margin-top: auto;
        margin-bottom: auto;
        font-size: 2.5vw;
        text-align: center;
    `

    return (
        <button type="button" className={`btn btn-dark ${style}`} {...props}>
            <FontAwesomeIcon icon={['fas', 'image']} />
        </button>
    )
}

const PositionControlPad = styled.div`
    display: relative;
    width: 9vw;
    height: 9vw;
`

const PositionControlButton = styled.button`
    position: absolute;
    width: 3vw;
    height: 3vw;
    font-size: 1vw;
    &:nth-of-type(1) {
        top: 0;
        left: 3vw;
        right: 3vw;
    }
    &:nth-of-type(2) {
        top: 6vw;
        left: 3vw;
        right: 3vw;
        bottom: 0;
    }
    &:nth-of-type(3) {
        top: 3vw;
        left: 0;
        right: 6vw;
        bottom: 3vw;
    }
    &:nth-of-type(4) {
        top: 3vw;
        left: 6vw;
        right: 0;
        bottom: 3vw;
    }
`

const PositionControlButtonLabel = styled.span`
    pointer-events: none;
`

const SingleButton = styled.button`
    position: absolute;
    display: ${props => (props['data-display'] ? 'inline-block' : 'none')};
    width: 15vw;
    height: 5vw;
    left: 0;
    right: 0;
    bottom: 5vh;
    margin-left: auto;
    margin-right: auto;
    font-size: 2vw;
    opacity: ${props => (props.styleType === 'start' ? 1 : 0.2)};
    &:hover {
        opacity: 1;
    }
`
const SingleRecordingButton = props => {
    const isStart = props.type === 'start'
    return (
        <SingleButton
            type="button"
            className={`btn ${isStart ? 'btn-danger' : 'btn-secondary'}`}
            styleType={props.type}
            data-display={props['data-display']}
            onClick={props.onClick}
            data-tip={isStart ? '収録を開始します' : '録画を一時停止します'}
        >
            {props.children}
        </SingleButton>
    )
}

const PairButtonContainer = styled.div`
    position: absolute;
    display: ${props => (props['data-display'] ? 'inline-block' : 'none')};
    left: 0;
    right: 0;
    bottom: 5vh;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
`

const PairButton = styled.button`
    width: 15vw;
    height: 5vw;
    font-size: 2vw;
    margin-left: 1vw;
    margin-right: 1vw;
`

const PairRecordingButton = props => {
    const isSave = props.type === 'save'
    return (
        <PairButton
            type="button"
            className={`btn ${isSave ? 'btn-primary' : 'btn-danger'}`}
            disabled={props.disabled}
            onClick={props.onClick}
            data-tip={
                isSave
                    ? '収録を終了し、編集画面へ移動します'
                    : '収録を再開します'
            }
        >
            {props.children}
        </PairButton>
    )
}
