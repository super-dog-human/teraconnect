const videoWidth = 640
const videoHeight = 480
const frameRate = 30

export default class FaceDetector {
    constructor() {
        this._worker = new Worker('faceDetectionWorker.js')
        this._detectorURL = ''
        this._stream
        this._video
        this._imageCtx
        this._isDetecting
    }

    setup = async (url, callback, userVideo, userVideoPreview) => {
        this._detectorURL = url

        this._worker.onmessage = event => {
            const status = event.data.status
            if (status === 'completedLoading') {
                callback.loadedCallback()
            } else if (status === 'detectedFace') {
                this._isDetecting = false
                const result = event.data
                callback.detectedCallback(
                    result.faceWeight,
                    result.neckPoses,
                    result.isBlink
                )
            } else if (status === 'lostFace') {
                this._isDetecting = false
                callback.lostTrackingCallback()
            }
        }

        this._video = userVideo

        await this._setupCamera(userVideoPreview)
    }

    _setupCamera = async canvas => {
        this._stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                facingMode: 'user',
                width: { exact: videoWidth },
                height: { exact: videoHeight },
                frameRate: { max: frameRate }
            }
        })

        this._video.srcObject = this._stream
        this._video.onloadedmetadata = () => {
            this._video.play()
            canvas.width = videoWidth
            canvas.height = videoHeight
            this._imageCtx = canvas.getContext('2d')

            this._worker.postMessage({
                order: 'init',
                detectorURL: this._detectorURL,
                videoSize: { width: videoWidth, height: videoHeight }
            })
        }
    }

    detectFaceLandmarksInRealTime = () => {
        if (this._isDetecting) return
        this._isDetecting = true

        this._imageCtx.drawImage(this._video, 0, 0, videoWidth, videoHeight)

        this._worker.postMessage(
            {
                order: 'detect',
                image: this._imageCtx.getImageData(
                    0,
                    0,
                    videoWidth,
                    videoHeight
                ).data.buffer
            },
            [
                this._imageCtx.getImageData(0, 0, videoWidth, videoHeight).data
                    .buffer
            ]
        )
    }

    setBaseFace(faceName) {
        this._worker.postMessage({
            order: 'setBaseFase',
            baseFaceName: faceName
        })
    }

    stop = () => {
        this._worker.terminate()
        this._stream.getVideoTracks().forEach(track => {
            track.stop()
        })
        URL.revokeObjectURL(this._detectorURL)
    }
}
