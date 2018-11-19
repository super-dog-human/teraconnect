import JSZip from 'jszip'
import {
    fetchLesson,
    fetchAvatarObjectURL,
    fetchLessonZipBlob
} from '../../shared/utils/networkManager'

export default class LessonLoader {
    constructor() {
        this._objectURLs = []
    }

    async loadLesson(lessonID) {
        const lesson = await fetchLesson(lessonID)
        const zip = await this._fetchLessonZipBlobWithRetry(lesson)
        const packedLesson = await this._loadLessonMaterial(zip)
        const avatarFileURL = await fetchAvatarObjectURL(lesson.avatar)
        this._objectURLs.push(avatarFileURL)

        return {
            lesson,
            packedLesson,
            avatarFileURL
        }
    }

    async _fetchLessonZipBlobWithRetry(lesson) {
        const zip = await fetchLessonZipBlob(lesson).catch(async err => {
            if (err.response.status == 404) {
                // not exist zipped lesson in cloud storage yet
                const sleep = msec =>
                    new Promise(resolve => setTimeout(resolve, msec))
                await sleep(1000)
                return this._fetchLessonZipBlobWithRetry(lesson)
            }
            throw err
        })

        return zip
    }

    async _loadLessonMaterial(zipBody) {
        const unzip = await JSZip.loadAsync(zipBody)

        const lessonString = await unzip.file('lesson.json').async('string')
        const packedLesson = JSON.parse(lessonString)
        packedLesson.timelines.forEach(async t => {
            if (t.voice.id != '') {
                const voicePath = 'voices/' + t.voice.id + '.ogg'
                const blob = await unzip.file(voicePath).async('blob')
                const objectURL = URL.createObjectURL(blob)
                t.voice.url = objectURL

                this._objectURLs.push(objectURL)
            }

            if (!t.graphics) return
            t.graphics.forEach(async g => {
                if (g.action != 'show') return

                const graphicPath = 'graphics/' + g.id + '.' + g.fileType
                const blob = await unzip.file(graphicPath).async('blob')
                const objectURL = URL.createObjectURL(blob)
                g.url = objectURL

                this._objectURLs.push(objectURL)
            })
        })

        return packedLesson
    }

    clearLesson() {
        this._objectURLs.forEach(url => {
            URL.revokeObjectURL(url)
        })
    }
}
