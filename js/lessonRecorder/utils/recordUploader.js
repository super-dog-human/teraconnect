import axios from 'axios'
import { arrayToUniq } from '../../shared/utils/utility'
import * as Const from '../../shared/utils/constants'

const leftShoulderInitRotation = [0, 0, 0.573576436351046, 0.8191520442889918]
const rightShoulderInitRotation = [0, 0, -0.573576436351046, 0.8191520442889918]
const coreBodyInitPosition = [0, 0, 85]

export async function uploadRecord(lessonID, record) {
    await uploadLessonGraphicIDs(lessonID, record)
    await uploadLessonMaterial(lessonID, record)
}

async function uploadLessonGraphicIDs(lessonID, record) {
    const nestedGraphicIDs = record.timelines
        .filter(t => {
            return t.graphics
        })
        .map(t => {
            return t.graphics.map(g => {
                return g.id
            })
        })

    if (nestedGraphicIDs.length === 0) return true

    const graphicIDs = arrayToUniq(nestedGraphicIDs.flat())
    const body = { graphicIDs: graphicIDs }
    const url = Const.LESSON_API_URL.replace('{lessonID}', lessonID)
    await axios.patch(url, body)
}

async function uploadLessonMaterial(lessonID, record) {
    addPosesIfNeeded(record.currentTime, record.poseKey)
    addFacesIfNeeded(record.currentTime, record.faceKey)

    const materialBody = {
        durationSec: record.currentTime,
        timelines: record.timelines,
        poseKey: record.poseKey,
        faceKey: record.faceKey
    }

    const materialURL = Const.LESSON_MATERIAL_API_URL.replace(
        '{lessonID}',
        lessonID
    )
    await axios.post(materialURL, materialBody)
}

function addPosesIfNeeded(time, poseKey) {
    Object.keys(poseKey).forEach(key => {
        if (poseKey[key].length > 0) {
            const lastPose = Object.assign(
                {},
                poseKey[key][poseKey[key].length - 1]
            )
            lastPose.time = time
            poseKey[key].push(lastPose)
        } else {
            if (key === 'leftShoulders') {
                poseKey.leftShoulders.push({
                    rot: leftShoulderInitRotation,
                    time: 0
                })
                return
            }

            if (key === 'rightShoulders') {
                poseKey.rightShoulders.push({
                    rot: rightShoulderInitRotation,
                    time: 0
                })
                return
            }

            if (key === 'coreBodies.length') {
                poseKey.coreBodies.push({
                    pos: coreBodyInitPosition,
                    time: 0
                })
                return
            }
        }
    })
}

function addFacesIfNeeded(time, faceKey) {
    Object.keys(faceKey).forEach(key => {
        if (faceKey[key].values.length === 0) return

        const lastIndex = faceKey[key].values.length - 1
        if (faceKey[key].times[lastIndex] === time) {
            return
        }

        const lastValue = faceKey[key].values[lastIndex]
        const preLastValue = faceKey[key].values[lastIndex - 1]

        if (lastValue === preLastValue) {
            faceKey[key].times[lastIndex] = time
        } else {
            faceKey[key].values.push(lastValue)
            faceKey[key].times.push(time)
        }
    })
}
