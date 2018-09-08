import axios from 'axios';
import * as Const from '../common/constants';

export default class LessonMaterialUploader {
    constructor(lessonID) {
        this.lessonID = lessonID;
    }

    async saveMaterial(body) {
        const url = Const.LESSON_MATERIAL_API_URL.replace('{lessonID}', this.lessonID);
        const result = await axios.put(url, body).catch((err) => {
            throw new Error(err);
        });

        return true;
    }

    async packMaterial() {
        const body = { dummy: "dummyBody" };
        const url = Const.LESSON_PACK_API_URL.replace('{lessonID}', this.lessonID);
        const result = await axios.put(url, body).catch((err) => {
            throw new Error(err);
        });

        return true;
    }
}