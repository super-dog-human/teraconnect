import 'babel-polyfill';
import axios from 'axios';
import JSZip from 'jszip';
import Utility from '../common/utility';
import * as Const from '../common/constants';

export default class LessonLoader {
    constructor(lessonID) {
        this.lessonID      = lessonID;
        this.avatarFileURL = null;
        this.lesson        = {};
    }

    loadForPreview() {

    }

    async loadForPlayAsync() {
        const signedZipHeader = Utility.customGetHeader([{ 'id': this.lessonID, 'entity': 'Lesson', 'extension': 'zip' }]);
        const signedZipParams = { headers: signedZipHeader };
        const signedZipResult = await axios.get(Const.SIGNED_URL_API_URL, signedZipParams);
        const lessonMaterialURL = signedZipResult.data.signed_urls[0];

        const zipResult = await axios.get(lessonMaterialURL, { responseType: 'blob' });
        this.loadLessonMaterialAsync(zipResult.data);

        const lessonURL = Const.LESSON_API_URL.replace('{lessonID}', this.lessonID);
        const lessonResult = await axios.get(lessonURL);
        const avatarID = lessonResult.data.avatar.id;

        const signedVRMHeader = Utility.customGetHeader([{ 'id': avatarID, 'entity': 'Avatar', 'extension': 'vrm' }]);
        const signedVRMParams = { headers: signedVRMHeader };
        const signedVRMResult = await axios.get(Const.SIGNED_URL_API_URL, signedVRMParams);
    //        const avatarURL = signedVRMResult.data.signed_urls[0];
        const avatarURL = 'http://localhost:1234/bdiuotgrbj8g00l9t3ng.vrm';

        this.avatarFileURL = avatarURL;
    }

    async loadLessonMaterialAsync(zipBody) {
        const unzip = await JSZip.loadAsync(zipBody)

        const lessonString = await unzip.file('lesson.json').async('string');
        this.lesson = JSON.parse(lessonString);
        this.lesson.timelines.forEach(async (t) => {
            if (t.voice.id != '') {
                const voicePath = 'voices/' + t.voice.id + '.ogg';
                const blob = await unzip.file(voicePath).async('blob');
                const objectURL = window.URL.createObjectURL(blob);
                t.voice.url = objectURL;
            }

            if (!t.graphics) return;
            t.graphics.forEach(async (g) => {
                if (g.action != 'show') return;

                const graphicPath = 'graphics/' + g.id + '.' + g.fileType;
                const blob = await unzip.file(graphicPath).async('blob');
                const objectURL = window.URL.createObjectURL(blob);
                g.url = objectURL;
            });
        });
    }

    clearBeforeUnload() {
        /*
        Object.values(this.material.graphics).forEach((graphic) => {
            window.URL.revokeObjectURL(graphic.url);
        });

        Object.values(this.material.voices).forEach((voice) => {
            window.URL.revokeObjectURL(voice.url);
        });
        */
    }

}
