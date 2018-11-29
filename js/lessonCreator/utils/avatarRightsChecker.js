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

    canUse() {
        return this.meta.licenseName != 'Redistribution_Prohibited'
    }

    shouldShowConfirmForUsing() {
        return this.confirmMessage() != ''
    }

    confirmMessage() {
        let message = ''

        if (!this.canCommercialUsage()) {
            message += '・アバターを商用利用しない\n'
        }

        if (this.canPerformOnlyAuthor()) {
            message += '・アバターの作者本人である\n'
        } else if (this.canPerformOnlyLicensee()) {
            message += '・アバターを操作する権利を有している\n'
        }

        // otherLicenseUrl
        // otherPermissionUrl

        return message
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

    canPerformOnlyAuthor() {
        return this.meta.allowedUserName === 'OnlyAuthor'
    }

    canPerformOnlyLicensee() {
        return this.meta.allowedUserName === 'ExplicitlyLicensedPerson'
    }

    shouldShowCredit() {
        return this.meta.licenseName != 'CC0'
    }

    /*
        console.log(this.meta.otherLicenseUrl === '')
        console.log(this.meta.otherPermissionUrl === '')
*/

    /*
    thumbnailObjectURL() {
    }
    */
}
