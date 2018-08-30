import React from 'react';
import ReactDOM from 'react-dom';
import LessonAvatar from '../lessonPlayer/lessonAvatar';
import { Clock } from 'three';
import * as Const from '../common/constants';

export default class AvatarPreview extends React.Component {
    constructor(props) {
        super(props)
        this.avatar = new LessonAvatar();
        this.clock  = new Clock(true);
    }

    async componentDidMount() {
        const dom = await this.avatar.createDom(this.props.avatar.url, this.container);

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
        if (Object.keys(nextProps.avatar.pose).length == 0) return;

        if (nextProps.avatar.pose == {}) return;
        // this.clock.getDelta()を元に時刻も渡す
        const elapsedTimeSec = 0;
        this.avatar.moveBones(nextProps.avatar.pose, elapsedTimeSec);
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