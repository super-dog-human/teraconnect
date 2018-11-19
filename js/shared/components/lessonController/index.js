import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Clock } from 'three'
import Indicator from '../indicator'
import LessonTexts from './lessonTexts'
import LessonGraphics from './lessonGraphics'
import LessonVoicePlayer from './utils/lessonVoicePlayer'
import {
    loadDefaultAnimation,
    loadAnimation,
    resetAnimation
} from './utils/lessonControllerUtility'
import * as Const from '../../../common/constants'

export default class LessonController extends React.Component {
    constructor(props) {
        super(props)

        this.clock = new Clock(false)
        this.preElapsedTime = 0
        this.pausedElapsedTime = 0

        this.state = {
            isPlaying: false,
            texts: [],
            voices: [],
            graphics: []
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
            prevProps.lesson.poseKey != this.props.poseKey ||
            prevProps.lesson.faceKey != this.props.faceKey
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

    panelClick(event) {
        if (this.state.isPlaying) {
            this.stop()
        } else {
            this.play()
        }
        event.target.blur()
    }

    async play() {
        this.clock.start()

        await this.setState({ isPlaying: true })

        if (this.pausedElapsedTime > 0) {
            this.voicePlayer.play() // for resume audio
            this.props.avatar.resume()
        } else {
            this.props.avatar.play()
        }
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
            this.props.avatar.pause()
        }
    }

    animate() {
        if (!this.state.isPlaying) return

        const elapsedTime = this.elapsedTime()
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
        const since = this.preElapsedTime
        const until = elapsedTime

        this.hideTimelineTextIfNeeded(elapsedTime)

        this.props.lesson.timelines
            .filter(t => {
                return t.timeSec > since && t.timeSec <= until
            })
            .forEach(timeline => {
                this.avatarAction(timeline.action)
                this.playTimelineVoice(timeline.voice, elapsedTime)
                this.showTimelineText(timeline.text, elapsedTime)
                this.showTimelineGraphic(timeline.graphics)
            })
    }

    async endPlaying() {
        await this.stop(true)
        resetAnimation(this.props.avatar)
        this.voicePlayer.reset()

        this.preElapsedTime = 0
        this.pausedElapsedTime = 0
        this.setState({ texts: [], voices: [], graphics: [] })
    }

    avatarAction(action) {
        // currently nothing to do
    }

    playTimelineVoice(voice, elapsedTime) {
        if (voice.id == '') return

        this.voicePlayer.setAndPlay(voice.url, voice.durationSec)

        voice.stopAtSec = voice.durationSec + elapsedTime
        const newVoices = this.state.voices
        newVoices.push(voice)
        this.setState({ voices: newVoices })
    }

    showTimelineText(text, elapsedTime) {
        if (text.durationSec == 0) return

        const newTexts = this.state.texts
        text.hiddenAtSec = text.durationSec + elapsedTime
        newTexts.push(text)
        this.setState({ texts: newTexts })
    }

    hideTimelineTextIfNeeded(elapsedTime) {
        const currentShowingTextLength = this.state.texts.length
        if (currentShowingTextLength == 0) return

        const shouldShowingTexts = this.state.texts.filter(text => {
            return text.hiddenAtSec > elapsedTime
        })

        if (shouldShowingTexts.length < currentShowingTextLength) {
            this.setState({ texts: shouldShowingTexts })
        }
    }

    showTimelineGraphic(graphics) {
        if (graphics == null) return

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
                if (currentGraphicsLength == 0) break
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
            <div id="lesson-player">
                <Indicator isLoading={this.props.isLoading} />
                <div id="control-panel">
                    <button
                        className="control-btn"
                        onClick={this.panelClick.bind(this)}
                    >
                        <FontAwesomeIcon icon="play-circle" />
                    </button>
                </div>

                <LessonGraphics graphics={this.state.graphics} />
                <LessonTexts texts={this.state.texts} />
                <style jsx>{`
                    #lesson-player {
                        position: relative;
                        width: ${Const.RATIO_9_TO_16 * 100}vh;
                        height: ${Const.RATIO_16_TO_9 * 100}vw;
                        max-width: 100%;
                        max-height: 100%;
                        margin-left: auto;
                        margin-right: auto;
                    }
                    #control-panel {
                        position: absolute;
                        top: 0;
                        z-index: 200; // control panel
                        width: 100%;
                        height: 100%;
                    }
                    .control-btn {
                        display: ${this.props.isLoading ? 'none' : 'block'};
                        border: none;
                        cursor: pointer;
                        width: 100%;
                        height: 100%;
                        font-size: 10vw;
                        opacity: 0;
                    }
                    .control-btn:focus {
                        outline: 0;
                    }
                    .control-btn:hover {
                        opacity: ${this.props.isLoading || this.state.isPlaying
                ? 0
                : 0.2};
                    }
                `}</style>
            </div>
        )
    }
}
