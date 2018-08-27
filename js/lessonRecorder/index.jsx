import React from 'react';
import Menu from '../menu';

export default class LessonRecorder extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <div>
                <Menu selectedIndex='2' />
            </div>
        )
    }
}