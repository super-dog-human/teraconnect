import localforage from 'localforage'

export default class LocalCacheManager {
    constructor() {
        localforage.config({
            driver: [
                localforage.INDEXEDDB,
                localforage.WEBSQL,
                localforage.LOCALSTORAGE
            ],
            name: 'teraconnectCache',
            storeName: 'teraconnectCacheStore', // Should be alphanumeric, with underscores.
            description: 'caches for avatar and lesson zip files.'
        })

        this.localforage = localforage

        this.avatarVersion = 'avatarVersion'
        this.lessonVersion = 'lessonVersion'
        this.avatarZipPrefix = 'avatarZip-'
        this.lessonZipPrefix = 'lessonZip-'
    }

    async isCachedAvatar(avatarID, version) {
        const avatarVersion = await this.localforage.getItem(this.avatarVersion)
        if (!avatarVersion) return false
        if (!avatarVersion[avatarID]) return false

        if (avatarVersion[avatarID].version == version) {
            return true
        }

        const cacheKey = this.avatarZipPrefix + avatarID
        this.localforage.removeItem(cacheKey)

        return false
    }

    async isCachedLesson(lessonID, version) {
        const lessonVersion = await this.localforage.getItem(this.lessonVersion)
        if (!lessonVersion) return false
        if (!lessonVersion[lessonID]) return false

        if (lessonVersion[lessonID].version == version) {
            return true
        }

        const cacheKey = this.lessonZipPrefix + lessonID
        this.localforage.removeItem(cacheKey)

        return false
    }

    async cacheAvatarZip(avatarID, blob, version) {
        const cacheZipKey = this.avatarZipPrefix + avatarID
        await this.localforage.setItem(cacheZipKey, blob)

        let avatarVersion = await this.localforage.getItem(this.avatarVersion)
        if (!avatarVersion) avatarVersion = {}
        avatarVersion[avatarID] = { version: version }

        await this.localforage.setItem(this.avatarVersion, avatarVersion)
    }

    async cacheLessonZip(lessonID, blob, version) {
        const cacheZipKey = this.lessonZipPrefix + lessonID
        await this.localforage.setItem(cacheZipKey, blob)

        let lessonVersion = await this.localforage.getItem(this.lessonVersion)
        if (!lessonVersion) lessonVersion = {}
        lessonVersion[lessonID] = { version: version }

        await this.localforage.setItem(this.lessonVersion, lessonVersion)
    }

    async cachedAvatarZip(avatarID) {
        const cacheKey = this.avatarZipPrefix + avatarID
        return await this.localforage.getItem(cacheKey)
    }

    async cachedLessonZip(lessonID) {
        const cacheKey = this.lessonZipPrefix + lessonID
        return await this.localforage.getItem(cacheKey)
    }
}
