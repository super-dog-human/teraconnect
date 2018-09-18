import axios from 'axios';
import JSZip from 'jszip';
import LessonUtility from '../common/lessonUtility';
import * as Const from '../common/constants';

export default class LessonLoader {
    constructor(lessonID) {
        this.lessonID      = lessonID;
        this.avatarFileURL = null;
        this.lesson        = {};
        this.objectURLs    = [];
    }

    loadForPreview() {

    }

    async loadForPlay() {
        const lessonURL = Const.LESSON_API_URL.replace('{lessonID}', this.lessonID);
        const result = await axios.get(lessonURL);
        const lesson = result.data;
        const zip = await this._fetchLessonZipBlobWithRetry(lesson);
        await this._loadLessonMaterial(zip);

        const avatar = lesson.avatar;
        const avatarURL = await LessonUtility.fetchAvatarObjectURL(avatar);
        this.avatarFileURL = avatarURL;
    }

    async _fetchLessonZipBlobWithRetry(lesson) {
        const zip = await LessonUtility.fetchLessonZipBlob(lesson).catch(async (err) => {
            if (err.response.status == 404) { // not exist zipped lesson in cloud storage yet
                const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));
                await sleep(1000);
                return this._fetchLessonZipBlobWithRetry(lesson);
            }
            throw err;
        });

        return zip;
    }

    async _loadLessonMaterial(zipBody) {
        const unzip = await JSZip.loadAsync(zipBody)

        const lessonString = await unzip.file('lesson.json').async('string');
        this.lesson = JSON.parse(lessonString);
        this.lesson.timelines.forEach(async (t) => {
            if (t.voice.id != '') {
                const voicePath = 'voices/' + t.voice.id + '.ogg';
                const blob = await unzip.file(voicePath).async('blob');
                const objectURL = window.URL.createObjectURL(blob);
                t.voice.url = objectURL;
                this.objectURLs.push(objectURL);
            }

            if (!t.graphics) return;
            t.graphics.forEach(async (g) => {
                if (g.action != 'show') return;

                const graphicPath = 'graphics/' + g.id + '.' + g.fileType;
                const blob = await unzip.file(graphicPath).async('blob');
                const objectURL = window.URL.createObjectURL(blob);
                g.url = objectURL;
                this.objectURLs.push(objectURL);
            });
        });
    }

    clearBeforeUnload() {
        window.URL.revokeObjectURL(this.avatarFileURL);
        this.objectURLs.forEach((url) => {
            window.URL.revokeObjectURL(url);
        });
    }

}
