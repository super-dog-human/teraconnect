import React from 'react'
import ReactDOM from 'react-dom'
import FaceDetector from './utils/faceDetector'
import { Clock } from 'three'
import {
    moveAvatarTo,
    moveAvatarBones,
    moveAvatarPosition,
    moveFacialExpression,
    moveEyesBlink
} from './utils/avatarPreviewUtility'

export default class AvatarPreview extends React.Component {
    constructor(props) {
        super(props)

        this.avatar = props.avatar
        this.clock = new Clock(true)
        this.isAvatarLoading = false
        this.isAvatarLoadingCompleted = false
        this.isDetectorLoadingCompleted = false
        this.userVideo
        this.userVideoPreview

        this.state = {
            isEyesBlink: false,
            faceWeight: {},
            pose: {}
        }

        this.faceDetector = new FaceDetector(
            // callback when completed loading
            () => {
                this.isDetectorLoadingCompleted = true
                this.checkLoadingComplete()
                this.faceDetectionInFrame()
            },
            // callback when get face
            (weight, neckPoses, isBlink) => {
                this.props.recordMotion(weight, neckPoses, isBlink)
                this.setState({
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
                this.props.lostTracking()
            }
        )

        addEventListener('resize', () => {
            if (!this.isAvatarLoadingCompleted) return
            this.avatar.updateSize(this.props.previewContainer)
        })
    }

    async componentDidMount() {
        this.faceDetector.setup(this.userVideo, this.userVideoPreview)
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.avatarURL != '' && this.props.previewContainer) {
            this.loadAvatar()
        }

        if (!this.isAvatarLoadingCompleted) return
        if (!this.isDetectorLoadingCompleted) return

        if (prevProps.movingDirection != this.props.movingDirection) {
            moveAvatarTo(this.avatar, this.props.movingDirection)
        }

        if (prevProps.faceName != this.props.faceName) {
            this.faceDetector.setBaseFace(this.props.faceName)
        }

        //        if (lost tracking of pose) {
        //            this.avatar.setDefaultPose()
        //        }

        if (
            (!prevState.isEyesBlink && this.state.isEyesBlink) ||
            (prevState.isEyesBlink && !this.state.isEyesBlink)
        ) {
            moveEyesBlink(this.avatar, this.state.isEyesBlink)
        }

        if (prevState.faceWeight != this.state.faceWeight) {
            moveFacialExpression(this.avatar, this.state.faceWeight)
        }

        if (prevState.pose && Object.keys(this.state.pose).length > 0) {
            moveAvatarBones(this.avatar, this.state.pose)
        }
    }

    componentWillUnmount() {
        this.faceDetector.stop()
    }

    async faceDetectionInFrame() {
        this.faceDetector.detectFaceLandmarksInRealTime()
        requestAnimationFrame(() => this.faceDetectionInFrame())
    }

    async loadAvatar() {
        if (this.isAvatarLoading || this.isAvatarLoadingCompleted) return

        this.isAvatarLoading = true

        const dom = await this.avatar.render(
            this.props.avatarURL,
            this.props.previewContainer
        )

        this.avatar.setDefaultAnimation()
        this.avatar.initAnimationPlaying()
        this.avatar.play()
        this.animate()

        dom.setAttribute('id', 'avatar-canvas')
        dom.style.zIndex = 10
        dom.style.position = 'absolute'
        dom.style.top = 0
        dom.style.bottom = 0
        dom.style.left = 0
        dom.style.right = 0
        dom.style.margin = 'auto'
        ReactDOM.findDOMNode(this.container).append(dom)

        this.isAvatarLoading = false
        this.isAvatarLoadingCompleted = true
        this.checkLoadingComplete()
    }

    checkLoadingComplete() {
        if (this.isAvatarLoadingCompleted && this.isDetectorLoadingCompleted) {
            this.props.loadingCompleted()
        }
    }

    animate() {
        const deltaTime = this.clock.getDelta()
        this.avatar.animate(deltaTime)
        moveAvatarPosition(this.avatar, deltaTime)

        requestAnimationFrame(() => this.animate())
    }

    render() {
        return (
            <div
                ref={e => {
                    this.container = e
                }}
            >
                <video
                    className="d-none"
                    playsInline
                    ref={e => {
                        this.userVideo = e
                    }}
                />
                <canvas
                    className="d-none"
                    ref={e => {
                        this.userVideoPreview = e
                    }}
                />
            </div>
        )
    }
}
