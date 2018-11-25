import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Clock } from 'three'
import Indicator from '../indicator'
import RangeSlider from '../rangeSlider'
import LessonTexts from './lessonTexts'
import LessonGraphics from './lessonGraphics'
import LessonVoicePlayer from './utils/lessonVoicePlayer'
import {
    loadDefaultAnimation,
    loadAnimation,
    resetAnimation
} from './utils/lessonControllerUtility'
import * as Const from '../../../shared/utils/constants'
import styled from '@emotion/styled'

export default class LessonController extends React.Component {
    constructor(props) {
        super(props)

        this.clock = new Clock(false)
        this.preElapsedTime = 0
        this.pausedElapsedTime = 0

        this.state = {
            isPlaying: false,
            isPause: false,
            isSeeking: false,
            texts: [],
            graphics: [],
            elapsedTime: 0
        }

        this.voicePlayer = new LessonVoicePlayer()
    }

    componentDidUpdate(prevProps) {
        if (this.props.isLoading) return

        if (prevProps.isLoading && !this.props.isLoading) {
            loadDefaultAnimation(this.props.avatar)
            loadAnimation(
                this.props.avatar,
                this.props.lesson.poseKey,
                this.props.lesson.faceKey
            )
            return
        }

        if (prevProps.lesson.timelines != this.props.lesson.timelines) {
            // FIXME array comparing
            this.updateCurrentContents(this.elapsedTime())
        }

        if (
            prevProps.lesson.poseKey != this.props.lesson.poseKey ||
            prevProps.lesson.faceKey != this.props.lesson.faceKey
        ) {
            loadAnimation(
                this.props.avatar,
                this.props.lesson.poseKey,
                this.props.lesson.faceKey
            )
        }
    }

    async componentWillUnmount() {
        this.clock.stop()
        this.voicePlayer.stop()
        this.props.avatar.stop()
    }

    handlePlayButtonClicked(event) {
        if (this.state.isPlaying) {
            this.stop()
        } else {
            this.play()
        }
        event.target.blur()
    }

    async handleRangeSliderMouseDown() {
        await this.setState({ isSeeking: true })

        if (this.state.isPlaying) {
            this.clock.stop()
        }
        this.voicePlayer.reset()
    }

    async handleRangeSliderChange(event) {
        if (!this.state.isSeeking) return

        const newElapsedTime = parseFloat(event.target.value)
        this.preElapsedTime = newElapsedTime
        this.pausedElapsedTime = newElapsedTime

        await this.setState({ elapsedTime: newElapsedTime })
        this.updateSeekingPreviewContents(newElapsedTime)
    }

    async handleRangeSliderMouseUp() {
        this.updateAfterSeekingContents()

        await this.setState({ isSeeking: false })

        if (this.state.isPlaying) {
            this.clock.start()
            this.animate()
        }
    }

    async play() {
        this.clock.start()

        if (!this.state.isPlaying) {
            await this.setState({ isPlaying: true })
            this.voicePlayer.play() // for play seeked audio when stopping
        }

        if (this.state.isPause) {
            await this.setState({ isPause: false })
            this.voicePlayer.play() // for resume audio
        }

        this.props.avatar.play()
        this.animate()
    }

    async stop(isEnd = false) {
        this.clock.stop()

        await this.setState({ isPlaying: false })

        this.pausedElapsedTime += this.clock.elapsedTime
        this.voicePlayer.stop()
        if (isEnd) {
            this.props.avatar.stop()
        } else {
            await this.setState({ isPause: true })
            this.props.avatar.pause()
        }
    }

    animate() {
        if (!this.state.isPlaying) return
        if (this.state.isSeeking) return

        const elapsedTime = this.elapsedTime()
        this.setState({ elapsedTime })

        if (elapsedTime >= this.props.lesson.durationSec) {
            this.endPlaying()
            return
        }

        this.props.avatar.animate(this.clock.getDelta())
        this.updateCurrentContents(elapsedTime)
        this.preElapsedTime = elapsedTime

        requestAnimationFrame(() => this.animate())
    }

    elapsedTime() {
        return this.clock.elapsedTime + this.pausedElapsedTime
    }

    updateCurrentContents(elapsedTime) {
        this.hideTimelineTextIfNeeded(elapsedTime)

        const since = this.preElapsedTime
        const until = elapsedTime

        this.props.lesson.timelines
            .filter(t => {
                return t.timeSec > since && t.timeSec <= until
            })
            .forEach(timeline => {
                this.avatarAction(timeline.action)
                this.playTimelineVoice(timeline.voice)
                this.showTimelineText(timeline.text, elapsedTime)
                this.updateTimelineGraphic(timeline.graphics)
            })
    }

    async updateSeekingPreviewContents(elapsedTime) {
        await this.setState({ texts: [], graphics: [] })

        let action, text, graphics
        this.props.lesson.timelines.some(t => {
            if (t.timeSec > elapsedTime) return true

            if (t.action.action != '') action = t.action

            if (t.text.durationSec > 0) {
                const remainingDurationSec =
                    t.timeSec + t.text.durationSec - elapsedTime
                if (remainingDurationSec > 0) {
                    text = Object.assign({}, t.text)
                    text.durationSec = remainingDurationSec
                }
            }

            if (t.graphics != null) graphics = t.graphics
        })

        if (text) {
            this.showTimelineText(text, elapsedTime)
        }

        this.avatarAction(action)
        this.props.avatar.jumpAnimationAt(elapsedTime)

        if (graphics) {
            this.updateTimelineGraphic(graphics)
        }
    }

