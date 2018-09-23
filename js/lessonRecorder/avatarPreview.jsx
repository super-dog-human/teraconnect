import React from 'react';
import ReactDOM from 'react-dom';
import LessonAvatar from '../lessonPlayer/lessonAvatar';
import { Clock } from 'three';

export default class AvatarPreview extends React.Component {
    constructor(props) {
        super(props)
        this.avatar = new LessonAvatar();
        this.clock  = new Clock(true);
        this.isLoading = false;
        this.isLoadingCompleted = false;

        window.addEventListener('resize', (() => {
            if (!this.isLoadingCompleted) return;
            this.avatar.updateSize(this.props.previewContainer);
        }));
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.faceName != nextProps.faceName) {
            this.avatar.changeFace(nextProps.faceName);
        }

        if (this.props.moveDirection != nextProps.moveDirection) {
            this.avatar.moveTo(nextProps.moveDirection);
            const position = this.avatar.currentPosition();
            if (nextProps.moveDirection == 'stop') {
                this.props.movedPosition(position);
            } else {
                this.props.startMovingPositionTime();
            }
        }

        if (this.props.avatarURL != '' && nextProps.previewContainer) {
            this._loadAvatar(nextProps.previewContainer);
        }

        if (this.props.isSpeaking != nextProps.isSpeaking) {
            this.avatar.playLipSync(nextProps.isSpeaking);
        }

        if (this.props.isPoseDetection && !nextProps.isPoseDetection) {
            this.avatar.initBonePosition();
        }

        if (nextProps.pose && Object.keys(nextProps.pose).length > 0) {
            this.avatar.moveBones(nextProps.pose);
        }
    }

    async _loadAvatar(previewContainer) {
        if (this.isLoading || this.isLoadingCompleted) return;

        this.isLoading = true;

        const dom = await this.avatar.createDom(this.props.avatarURL, previewContainer);

        this.avatar.setDefaultAnimation();
        this.avatar.play(true);
        this._animate();

        dom.setAttribute('id', 'avatar-canvas');
        ReactDOM.findDOMNode(this.container).append(dom);

        this.isLoading = false;
        this.isLoadingCompleted = true;

        this.props.loadingCompleted();
    }

    _animate() {
        requestAnimationFrame(() => this._animate());
        this.avatar.animate(this.clock.getDelta());
    }

    render() {
        return(
            <div id="avatar-preview" ref={(e) => { this.container = e; }}>
                <style jsx>{`
                    #avatar-preview {
                        text-align: center;
                    }
                `}</style>
            </div>
        )
    }
}