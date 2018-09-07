import axios from 'axios';
import JSZip from 'jszip';
import * as Const from './constants';

export default class LessonUtility {
    static customGetHeader(objects) {
        return { 'X-Get-Params': JSON.stringify(objects) };
    }

    static async fetchAvatarObjectURL(avatarID) {
        const headers = [{
            id:        avatarID,
            entity:    'Avatar',
            extension: 'zip',
        }];

        const signedURLs = await LessonUtility.fetchSignedURLs(headers).catch((err) => {
            throw new Error(err);
        });

        const zip = await axios.get(signedURLs[0], { responseType: 'blob' }).catch((err) => {
            throw new Error(err);
        });

        const unzip = await JSZip.loadAsync(zip.data)
        const filePath = avatarID + '.vrm'
        const blob = await unzip.file(filePath).async('blob');
        const objectURL = window.URL.createObjectURL(blob);

        return objectURL;
    }

    static async fetchSignedURLs(objects) {
        const header = LessonUtility.customGetHeader(objects);
        const zipParams = { headers: header };
        const zipResult = await axios.get(Const.SIGNED_URL_API_URL, zipParams).catch((err) => {
            throw new Error(err);
        });
        return zipResult.data.signed_urls;
    }
}