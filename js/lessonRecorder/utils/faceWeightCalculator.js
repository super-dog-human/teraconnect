let eyebrowDistanceHistories = []
let standardEyebrowDistance = 0.25
let baseFaceName = 'Default'
let oldFacePoints = []

export function faceWeight(face, faceName) {
    baseFaceName = faceName
    const scale = face.scale
    const points = face.points

    return Object.assign(
        baseFaceWeight(),
        eyebrowWeight(scale, points),
        mouthWeight(scale, points)
    )
}

export function isBlink(points) {
    if (baseFaceName === 'AllJoy') return false

    if (oldFacePoints.length === 0) {
        oldFacePoints = JSON.parse(JSON.stringify(points))
    }

    let k, l, yLE, yRE, yN

    for (k = 36, l = 41, yLE = 0; k <= l; k++) {
        yLE += points[k].y - oldFacePoints[k].y
        oldFacePoints[k].y = points[k].y
    }
    yLE /= 6

    for (k = 42, l = 47, yRE = 0; k <= l; k++) {
        yRE += points[k].y - oldFacePoints[k].y
        oldFacePoints[k].y = points[k].y
    }
    yRE /= 6

    for (k = 27, l = 30, yN = 0; k <= l; k++) {
        yN += points[k].y - oldFacePoints[k].y
        oldFacePoints[k].y = points[k].y
    }
    yN /= 4

    const blinkRatio = Math.abs((yLE + yRE) / yN)
    if (blinkRatio > 12 && (yLE > 0.4 || yRE > 0.4)) {
        return true
    } else {
        return false
    }
}

function baseFaceWeight() {
    const weight = {
        brwAngry: baseFaceName === 'AllAngry' ? 1 : 0,
        brwFun: baseFaceName === 'AllFun' ? 1 : 0,
        brwJoy: baseFaceName === 'AllJoy' ? 1 : 0,
        brwSorrow: baseFaceName === 'AllSorrow' ? 1 : 0,
        eyeAngry: baseFaceName === 'AllAngry' ? 1 : 0,
        eyeJoy: baseFaceName === 'AllJoy' ? 1 : 0,
        eyeSorrow: baseFaceName === 'AllSorrow' ? 1 : 0,
        eyeSurprised: baseFaceName === 'AllSurprised' ? 1 : 0
    }

    return weight
}

function eyebrowWeight(scale, points) {
    const weight = {
        brwSurprised: 0
    }

    if (baseFaceName === 'AllSurprised') {
        weight.brwSurprised = 1
        return weight
    }

    /*
    const distance = eyebrowDistance(scale, points)
    if (eyebrowDistanceHistories.length <= 100) {
        eyebrowDistanceHistories.push(distance)
    }

    let eyebrowDiff = distance - standardEyebrowDistance

    if (eyebrowDiff > 0.05) eyebrowDiff = 0.05
    if (eyebrowDiff > 0.01) {
        weight.brwSurprised = eyebrowDiff * 20
    }

    if (eyebrowDistanceHistories.length < 100) {
        eyebrowDistanceHistories.sort()
        const arrayLength = eyebrowDistanceHistories.length
        if (arrayLength % 2 === 0) {
            standardEyebrowDistance = arrayAverage([
                eyebrowDistanceHistories[arrayLength / 2 - 1],
                eyebrowDistanceHistories[arrayLength / 2]
            ])
        } else {
            standardEyebrowDistance =
                eyebrowDistanceHistories[Math.floor(arrayLength / 2)]
        }
    }
*/
    return weight
}

function mouthWeight(scale, points) {
    const weight = {
        mouthAngry:
            baseFaceName === 'AllAngry' || baseFaceName === 'AllSorrow'
                ? 0.5
                : 0,
        mouthCorner: 0,
        mouthFun: baseFaceName === 'AllJoy' ? 0.4 : 0,
        mouthJoy: 0,
        mouthSorrow: 0,
        mouthSurprised: 0,
        mouthA: 0,
        mouthI: 0,
        mouthU: 0,
        mouthE: 0,
        mouthO: 0
    }

    const lipHeight = lipOpenHeight(scale, points)
    if (lipHeight < 0.03) {
        return weight
    }

    const width = mouthWidth(scale, points)
    const height = mouthHeight(scale, points)

    let mouthEyeDiff = width - eyeDistance(scale, points)
    if (mouthEyeDiff > 0 && lipHeight < 0.1) {
        // vowel I
        if (mouthEyeDiff > 0.1) mouthEyeDiff = 0.1
        weight.mouthI = mouthEyeDiff * 10
    } else if (height / width > 0.9 && width < 0.35) {
        // vowel O
        weight.mouthU = 0.8
        weight.mouthO = 0.5
    } else {
        // vowel A
        let mouthFactor = height / 0.7
        if (mouthFactor > 0.4) {
            let mouthSurprisedWeight = mouthFactor - 0.4
            if (mouthSurprisedWeight > 0.4) mouthSurprisedWeight = 0.4
            weight.mouthSurprised = mouthSurprisedWeight
        }
        if (mouthFactor > 1) mouthFactor = 1
        weight.mouthA = mouthFactor
    }

    return weight
}

function mouthHeight(scale, points) {
    return (
        arrayAverage([
            distanceTwoPoint(points, 50, 58),
            distanceTwoPoint(points, 51, 57),
            distanceTwoPoint(points, 52, 56)
        ]) / scale
    )
}

function mouthWidth(scale, points) {
    return distanceTwoPoint(points, 48, 54) / scale
}

function eyeDistance(scale, points) {
    return distanceTwoPoint(points, 40, 47) / scale
}

function lipOpenHeight(scale, points) {
    return (
        arrayAverage([
            distanceTwoPoint(points, 61, 67),
            distanceTwoPoint(points, 62, 66),
            distanceTwoPoint(points, 63, 65)
        ]) / scale
    )
}

function eyebrowDistance(scale, points) {
    return (
        arrayAverage([
            distanceTwoPoint(points, 18, 36),
            distanceTwoPoint(points, 19, 41),
            distanceTwoPoint(points, 20, 42),
            distanceTwoPoint(points, 21, 39),
            distanceTwoPoint(points, 22, 42),
            distanceTwoPoint(points, 23, 47),
            distanceTwoPoint(points, 24, 46),
            distanceTwoPoint(points, 25, 45)
        ]) / scale
    )
}

function distanceTwoPoint(points, landmarkIndexA, landmarkIndexB) {
    const xDistance = points[landmarkIndexB].x - points[landmarkIndexA].x
    const yDistance = points[landmarkIndexB].y - points[landmarkIndexA].y
    return Math.hypot(xDistance, yDistance)
}

function arrayAverage(arr) {
    return arraySum(arr) / arr.length
}

function arraySum(arr) {
    return arr.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
    )
}
