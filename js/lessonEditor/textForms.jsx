import React from 'react';
import axios from 'axios';
import { Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const API_URL = "https://api.teraconnect.org/voice_text/";

export default class TextForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = { voice_texts: [] };
    }

    componentDidMount() {
      axios
        .get(API_URL + this.props.lessonID)
        .then((results) => {
          const voice_texts = results.data;
          if (voice_texts) {
            this.setState({ voice_texts: voice_texts });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }

    render() {
      return(
        <div id="lessons">
          <div id="lines">
            {
              this.state.voice_texts.map((t, i) => {
                if (t.isTexted && t.text) {
                  return <div className="line" key={i}><Input type="text" defaultValue={t.text} /></div>
                } else if (t.isTexted) {
                  return <div className="line" key={i}><Input type="text" placeholder="（検出なし）" /></div>
                } else {
                  return <div className="line text-detecting" key={i}><FontAwesomeIcon icon="spinner" spin /></div>
                }
              })
            }
          </div>
        </div>
      )
    }
  }