import { initializeBRF } from './BRFv4_JS_TK101018_v4.1.0_trial'
import { faceWeight, isBlink } from './faceWeightCalculator'

const brfv4 = {
    locateFile: fileName => {
        return '/' + fileName
    }
}
let brfManager
let isSDKLoading = false
let baseFaceName = 'Default'

onmessage = function(event) {
    const order = event.data.order
    if (order === 'init') {
        loadingSDK(event.data.videoSize)
    } else if (order === 'detect') {
        detectFaceLandmarks(event.data.image)
    } else if (order === 'setBaseFase') {
        baseFaceName = event.data.baseFaceName
    }
}

function loadingSDK(videoSize) {
    if (!isSDKLoading) {
        initializeBRF(brfv4)
        isSDKLoading = true
    }

    if (brfv4.sdkReady) {
        const resolution = new brfv4.Rectangle(
            0,
            0,
            videoSize.width,
            videoSize.height
        )

        brfManager = new brfv4.BRFManager()
        brfManager.init(
            resolution,
            resolution,
            'com.tastenkunst.brfv4.js.examples.minimal.webcam'
        )
        brfManager.setMode(brfv4.BRFMode.FACE_TRACKING)
        brfManager.setNumFacesToTrack(1)

        self.postMessage({ status: 'completedLoading' })
    } else {
        setTimeout(loadingSDK, 250, videoSize)
    }
}

function detectFaceLandmarks(imageBitmap) {
    brfManager.update(new Uint8ClampedArray(imageBitmap))
    const face = brfManager.getFaces()[0]

    if (
        face.state === brfv4.BRFState.FACE_TRACKING_START ||
        face.state === brfv4.BRFState.FACE_TRACKING
    ) {
        const neckPoses = [-face.rotationX, face.rotationY, -face.rotationZ]
        self.postMessage({
            status: 'detectedFace',
            faceWeight: faceWeight(face, baseFaceName),
            neckPoses: neckPoses,
            isBlink: isBlink(face.points)
        })
    } else {
        self.postMessage({
            status: 'lostFace'
        })
    }
}
