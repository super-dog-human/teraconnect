import * as THREE from 'three'
import { stringToUpperCamel } from '../../common/utility'

export function loadDefaultAnimation(avatar) {
    avatar.setDefaultAnimation()
}

export function loadAnimation(avatar, poseKey, faceKey) {
    avatar.poseKey = poseKey
    avatar.faceKey = faceKey
    setRecordedPoseAnimation(avatar)
    setRecordedFacialAnimation(avatar)
    setInitialAnimationFrame(avatar)
}

export function resetAnimation(avatar) {
    avatar.animationMixer._actions.forEach(action => {
        action.reset()
    })

    setInitialAnimationFrame(avatar)
}

function setRecordedPoseAnimation(avatar) {
    Object.keys(avatar.poseKey).forEach(clipName => {
        if (avatar.poseKey[clipName].length == 0) return

        let bone

        switch (clipName) {
        case 'leftHands':
            bone = avatar.bones.J_Bip_L_Hand
            break
        case 'rightHands':
            bone = avatar.bones.J_Bip_R_Hand
            break
        case 'leftShoulders':
            bone = avatar.bones.J_Bip_L_UpperArm
            break
        case 'rightShoulders':
            bone = avatar.bones.J_Bip_R_UpperArm
            break
        case 'leftElbows':
            bone = avatar.bones.J_Bip_L_LowerArm
            break
        case 'rightElbows':
            bone = avatar.bones.J_Bip_R_LowerArm
            break
        case 'necks':
            bone = avatar.bones.J_Bip_C_Neck
            break
        case 'coreBodies':
            bone = avatar.bones.Position
            break
        }

        const poseKeys = [{ keys: avatar.poseKey[clipName] }]
        const poseClip = THREE.AnimationClip.parseAnimation(
            {
                name: clipName,
                hierarchy: poseKeys
            },
            [bone]
        )

        const action = avatar.animationMixer.clipAction(poseClip)
        action.setLoop(THREE.LoopOnce)
    })
}

function setRecordedFacialAnimation(avatar) {
    const tracks = []
    Object.keys(avatar.faceKey).forEach(clipName => {
        const facialWeight = avatar.faceKey[clipName]
        if (facialWeight.values.length == 0) return

        const targetIndex = avatar.faceIndexOf(stringToUpperCamel(clipName))
        tracks.push({
            name: `.morphTargetInfluences[morphTarget${targetIndex}]`,
            type: 'number',
            times: facialWeight.times,
            values: facialWeight.values
        })
    })

    const clip = THREE.AnimationClip.parse({
        name: 'facialExpression',
        tracks: tracks
    })

    const action = avatar.animationMixer.clipAction(clip)
    action.setLoop(THREE.LoopOnce)
}

function setInitialAnimationFrame(avatar) {
    Object.keys(avatar.poseKey).forEach(key => {
        const initialAnimationFrame = avatar.poseKey[key][0]
        if (!initialAnimationFrame) return

        let bone

        switch (key) {
        case 'leftHands':
            bone = avatar.bones.J_Bip_L_Hand
            break
        case 'rightHands':
            bone = avatar.bones.J_Bip_R_Hand
            break
        case 'leftShoulders':
            bone = avatar.bones.J_Bip_L_UpperArm
            break
        case 'rightShoulders':
            bone = avatar.bones.J_Bip_R_UpperArm
            break
        case 'leftElbows':
            bone = avatar.bones.J_Bip_L_LowerArm
            break
        case 'rightElbows':
            bone = avatar.bones.J_Bip_R_LowerArm
            break
        case 'necks':
            bone = avatar.bones.J_Bip_C_Neck
            break
        case 'coreBodies':
            bone = avatar.bones.Position
            break
        }

        if (initialAnimationFrame.rot) {
            const rotation = new THREE.Euler(...initialAnimationFrame.rot)
            bone.setRotationFromEuler(rotation)
        }

        if (initialAnimationFrame.pos) {
            bone.position.set(...initialAnimationFrame.pos)
        }
    })
}
