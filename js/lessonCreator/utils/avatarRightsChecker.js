import * as THREE from 'three'
import '../../shared/utils/GLTFLoader'

export default class AvatarRightsChecker {
    constructor() {
        this.avatar = {}
    }

    async loadAvatar(url) {
        const avatar = await new Promise(resolve => {
            new THREE.GLTFLoader().load(url, vrm => {
                resolve(vrm)
            })
        })

        this.avatar = avatar
    }

    isEnableAvatar() {
        const meta = this.avatar.userData.gltfExtensions.VRM.meta
        //        if (meta.commercialUssageName === 'Disallow') return false;
        if (meta.licenseName === 'CC0') return true
        //        if (meta.licenseName === 'CC_BY') return true;
        this.avatar = {}

        return false
    }
    /*
    thumbnailObjectURL() {

    }
*/
}
