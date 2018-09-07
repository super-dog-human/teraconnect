import axios from 'axios';
import * as Const from '../common/constants';

export default class LessonMaterialLoader {
    constructor(lessonID) {
        this.lessonID = lessonID;

        this.lesson        = {};
        this.material      = {};
    }

    async fetchLesson() {
        const materialURL = Const.LESSON_API_URL.replace('{lessonID}', this.lessonID);
        const result = await axios.get(materialURL).catch((err) => {
            throw new Error(err);
        });

        return result.data;
    }

    async fetchRawLessonMaterial() {
        const materialURL = Const.LESSON_MATERIAL_API_URL.replace('{lessonID}', this.lessonID);
        const result = await axios.get(materialURL).catch((err) => {
            throw new Error(err);
        });

        return result.data;
    }

    async fetchAndMergeGraphicToTimeline(timelines) {
        const graphics      = await fetchLessonGraphics(this);
        const graphicObject = graphicsToIDKeyObject(graphics);

        // graphics in timelins has no filetype so add that from API response.
        return mergeGraphicToLessonMaterial(timelines, graphicObject);

        async function fetchLessonGraphics(self) {
            const graphicURL = Const.LESSON_GRAPHIC_API_URL.replace('{lessonID}', self.lessonID);
            const result = await axios.get(graphicURL).catch((err) => {
                throw new Error(err);
            });

            if (!result) throw new Error(err);

            return result.data.graphics;
        }

        function graphicsToIDKeyObject(graphics) {
            const graphic = {};
            graphics.forEach((g) => {
                graphic[g.id] = { fileType: g.fileType };
            });

            return graphic;
        }

        function mergeGraphicToLessonMaterial(timelines, graphic) {
            const timelineWithGraphics = timelines.filter((t) => { return t.graphic });
            timelineWithGraphics.forEach((timeline) => {
                timeline.graphics.forEach((lessonGraphic) => {
                    const id = lessonGraphic.id;
                    lessonGraphic.fileType = graphic[id].fileType;
                });
            });

            return timelines;
        }
    }

    async fetchVoiceTexts() {
        const url = Const.LESSON_VOICE_TEXT_API_URL.replace('{lessonID}', this.lessonID);
        const result = await axios.get(url).catch((err) => {
            if (err.response.status == 404) {
                return { data: [] };
            } else {
                throw new Error(err);
            }
        });

        return result.data;
    }

    async fetchAndMergeVoiceTextToTimeline(timelines, voiceTexts) {
        const voiceTextById = {};
        voiceTexts.forEach((v) => {
            voiceTextById[v.fileID] = { text: v.text };
        });

        timelines.forEach((t) => {
            if (t.voice.id == '') return;

            const id = t.voice.id;
            const voiceText = voiceTextById[id];
            if (voiceText) {
                t.text.body = voiceText.text;
            }
        });

        return timelines;
    }
}