    async updateAfterSeekingContents() {
        let voice, voiceStartTime
        this.props.lesson.timelines.some(t => {
            if (t.timeSec > this.pausedElapsedTime) return true
            if (
                t.voice.id != '' &&
                t.timeSec + t.voice.durationSec > this.pausedElapsedTime
            ) {
                voiceStartTime = this.pausedElapsedTime - t.timeSec
                voice = Object.assign({}, t.voice)
                voice.durationSec =
                    t.timeSec + t.voice.durationSec - this.pausedElapsedTime
            }
        })

        if (this.state.isPlaying) {
            this.playTimelineVoice(voice, voiceStartTime)
            this.animate()
        } else if (voice) {
            this.playTimelineVoice(voice, voiceStartTime, false)
        }
    }

    async endPlaying() {
        await this.stop(true)
        resetAnimation(this.props.avatar)

        this.preElapsedTime = 0
        this.pausedElapsedTime = 0
        this.setState({ texts: [], graphics: [] })
    }

    avatarAction(action) {
        // currently nothing to do
    }

    playTimelineVoice(voice, startAtSec = 0, isImmediately = true) {
        if (!voice || voice.id === '') return

        if (isImmediately) {
            this.voicePlayer.setAndPlay(
                voice.url,
                startAtSec,
                voice.durationSec
            )
        } else {
            this.voicePlayer.set(voice.url, startAtSec, voice.durationSec)
        }
    }

    async showTimelineText(text, elapsedTime) {
        if (!text || text.durationSec === 0) return

        const newTexts = this.state.texts
        text.hiddenAtSec = text.durationSec + elapsedTime
        newTexts.push(text)
        await this.setState({ texts: newTexts })
    }

    hideTimelineTextIfNeeded(elapsedTime) {
        const currentShowingTextLength = this.state.texts.length
        if (currentShowingTextLength === 0) return

        const shouldShowingTexts = this.state.texts.filter(text => {
            return text.hiddenAtSec > elapsedTime
        })

        if (shouldShowingTexts.length < currentShowingTextLength) {
            this.setState({ texts: shouldShowingTexts })
        }
    }

    updateTimelineGraphic(graphics) {
        if (!graphics) return

        graphics.forEach(graphic => {
            const currentGraphicsLength = this.state.graphics.length
            const targetGraphicID = graphic.id

            let newGraphics = []
            switch (graphic.action) {
            case 'show':
                newGraphics = this.state.graphics
                newGraphics.push(graphic)
                this.setState({ graphics: newGraphics })
                break
            case 'hide':
                if (currentGraphicsLength === 0) break
                newGraphics = this.state.graphics.filter(graphic => {
                    return graphic.id != targetGraphicID
                })

                if (newGraphics.length != this.state.graphics) {
                    this.setState({ graphics: newGraphics })
                }
                break
            }
        })
    }

    render() {
        return (
            <LessonControllerScreen>
                <Indicator isLoading={this.props.isLoading} />
                <ControlPanel>
                    <ControlButton
                        onClick={this.handlePlayButtonClicked.bind(this)}
                        isLoading={this.props.isLoading}
                        isPlaying={this.state.isPlaying}
                    >
                        <FontAwesomeIcon icon="play-circle" />
                    </ControlButton>
                    <RangeSlider
                        value={this.state.elapsedTime}
                        max={
                            this.props.lesson // FIXME, you can write more better code.
                                ? this.props.lesson.durationSec
                                : 0
                        }
                        isPlaying={this.state.isPlaying}
                        onMouseDown={this.handleRangeSliderMouseDown.bind(this)}
                        onChange={this.handleRangeSliderChange.bind(this)}
                        onMouseUp={this.handleRangeSliderMouseUp.bind(this)}
                    />
                </ControlPanel>
                <LessonGraphics graphics={this.state.graphics} />
                <LessonTexts texts={this.state.texts} />
            </LessonControllerScreen>
        )
    }
}

const LessonControllerScreen = styled.div`
    position: relative;
    width: ${Const.RATIO_9_TO_16 * 100}vh;
    height: ${Const.RATIO_16_TO_9 * 100}vw;
    max-width: 100%;
    max-height: 100%;
    margin-left: auto;
    margin-right: auto;
`

const ControlPanel = styled.div`
    position: absolute;
    top: 0;
    z-index: 200; // control panel
    width: 100%;
    height: 100%;
`

const ControlButton = styled.button`
    display: ${props => (props.isLoading ? 'none' : 'block')};
    border: none;
    cursor: pointer;
    width: 100%;
    height: 100%;
    font-size: 10vw;
    opacity: 0;
    &:focus {
        outline: 0;
    }
    &:hover {
        opacity: ${props => (props.isLoading || props.isPlaying ? 0 : 0.2)};
    }
`
