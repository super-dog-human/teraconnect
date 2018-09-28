import LessonAvatar from '../lessonPlayer/lessonAvatar';
import LessonUtility from '../common/lessonUtility';
import ReactDOM from 'react-dom';

export default class LessonMaterialLoader {
    constructor(lessonID) {
        this.lessonID = lessonID;
    }

    async loadAvatar(avatarURL, container, playerElement) {
        const avatar = new LessonAvatar(this.lessonID);
        const dom = await avatar.createDom(avatarURL, container);
        dom.setAttribute('id', 'avatar-canvas');
        ReactDOM.findDOMNode(playerElement).append(dom);

        window.addEventListener('resize', (() => {
            avatar.updateSize(container);
        }));

        return avatar;
    }

    async fetchAndMergeGraphicToTimeline(graphics, timelines) {
        const graphicObject = graphicsToIDKeyObject(graphics);

        // graphics in timelins has no filetype so add that from API response.
        return mergeGraphicToLessonMaterial(timelines, graphicObject);

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

    async fetchVoiceURLsToTimelines(lessonID, timelines) {
        const filePath = `voice/${lessonID}`;
        const files = timelines.filter((t) => { return t.voice.id != ''; })
            .map((t) => { return t.voice; })
            .map((voice) => {
                return {
                id:        voice.id,
                entity:    filePath,
                extension: 'ogg',
            }
        });

        const urls = await LessonUtility.fetchSignedURLs(files);
        let voiceIndex = -1;
        timelines.forEach((t) => {
            if (t.voice.id == '') return;
            voiceIndex ++;
            t.voice.url = urls[voiceIndex];
        })

        return timelines;
    }
}