import React from 'react';
import ReactDOM from 'react-dom';
import LessonAvatar from '../lessonPlayer/lessonAvatar';
import { Clock } from 'three';

export default class AvatarPreview extends React.Component {
    constructor(props) {
        super(props)
        this.avatar = new LessonAvatar();
        this.clock  = new Clock(true);
    }

    async componentDidMount() {
        const dom = await this.avatar.createDom(this.props.avatarURL, this.container);

        this.avatar.setDefaultAnimation();
        this.avatar.play(true);
        this.animate();

        dom.setAttribute('id', 'avatar-canvas');
        ReactDOM.findDOMNode(this.container).append(dom);

        window.addEventListener('resize', (() => {
            this.avatar.updateSize(this.container);
        }));
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.faceName != nextProps.faceName) {
            const ratio = (nextProps.faceName == 'AllJoy') ? 1 : 0.5;
            this.avatar.changeFace(nextProps.faceName, ratio);
        }

        if (this.props.moveDirection != nextProps.moveDirection) {
            this.avatar.moveTo(nextProps.moveDirection);
        }

        if (!nextProps.isPoseDetecting) {
//            this.avatar.initBonePosition(); // maybe unnecessary
            return;
        } else if (Object.keys(nextProps.pose).length > 0) {
            this.avatar.moveBones(nextProps.pose);
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.avatar.animate(this.clock.getDelta());
    }

    render() {
        return(
            <div id="avatar-preview" ref={(e) => { this.container = e; }}>
                <style jsx>{`
                    #avatar-preview {
                        text-align: center;
                        width: 100%;
                        height: 100%;
                        max-width: 100%;
                        max-height: 100%;
                    }
                `}</style>
            </div>
        )
    }
}