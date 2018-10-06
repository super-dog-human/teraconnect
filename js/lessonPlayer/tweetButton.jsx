import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class TweetButton extends React.Component {
    constructor(props) {
        super(props);
    }

    _clickButton(event) {
        window.open(`https://twitter.com/share?text=${this.props.lesson.title}%20${this.props.lesson.description}&url=${document.location.href}&hashtags=Teraconnect`,
            'tweetwindow', 'width=650, height=470, personalbar=0, toolbar=0, scrollbars=1, sizable=1');
        event.target.blur();
    }

    render() {
        return(
            <div id="share-twitter">
                <button id="share-twitter-btn" className="btn btn-primary" onClick={this._clickButton.bind(this)}>
                    <FontAwesomeIcon icon={['fab', 'twitter']} />&nbsp;ツイート
                </button>
                <style jsx>{`
                    #share-twitter {
                        position: relative;
                        display: ${this.props.isLoading ? 'none' : 'block'};
                    }
                    #share-twitter-btn {
                        position: absolute;
                        z-index: 1000;
                        width: 120px;
                        height: 45px;
                        top: -70px;
                        right: 30px;
                    }
                `}</style>
            </div>
        )
    }
}