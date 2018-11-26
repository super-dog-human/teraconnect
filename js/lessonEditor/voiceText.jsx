import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from '@emotion/styled'
import { css } from 'emotion'

export default class VoiceText extends React.Component {
    constructor(props) {
        super(props)

        this.urls = []
        this.playingAudios = []
    }

    async componentDidUpdate(prevProps) {
        console.log(this.props.timelines)
        if (prevProps.isLoading && !this.props.isLoading) {
            this.urls = this.props.timelines
                .filter(t => {
                    return t.voice.id != ''
                })
                .map(t => {
                    return t.voice.url
                })
        }
    }

    handleTextChange(event) {
        const targetIndex = parseInt(event.target.getAttribute('custom-index'))
        const newText = event.target.value

        const timelines = this.props.timelines
        let textIndex = -1
        for (const [_, t] of timelines.entries()) {
            if (t.voice.id === '') continue

            textIndex++
            if (textIndex != targetIndex) continue
            if (textIndex === targetIndex) {
                t.text.body = newText
                break
            }
        }

        this.props.changeTimelines(timelines)
    }

    handleVoicePlayClick(event) {
        const voiceIndex = event.currentTarget.value
        if (this.playingAudios[voiceIndex]) {
            this.playingAudios[voiceIndex].pause()
            this.playingAudios[voiceIndex] = null
        } else {
            const audioElement = new Audio()
            this.playingAudios[voiceIndex] = audioElement
            const url = this.urls[voiceIndex]
            audioElement.src = url
            audioElement.addEventListener(
                'ended',
                () => {
                    this.playingAudios[voiceIndex] = null
                },
                true
            )
            audioElement.play()
        }
    }

    render() {
        return (
            <div className="app-back-color-dark-gray">
                <VoiceTextLines>
                    {this.props.timelines
                        .filter(t => {
                            return t.voice.id != ''
                        })
                        .map((t, i) => {
                            return t.text.body === '' &&
                                this.props.isLoading ? (
                                    <VoiceTextLine
                                        key={i}
                                        className={loadingVoiceTextLineStyle}
                                    >
                                        <FontAwesomeIcon
                                            icon="spinner"
                                            spin
                                            className="app-text-color-soft-white"
                                        />
                                    </VoiceTextLine>
                                ) : (
                                    <VoiceTextLine key={i}>
                                        <DetectedVoiceText
                                            index={i}
                                            isLoading={this.props.isLoading}
                                            onPlayButtonClick={this.handleVoicePlayClick.bind(
                                                this
                                            )}
                                            onTextChange={this.handleTextChange.bind(
                                                this
                                            )}
                                            body={t.text.body}
                                        />
                                    </VoiceTextLine>
                                )
                        })}
                </VoiceTextLines>
            </div>
        )
    }
}

const VoiceTextLines = styled.div`
    width: 100%;
    height: calc(
        100% - 50px - 146px
    ); /* heights of header and header controller buttons. */
    overflow-y: scroll;
    &::-webkit-scrollbar {
        display: none;
    }
`

const VoiceTextLine = styled.div`
    position: relative;
    display: block;
    width: 54vw;
    height: 40px;
    margin-top: 20px;
    margin-left: 1vw;
`

const loadingVoiceTextLineStyle = css`
    padding-top: 8px;
    padding-left: 10px;
    border: 1px solid #d8d8d8;
    border-radius: 5px;
    font-size: 20px;
    color: var(--dark-gray);
`

const DetectedVoiceText = props => {
    const buttonStyle = css`
        position: absolute;
        outline: none;
        height: 25px;
        border: none;
        cursor: pointer;
        top: 0;
        left: 3px;
        bottom: 0;
        margin: auto;
        font-size: 18px;
    `

    const inputStyle = css`
        text-indent: 30px;
    `

    return (
        <>
            <button
                value={props.index}
                className={`${buttonStyle} app-text-color-dark-gray`}
                onClick={props.onPlayButtonClick}
                disabled={props.isLoading}
                tabIndex="-1"
            >
                <FontAwesomeIcon icon="volume-up" />
            </button>
            <input
                type="text"
                custom-index={props.index}
                className={`form-control ${inputStyle}`}
                defaultValue={props.body}
                placeholder={props.body === '' ? '（検出なし）' : ''}
                disabled={props.isLoading}
                onChange={props.onTextChange}
            />
        </>
    )
}
