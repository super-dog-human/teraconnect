import { stringToUpperCamel } from '../../shared/utils/utility'

export function moveAvatarTo(avatar, direction) {
    if (direction === 'stop') {
        avatar.moveDirection = null
        return
    }

    avatar.moveDirection = direction
}

export function moveAvatarBones(avatar, pose) {
    Object.keys(pose).forEach(part => {
        if (part === 'neck') {
            avatar.bones.J_Bip_C_Neck.rotation.set(...pose[part])
        }
    })

    if (!('leftArm' in pose)) {
        avatar.setDefaultPose('leftArm')
    }

    if (!('rightArm' in pose)) {
        avatar.setDefaultPose('rightArm')
    }
}

export function moveAvatarPosition(avatar, deltaTime) {
    if (!avatar.moveDirection) return

    const position = avatar.bones.Position.position

    if (avatar.moveDirection === 'left' || avatar.moveDirection === 'right') {
        let newX = avatar.moveDirection === 'left' ? -deltaTime : deltaTime
        newX += position.x
        if (newX >= -2.7 && newX <= 2.7) {
            position.x = newX
        } else {
            avatar.moveDirection = null
            return
        }
    }

    if (avatar.moveDirection === 'front' || avatar.moveDirection === 'back') {
        let newZ = avatar.moveDirection === 'front' ? deltaTime : -deltaTime
        newZ *= 100
        newZ += position.z
        if (newZ >= 0 && newZ <= 140) {
            position.z = newZ
        } else {
            avatar.moveDirection = null
            return
        }
    }
}

export function moveFacialExpression(avatar, faceWeight) {
    Object.keys(faceWeight).forEach(key => {
        const weightName = stringToUpperCamel(key)
        const facePartIndex = avatar.faceIndexOf(weightName)
        avatar.faceSkin.morphTargetInfluences[facePartIndex] = faceWeight[key]
    })
}

export function moveEyesBlink(avatar, isBlink) {
    const eyeCloseIndex = avatar.faceIndexOf('EyeClose')
    avatar.faceSkin.morphTargetInfluences[eyeCloseIndex] = isBlink ? 1 : 0
}
