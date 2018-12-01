import React from 'react'
import ReactDOM from 'react-dom'
import LessonLoader from './utils/lessonLoader'
import LessonAvatar from '../shared/utils/lessonAvatar'
import LessonController from '../shared/components/lessonController'
import ModalWindow from '../shared/components/modalWindow'
import TweetButton from './tweetButton'
import styled from '@emotion/styled'

export default class LessonPlayer extends React.Component {
    constructor(props) {
        super(props)
        this.container
        this.playerElement
        this.lessonLoader = new LessonLoader()

        this.state = {
            avatar: new LessonAvatar(),
            lesson: {},
            packedlesson: {},
            isLoading: true,
            isModalOpen: false,
            modalOption: {}
        }
    }

    async componentDidMount() {
        const lessonID = this.props.match.params.id
        const {
            lesson,
            packedLesson,
            avatarFileURL
        } = await this.lessonLoader.loadLesson(lessonID).catch(() => {
            this.openModal({
                title: '読み込みに失敗しました',
                message: 'URLが間違っているか、公開期間が終了しています。',
                onClose: () => {
                    this.closeModal()
                    this.props.history.push('/')
                }
            })
        })

        const dom = await this.state.avatar.render(
            avatarFileURL,
            this.container
        )
        dom.setAttribute('id', 'avatar-canvas')
        dom.style.zIndex = 10
        dom.style.position = 'absolute'
        dom.style.top = 0
        dom.style.bottom = 0
        dom.style.left = 0
        dom.style.right = 0
        dom.style.margin = 'auto'
        ReactDOM.findDOMNode(this.playerElement).append(dom)

        addEventListener('resize', () => {
            this.state.avatar.updateSize(this.container)
        })

        this.setState({
            lesson: lesson,
            packedLesson: packedLesson,
            isLoading: false
        })
    }

    componentWillUnmount() {
        this.lessonLoader.clearLesson()
        if (this.state.avatar) this.state.avatar.clearBeforeUnload()
    }

    openModal(option) {
        this.setState({ isModalOpen: true, modalOption: option })
    }

    closeModal() {
        this.setState({ isModalOpen: false, modalOption: {} })
    }

    render() {
        return (
            <LessonPlayerContainer
                id="lesson-player"
                ref={e => {
                    this.container = e
                }}
            >
                <ModalWindow
                    isOpen={this.state.isModalOpen}
                    {...this.state.modalOption}
                />

                <LessonController
                    avatar={this.state.avatar}
                    lesson={this.state.packedLesson}
                    isLoading={this.state.isLoading}
                    ref={e => {
                        this.playerElement = e
                    }}
                />
                <TweetButton
                    title={this.state.lesson.title}
                    description={this.state.lesson.description}
                    isLoading={this.state.isLoading}
                />
            </LessonPlayerContainer>
        )
    }
}

const LessonPlayerContainer = styled.div`
    absolute: relative;
    text-align: center;
`
