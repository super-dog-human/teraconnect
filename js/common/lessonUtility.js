import axios from 'axios';
import JSZip from 'jszip';
import './localCacheManager';
import * as Const from './constants';
import LocalCacheManager from './localCacheManager';

export default class LessonUtility {
    static customGetHeader(objects) {
        return { 'X-Get-Params': JSON.stringify(objects) };
    }

    static async fetchLessonZipBlob(lesson) {
        const cacheManager = new LocalCacheManager();
        return await cacheManager.isCachedLesson(lesson.id, lesson.version) ?
            await fetchFromCache() : await fetchFromServer();

        async function fetchFromCache() {
            console.log('found lesson cache!');
            return await cacheManager.cachedLessonZip(lesson.id);
        }

        async function fetchFromServer() {
            const headers = [{
                id:        lesson.id,
                entity:    'Lesson',
                extension: 'zip',
            }];
            const signedURLs = await LessonUtility.fetchSignedURLs(headers);
            const result = await axios.get(signedURLs, { responseType: 'blob' });

            const zip = result.data;
            await cacheManager.cacheLessonZip(lesson.id, zip, lesson.version);

            return zip;
        };
    }

    static async fetchAvatarObjectURL(avatar) {
        const cacheManager = new LocalCacheManager();
        return await cacheManager.isCachedAvatar(avatar.id, avatar.version) ?
            await fetchFromCache() : await fetchFromServer();

        async function fetchFromCache() {
            console.log('found avatar cache!');
            const zip = await cacheManager.cachedAvatarZip(avatar.id);
            return await avatarZipToObjectURL(zip);
        }

        async function fetchFromServer() {
            const headers = [{
                id:        avatar.id,
                entity:    'Avatar',
                extension: 'zip',
            }];
            const signedURLs = await LessonUtility.fetchSignedURLs(headers);
            const result = await axios.get(signedURLs[0], { responseType: 'blob' });
            const zip = result.data;
            await cacheManager.cacheAvatarZip(avatar.id, zip, avatar.version);

            return await avatarZipToObjectURL(zip);
        }

        async function avatarZipToObjectURL(zip) {
            const unzip = await JSZip.loadAsync(zip);
            const filePath = avatar.id + '.vrm'
            const blob = await unzip.file(filePath).async('blob');
            return window.URL.createObjectURL(blob);
        }
    }

    static async fetchSignedURLs(objects) {
        const header = LessonUtility.customGetHeader(objects);
        const zipParams = { headers: header };
        const zipResult = await axios.get(Const.SIGNED_URL_API_URL, zipParams);
        return zipResult.data.signed_urls;
    }
}