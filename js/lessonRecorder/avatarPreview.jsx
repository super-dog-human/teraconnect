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
        if (this.props.isPoseDetecting && !nextProps.isPoseDetecting) {
            this.avatar.initBonePosition();
            return;
        }

        if (Object.keys(nextProps.pose).length > 0) {
            this.avatar.moveBones(nextProps.pose);
        }

        if (this.props.facialName != nextProps.facialName) {
            this.avatar.changeFacial(nextProps.facialName);
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