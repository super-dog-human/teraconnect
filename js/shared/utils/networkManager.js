import axios from 'axios'
import JSZip from 'jszip'
import * as Const from './constants'
import LocalCacheManager from './localCacheManager'

const faceDetectorFileID = 'BRFv4_JS_TK101018_v4.1.0_trial.wasm'
const faceDetectorFileVersion = 'af9c3fa5d65266b838b0eb95ba3b9b57' // MD5 hash of file

export async function fetchLesson(lessonID) {
    const url = Const.LESSON_API_URL.replace('{lessonID}', lessonID)
    const result = await axios.get(url)

    return result.data
}

export async function postLesson(body) {
    const url = Const.LESSON_API_URL.replace('{lessonID}', '') // API URL has no id when creating new.
    const result = await axios.post(url, body)
    return result.data
}

export async function fetchGraphics() {
    const result = await axios.get(Const.GRAPHIC_API_URL)
    return result.data
}

export async function fetchAvatars() {
    const result = await axios.get(Const.AVATAR_API_URL)
    return result.data
}

export async function fetchRawLessonMaterial(lessonID) {
    const materialURL = Const.LESSON_MATERIAL_API_URL.replace(
        '{lessonID}',
        lessonID
    )
    const result = await axios.get(materialURL)
    return result.data
}

export async function fetchVoiceTexts(lessonID) {
    const url = Const.LESSON_VOICE_TEXT_API_URL.replace('{lessonID}', lessonID)
    const result = await axios.get(url).catch(err => {
        if (err.response.status == 404) {
            return { data: [] }
        } else {
            throw new Error(err)
        }
    })

    return result.data
}

export async function fetchLessonZipBlob(lesson) {
    const cacheManager = new LocalCacheManager()
    return (await cacheManager.isFileCached(
        'lesson',
        lesson.id,
        lesson.version
    ))
        ? await fetchFromCache()
        : await fetchFromServer()

    async function fetchFromCache() {
        console.log('found lesson cache!')
        return await cacheManager.fetchCacheFile('lesson', lesson.id)
    }

    async function fetchFromServer() {
        const headers = [
            {
                id: lesson.id,
                entity: 'Lesson',
                extension: 'zip'
            }
        ]
        const signedURLs = await fetchSignedURLs(headers)
        const result = await axios.get(signedURLs, { responseType: 'blob' })

        const zip = result.data
        await cacheManager.storeFile('lesson', lesson.id, zip, lesson.version)

        return zip
    }
}

export async function fetchAvatarObjectURL(avatar) {
    const cacheManager = new LocalCacheManager()
    return (await cacheManager.isFileCached(
        'avatar',
        avatar.id,
        avatar.version
    ))
        ? await fetchFromCache()
        : await fetchFromServer()

    async function fetchFromCache() {
        console.log('found avatar cache!')
        const zip = await cacheManager.fetchCacheFile('avatar', avatar.id)
        return await avatarZipToObjectURL(zip)
    }

    async function fetchFromServer() {
        const headers = [
            {
                id: avatar.id,
                entity: 'Avatar',
                extension: 'zip'
            }
        ]
        const signedURLs = await fetchSignedURLs(headers)
        const result = await axios.get(signedURLs[0], {
            responseType: 'blob'
        })
        const zip = result.data
        await cacheManager.storeFile('avatar', avatar.id, zip, avatar.version)

        return await avatarZipToObjectURL(zip)
    }

    async function avatarZipToObjectURL(zip) {
        const unzip = await JSZip.loadAsync(zip)
        const filePath = avatar.id + '.vrm'
        const blob = await unzip.file(filePath).async('blob')
        return URL.createObjectURL(blob)
    }
}

