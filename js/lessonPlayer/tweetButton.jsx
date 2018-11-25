import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from '@emotion/styled'

export default ({ title, description, isLoading }) => (
    <ShareTwitter isLoading={isLoading}>
        <TweetButton
            className="btn btn-primary"
            onClick={event => {
                clickButton(event, title, description)
            }}
        >
            <FontAwesomeIcon icon={['fab', 'twitter']} />
            &nbsp;ツイート
        </TweetButton>
    </ShareTwitter>
)

function clickButton(event, title, description) {
    open(
        `https://twitter.com/share?text=${title}%20${description}&url=${
            document.location.href
        }&hashtags=Teraconnect`,
        'tweetwindow',
        'width=650, height=470, personalbar=0, toolbar=0, scrollbars=1, sizable=1'
    )
    event.target.blur()
}

const ShareTwitter = styled.div`
    z-index: 200;
    position: absolute;
    top: 100px;
    right: 40px;
    display: ${props => (props.isLoading ? 'none' : 'block')};
`

const TweetButton = styled.button`
    width: 120px;
    height: 45px;
`
