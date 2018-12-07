import * as THREE from 'three'
import { stringToUpperCamel } from '../../../../shared/utils/utility'

export function loadDefaultAnimation(avatar) {
    avatar.setDefaultAnimation()
}

export function loadAnimation(avatar, poseKey, faceKey) {
    avatar.poseKey = poseKey
    avatar.faceKey = faceKey
    setRecordedPoseAnimation(avatar)
    setRecordedFacialAnimation(avatar)
    setInitialAnimationFrame(avatar)
    avatar.initAnimationPlaying()
}

export function resetAnimation(avatar) {
    avatar.animationMixer._actions.forEach(action => {
        action.reset()
    })

    setInitialAnimationFrame(avatar)
}

export function shouldShowContentsDuringSeeking(timelines, currentTime) {
    const texts = []
    let action, graphics
    timelines.some(t => {
        if (t.timeSec > currentTime) return true

        if (t.action.action != '') action = t.action

        if (t.text.durationSec > 0) {
            const remainingDurationSec =
                t.timeSec + t.text.durationSec - currentTime
            if (remainingDurationSec > 0) {
                const text = { ...t.text }
                text.durationSec = remainingDurationSec
                texts.push(text)
            }
        }

        if (t.graphics != null) graphics = t.graphics
    })

    return { action, texts, graphics }
}

export function shouldPlayVoiceAfterSeeking(timelines, currentTime) {
    let voice, voiceStartTime
    timelines.some(t => {
        if (t.timeSec > currentTime) return true
        if (t.voice.id != '' && t.timeSec + t.voice.durationSec > currentTime) {
            voiceStartTime = currentTime - t.timeSec
            voice = { ...t.voice }
            voice.durationSec = t.timeSec + t.voice.durationSec - currentTime
        }
    })

    return { voice, voiceStartTime }
}

function setRecordedPoseAnimation(avatar) {
    Object.keys(avatar.poseKey).forEach(clipName => {
        if (avatar.poseKey[clipName].length === 0) return

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
        if (facialWeight.values.length === 0) return

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