export async function fetchFaceDetectorObjectURL() {
    const cacheManager = new LocalCacheManager()
    const isCached = await cacheManager.isFileCached(
        'faceDetector',
        faceDetectorFileID,
        faceDetectorFileVersion
    )

    const blob = isCached ? await fetchFromCache() : await fetchFromServer()
    return URL.createObjectURL(blob)

    async function fetchFromCache() {
        console.log('found face detector cache!')
        const blob = await cacheManager.fetchCacheFile(
            'faceDetector',
            faceDetectorFileID
        )
        return blob
    }

    async function fetchFromServer() {
        const result = await axios.get(`/${faceDetectorFileID}`, {
            responseType: 'blob'
        })
        const blob = result.data
        await cacheManager.storeFile(
            'faceDetector',
            faceDetectorFileID,
            blob,
            faceDetectorFileVersion
        )
        return blob
    }
}

export async function fetchSignedURLs(objects) {
    const header = customGetHeader(objects)
    const params = { headers: header }
    const result = await axios.get(Const.STORAGE_OBJECT_API_URL, params)

    return result.data.signedURLs.map(obj => {
        return obj.signedURL
    })

    function customGetHeader(objects) {
        return { 'X-Get-Params': JSON.stringify(objects) }
    }
}

export async function createStorageObjects(files) {
    const request = { fileRequests: files }
    const result = await axios.post(Const.STORAGE_OBJECT_API_URL, request)
    return result.data
}

export async function uploadGraphics(files) {
    const creationFiles = files.map(file => {
        const extention = file.type.substr(6)

        return {
            entity: 'graphic',
            extension: extention,
            contentType: file.type
        }
    })

    const result = await createStorageObjects(creationFiles)
    const uploadedGraphics = []

    for (const [i, storage] of result.signedURLs.entries()) {
        const objectURL = files[i].preview
        const graphicFile = await axios.get(objectURL, {
            responseType: 'blob'
        })

        const instance = axios.create({
            transformRequest: [
                (data, header) => {
                    header.put['Content-Type'] = creationFiles[i].contentType
                    return data
                }
            ]
        })
        await instance.put(storage.signedURL, graphicFile.data)

        uploadedGraphics.push({
            id: storage.fileID,
            thumbnailURL: objectURL
        })
    }

    return uploadedGraphics
}

export async function uploadAvatar(avatarURL) {
    const fileType = 'application/zip'
    const file = {
        entity: 'avatar',
        extension: 'zip',
        contentType: fileType
    }
    const result = await createStorageObjects([file])
    const avatar = result.signedURLs[0]

    const fileName = avatar.fileID + '.vrm'
    const avatarFile = await axios.get(avatarURL, { responseType: 'blob' })
    const zipBlob = await blobToZip(fileName, avatarFile.data)

    const instance = axios.create({
        transformRequest: [
            (data, header) => {
                header.put['Content-Type'] = fileType
                return data
            }
        ]
    })
    await instance.put(avatar.signedURL, zipBlob)

    URL.revokeObjectURL(avatarURL)

    return avatar.fileID

    async function blobToZip(fileName, blob) {
        const zip = new JSZip()
        zip.file(fileName, blob)
        return await zip.generateAsync({
            type: 'blob',
            compression: 'DEFLATE'
        })
    }
}

export async function updateLesson(lessonID, body) {
    const url = Const.LESSON_API_URL.replace('{lessonID}', lessonID)
    await axios.patch(url, body)
}

export async function uploadMaterial(lessonID, body) {
    const url = Const.LESSON_MATERIAL_API_URL.replace('{lessonID}', lessonID)
    await axios.put(url, body)
}

export async function packMaterial(lessonID) {
    const url = Const.LESSON_PACK_API_URL.replace('{lessonID}', lessonID)
    const body = { dummy: 'dummyBody' }
    await axios.put(url, body)
}

export async function deleteLesson(lessonID) {
    const url = Const.LESSON_API_URL.replace('{lessonID}', lessonID)
    const body = { dummy: 'dummyBody' }
    const result = await axios.delete(url, body)
    return result.data
}
