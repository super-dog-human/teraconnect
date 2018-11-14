import LessonAvatar from '../common/lessonAvatar'
import { fetchSignedURLs } from '../common/networkManager'
import ReactDOM from 'react-dom'

export default class LessonMaterialLoader {
    constructor(lessonID) {
        this.lessonID = lessonID
    }

    async loadAvatar(avatarURL, container, playerElement) {
        const avatar = new LessonAvatar(this.lessonID)
        const dom = await avatar.render(avatarURL, container)
        dom.setAttribute('id', 'avatar-canvas')
        dom.style.zIndex = 10
        dom.style.position = 'absolute'
        ReactDOM.findDOMNode(playerElement).append(dom)

        addEventListener('resize', () => {
            avatar.updateSize(container)
        })

        return avatar
    }

    async fetchAndMergeGraphicToTimeline(graphics, timelines) {
        const graphicsWithURL = await mergeURLToGraphics(graphics)
        const graphicObject = graphicsToIDKeyObject(graphicsWithURL)

        // add graphic filetypes from API response because graphics in timelins has no filetype.
        return mergeGraphicToLessonMaterial(timelines, graphicObject)

        async function mergeURLToGraphics(graphics) {
            const files = graphics.map(graphic => {
                return {
                    id: graphic.id,
                    entity: 'graphic',
                    extension: graphic.fileType
                }
            })

            const urls = await fetchSignedURLs(files)
            graphics.forEach((g, i) => {
                g.url = urls[i]
            })

            return graphics
        }

        function graphicsToIDKeyObject(graphics) {
            const graphic = {}
            graphics.forEach(g => {
                graphic[g.id] = {
                    url: g.url,
                    fileType: g.fileType
                }
            })

            return graphic
        }

        function mergeGraphicToLessonMaterial(timelines, graphic) {
            const timelineWithGraphics = timelines.filter(t => {
                return t.graphics
            })
            timelineWithGraphics.forEach(timeline => {
                timeline.graphics.forEach(lessonGraphic => {
                    const id = lessonGraphic.id
                    lessonGraphic.url = graphic[id].url
                    lessonGraphic.fileType = graphic[id].fileType
                })
            })

            return timelines
        }
    }

    async fetchAndMergeVoiceTextToTimeline(timelines, voiceTexts) {
        const voiceTextById = {}
        voiceTexts.forEach(v => {
            voiceTextById[v.fileID] = { text: v.text }
        })

        timelines.forEach(t => {
            if (t.voice.id == '') return

            const id = t.voice.id
            const voiceText = voiceTextById[id]
            if (voiceText) {
                t.text.body = voiceText.text
            }
        })

        return timelines
    }

    async fetchVoiceURLsToTimelines(lessonID, timelines) {
        const filePath = `voice/${lessonID}`
        const files = timelines
            .filter(t => {
                return t.voice.id != ''
            })
            .map(t => {
                return t.voice
            })
            .map(voice => {
                return {
                    id: voice.id,
                    entity: filePath,
                    extension: 'ogg'
                }
            })

        const urls = await fetchSignedURLs(files)
        let voiceIndex = -1
        timelines.forEach(t => {
            if (t.voice.id == '') return
            voiceIndex++
            t.voice.url = urls[voiceIndex]
        })

        return timelines
    }
}
