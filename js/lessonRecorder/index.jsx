import React from 'react';
import Menu from '../menu';

export default class LessonRecorder extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <div>
        <Menu /> { /* FIXME use HoCs */}
      </div>
    )
  }
}