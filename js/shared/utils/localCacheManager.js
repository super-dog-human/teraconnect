import localforage from 'localforage'

export default class LocalCacheManager {
    /*
    // clear old stores data.
    teraconnectCacheStore
    */
    constructor() {
        localforage.config({
            driver: [
                localforage.INDEXEDDB,
                localforage.WEBSQL,
                localforage.LOCALSTORAGE
            ],
            name: 'Teraconnect',
            storeName: 'teraconnect_cache_store',
            description: 'caches for avatar and lesson zip files.'
        })

        this.localforage = localforage

        this.avatarVersion = 'avatarVersion'
        this.lessonVersion = 'lessonVersion'
        this.faceDetectorVersion = 'faceDetectorVersion'
        this.avatarZipPrefix = 'avatarZip-'
        this.lessonZipPrefix = 'lessonZip-'
        this.faceDetectorPrefix = 'faceDetector-'
    }

    async isFileCached(fileType, id, version) {
        const cacheVersion = await this._currentCacheVersion(fileType)
        if (!cacheVersion) return false
        if (!cacheVersion[id]) return false

        if (cacheVersion[id].version === version) {
            return true
        }

        const cacheKey = this._filePrefix(fileType) + id
        this.localforage.removeItem(cacheKey)

        return false
    }

    _fileVersion(fileType) {
        if (fileType === 'avatar') {
            return this.avatarVersion
        } else if (fileType === 'lesson') {
            return this.lessonVersion
        } else if (fileType === 'faceDetector') {
            return this.faceDetectorVersion
        }
    }

    _filePrefix(fileType) {
        if (fileType === 'avatar') {
            return this.avatarZipPrefix
        } else if (fileType === 'lesson') {
            return this.lessonZipPrefix
        } else if (fileType === 'faceDetector') {
            return this.faceDetectorPrefix
        }
    }

    async _currentCacheVersion(fileType) {
        const version = this._fileVersion(fileType)
        return await this.localforage.getItem(version)
    }

    async storeFile(fileType, id, blob, version) {
        const cacheKey = this._filePrefix(fileType) + id
        await this.localforage.setItem(cacheKey, blob)

        let cacheVersion = await this._currentCacheVersion(fileType)
        if (!cacheVersion) cacheVersion = {}
        cacheVersion[id] = { version }

        await this.localforage.setItem(
            this._fileVersion(fileType),
            cacheVersion
        )
    }

    async fetchCacheFile(fileType, id) {
        const cacheKey = this._filePrefix(fileType) + id
        return await this.localforage.getItem(cacheKey)
    }
}
