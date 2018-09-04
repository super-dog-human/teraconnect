import React from 'react';
import { Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class TextForm extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="lesson-text">
                <div id="lines">
                    {
                        this.props.voiceTexts.map((t, i) => {
                            if (t.isTexted && t.text) {
                                return <div className="line" key={i}><Input type="text" defaultValue={t.text} disabled={this.props.isLoading} /></div>
                            } else if (t.isTexted) {
                                return <div className="line" key={i}><Input type="text" placeholder="（検出なし）" disabled={this.props.isLoading} /></div>
                            } else {
                                return <div className="line text-detecting" key={i}><FontAwesomeIcon icon="spinner" spin /></div>
                            }
                        })
                    }
                </div>
                <style jsx>{`
                    #lesson-text > #lines {
                        width: 100%;
                        height: 100%;
                        background-color: #616163;
                        padding-top: 50px;
                        padding-bottom: 50px;
                    }

                    #lesson-text > #lines > .line {
                        display: block;
                        width: 500px;
                        height: 40px;
                        margin-top: 10px;
                        margin-left: auto;
                        margin-right: auto;
                    }

                    #lesson-text > #lines > .line input {
                        color: #ffffff;
                        background-color: #616163;
                        font-size: 15px;
                        border: 1px solid #D8D8D8;
                        border-radius: 5px;
                    }
                    #lesson-text > #lines .text-detecting {
                        padding-top: 8px;
                        padding-left: 10px;
                        border: 1px solid #D8D8D8;
                        border-radius: 5px;
                        font-size: 20px;
                        color: #D8D8D8;
                    }
                `}</style>
            </div>
        )
    }
}