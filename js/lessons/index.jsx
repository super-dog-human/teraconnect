import React from 'react';
import TextForm from './text_forms';

export default class Lessons extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
    <div>
      <TextForm lessonID={this.props.match.params.id}/>
    </div>
    )
  }
}