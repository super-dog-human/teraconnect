import React from 'react'
import ReactDOM from 'react-dom'
import { Clock } from 'three'
import {
    moveAvatarTo,
    moveAvatarBones,
    moveAvatarPosition,
    moveFacialExpression,
    moveEyesBlink
} from './utils/avatarPreviewUtility'
import { css } from 'emotion'

export default class AvatarPreview extends React.Component {
    constructor(props) {
        super(props)

        this.avatar = props.avatar
        this.clock = new Clock(true)
        this.isLoading = false
        this.isLoadingCompleted = false

        addEventListener('resize', () => {
            if (!this.isLoadingCompleted) return
            this.avatar.updateSize(this.props.previewContainer)
        })
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.faceWeight != nextProps.faceWeight) {
            moveFacialExpression(this.avatar, nextProps.faceWeight)
        }

        if (this.props.moveDirection != nextProps.moveDirection) {
            moveAvatarTo(this.avatar, nextProps.moveDirection)
        }

        if (this.props.avatarURL != '' && nextProps.previewContainer) {
            this.loadAvatar(nextProps.previewContainer)
        }

        if (this.props.isPoseDetection && !nextProps.isPoseDetection) {
            this.avatar.setDefaultPose()
        }

        if (nextProps.pose && Object.keys(nextProps.pose).length > 0) {
            moveAvatarBones(this.avatar, nextProps.pose)
        }

        if (
            (!this.props.isEyesBlink && nextProps.isEyesBlink) ||
            (this.props.isEyesBlink && !nextProps.isEyesBlink)
        ) {
            moveEyesBlink(this.avatar, nextProps.isEyesBlink)
        }
    }

    async loadAvatar(previewContainer) {
        if (this.isLoading || this.isLoadingCompleted) return

        this.isLoading = true

        const dom = await this.avatar.render(
            this.props.avatarURL,
            previewContainer
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

        this.isLoading = false
        this.isLoadingCompleted = true

        this.props.loadingCompleted()
    }

    animate() {
        const deltaTime = this.clock.getDelta()
        this.avatar.animate(deltaTime)
        moveAvatarPosition(this.avatar, deltaTime)

        requestAnimationFrame(() => this.animate())
    }

    render() {
        const avatarPreviewStyle = css`
            text-align: center;
        `

        return (
            <div
                className={avatarPreviewStyle}
                ref={e => {
                    this.container = e
                }}
            />
        )
    }
}
