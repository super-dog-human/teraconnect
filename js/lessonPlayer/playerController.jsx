import React from 'react';
import FontAwesome from 'react-fontawesome'

export default class PlayerController extends React.Component {
    constructor(props) {
      super(props);
      // this.props.lessonAvatar
//      this.state = { voice_texts: [] };
// pause-circle
    }

    render() {
      return(
        <div>
          <FontAwesome name="play-circle" />
          <style jsx>{`
            p {
              color: red;
            }
          `}</style>
        </div>
      )
    }
  }