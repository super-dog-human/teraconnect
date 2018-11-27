import * as THREE from 'three'
import '../../shared/utils/GLTFLoader'

export default class AvatarRightsChecker {
    constructor() {
        this.avatar = {}
        this.meta = {}
    }

    async loadAvatar(url) {
        const avatar = await new Promise(resolve => {
            new THREE.GLTFLoader().load(url, vrm => {
                resolve(vrm)
            })
        })

        this.avatar = avatar
        this.meta = this.avatar.userData.gltfExtensions.VRM.meta
    }

    canDistribute() {
        return this.meta.licenseName != 'Redistribution_Prohibited'
    }

    canCommercialUsage() {
        if (this.meta.commercialUssageName != 'Allow') return false
        /* not checking commercial usage in CC
        if (this.meta.licenseName === 'CC_BY_NC') return false
        if (this.meta.licenseName === 'CC_BY_NC_SA') return false
        if (this.meta.licenseName === 'CC_BY_NC_ND') return false
        */
        return true
    }

    canEveryonePerform() {
        return this.meta.allowedUserName === 'Everyone'
    }

    shouldConfirm() {
        if (this.meta.licenseName === 'CC0') return false

        return true
    }

    /*
    thumbnailObjectURL() {
    }
    */
}
