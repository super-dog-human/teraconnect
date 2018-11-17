import React from 'react'
import ReactDOM from 'react-dom'
import LessonLoader from './utils/lessonLoader'
import LessonAvatar from '../common/lessonAvatar'
import LessonController from '../shared/components/lessonController'
import TweetButton from './tweetButton'

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
            isLoading: true
        }
    }

    async componentDidMount() {
        const lessonID = this.props.match.params.id
        const {
            lesson,
            packedLesson,
            avatarFileURL
        } = await this.lessonLoader.loadLesson(lessonID).catch(err => {
            console.error(err)
            /*
            openModal(
                true,
                'エラー',
                '授業がみつかりませんでした。URLが誤っているか、公開期間が終了しています。',
                true,
                () => {
                    return <Redirect replace="/" />
                }
            )
            */
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

    render() {
        return (
            <div
                id="lesson-player"
                ref={e => {
                    this.container = e
                }}
            >
                <LessonController
                    avatar={this.state.avatar}
                    lesson={this.state.packedLesson}
                    isLoading={this.state.isLoading}
                    ref={e => {
                        this.playerElement = e
                    }}
                />
                <TweetButton
                    lesson={this.state.lesson}
                    isLoading={this.state.isLoading}
                />
                <style jsx>{`
                    #lesson-player {
                        text-align: center;
                    }
                `}</style>
            </div>
        )
    }
}
