import * as THREE from 'three'
import './GLTFLoader'
import * as Const from './constants'

const cameraPositions = [0, 1.4, 150]
const cameraLookAts = [0, 1.1, 0]
const lightColor = 0xbbbbff
const coreBodyInitPosition = [0, 0, 100]

export default class LessonAvatar {
    constructor() {
        this.poseKey = {}
        this.faceKey = {}
        this.bones = {}
        this.camera
        this.scene
        this.renderer
        this.faceSkin
        this.bodySkin
        this.moveDirection
        this.animationMixer
    }

    async render(avatarURL, container) {
        const domSize = this._domSize(container)

        this._setupCamera(domSize)
        this._setupScene()
        await this._setupAvatar(avatarURL)

        return this._createDom(domSize)
    }

    _setupCamera(domSize) {
        this.camera = new THREE.PerspectiveCamera(
            1,
            domSize.width / domSize.height,
            1,
            200
        )
        this.camera.position.set(...cameraPositions)
        this.camera.lookAt(new THREE.Vector3(...cameraLookAts))
    }

    _setupScene() {
        this.scene = new THREE.Scene()
        const light = new THREE.AmbientLight(lightColor)
        light.position.set(0, 1, 0)
        this.scene.add(light)
    }

    async _setupAvatar(avatarURL) {
        const vrm = await new Promise(resolve => {
            new THREE.GLTFLoader().load(avatarURL, vrm => {
                resolve(vrm)
            })
        })

        this.faceSkin = vrm.scene.children[0]
        this.bodySkin = vrm.scene.children[1]

        vrm.scene.traverse(object => {
            if (object.isBone) {
                this.bones[object.name] = object
            }
        })

        this.scene.add(vrm.scene)

        this.bones.Position.rotation.set(0, Math.PI, 0)
        this.bones.Position.position.set(...coreBodyInitPosition)

        this.setDefaultPose()
    }

    setDefaultPose(part = 'all') {
        if (part == 'leftArm' || part == 'all') {
            this.bones.J_Bip_L_UpperArm.rotation.z = Const.RAD_70
            this.bones.J_Bip_L_LowerArm.rotation.set(0, 0, 0)
            this.bones.J_Bip_L_Hand.rotation.set(0, 0, 0)
        }

        if (part == 'rightArm' || part == 'all') {
            this.bones.J_Bip_R_UpperArm.rotation.z = -Const.RAD_70
            this.bones.J_Bip_R_LowerArm.rotation.set(0, 0, 0)
            this.bones.J_Bip_R_Hand.rotation.set(0, 0, 0)
        }

        if (part == 'all') {
            this.bones.J_Bip_C_Neck.rotation.set(0, 0, 0)
        }
    }

    _createDom(domSize) {
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        })
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(domSize.width, domSize.height)
        this.renderer.gammaOutput = true
        this.renderer.render(this.scene, this.camera)

        return this.renderer.domElement
    }

    setDefaultAnimation() {
        this.animationMixer = new THREE.AnimationMixer(this.faceSkin)
        this._setBreathAnimation()
    }

    _setBreathAnimation() {
        // breathing animation
        const breathBones = [
            this.bones.J_Bip_C_Head,
            this.bones.J_Bip_C_UpperChest.children[0]
        ]

        const breathKeys = [
            {
                // head
                keys: [
                    { rot: [0, 0, 0, 1], time: 0 },
                    { rot: [-0.01, 0, 0, 1], time: 1 },
                    { rot: [0, 0, 0, 1], time: 2 },
                    { rot: [0.01, 0, 0, 1], time: 3 },
                    { rot: [0, 0, 0, 1], time: 4 },
                    { rot: [-0.01, 0, 0, 1], time: 5 },
                    { rot: [0, 0, 0, 1], time: 6 }
                ]
            },
            {
                // upper chest
                keys: [
                    { scl: [1, 1, 1], rot: [0, 0, 0, 1], time: 0 },
                    { scl: [1.02, 1, 1.02], rot: [0.05, 0, 0, 1], time: 3 },
                    { scl: [1, 1, 1], rot: [0, 0, 0, 1], time: 6 }
                ]
            }
        ]

        const breathClip = THREE.AnimationClip.parseAnimation(
            {
                name: 'breath',
                hierarchy: breathKeys
            },
            breathBones
        )

        this.animationMixer.clipAction(breathClip)
    }

    animate(deltaTime) {
        this.animationMixer.update(deltaTime)
        this.renderer.render(this.scene, this.camera)
    }

    updateSize(container) {
        if (!container) return // for resized before rendering completed.
        const size = this._domSize(container)
        this.renderer.setSize(size.width, size.height)
    }

    _domSize(container) {
        let playerWidth, playerHeight
        if (
            container.clientHeight / container.clientWidth >
            Const.RATIO_16_TO_9
        ) {
            playerWidth = container.clientWidth
            playerHeight = Math.round(
                container.clientWidth * Const.RATIO_16_TO_9
            )
        } else {
            playerWidth = Math.round(
                container.clientHeight / Const.RATIO_16_TO_9
            )
            playerHeight = container.clientHeight
        }

        return { width: playerWidth, height: playerHeight }
    }

    clearBeforeUnload() {
        if (this.scene) {
            this.scene.remove(this.scene.children)
        }
    }

    jumpAnimationAt(timeSec) {
        this.animationMixer._actions.forEach(action => {
            action.time = timeSec
        })
        this.animate(0)
    }

    play() {
        this.animationMixer._actions.forEach(action => {
            action.paused = false
            action.play()
        })
    }

    pause() {
        this.animationMixer.timeScale = 0
    }

    resume() {
        this.animationMixer.timeScale = 1
    }

    stop() {
        this.animationMixer._actions.forEach(action => {
            action.paused = true
        })
    }

    currentPosition() {
        return this.bones.Position.position
    }

    faceIndexOf(faceName) {
        return [
            'AllAngry',
            'AllFun',
            'AllJoy',
            'AllSorrow',
            'AllSurprised',
            'BrwAngry',
            'BrwFun',
            'BrwJoy',
            'BrwSorrow',
            'BrwSurprised',
            'EyeAngry',
            'EyeClose',
            'EyeCloseR',
            'EyeCloseL',
            'EyeJoy',
            'EyeJoyR',
            'EyeJoyL',
            'EyeSorrow',
            'EyeSurprised',
            'EyeExtra',
            'MouthUp',
            'MouthDown',
            'MouthAngry',
            'MouthCorner',
            'MouthFun',
            'MouthJoy',
            'MouthSorrow',
            'MouthSurprised',
            'MouthA',
            'MouthI',
            'MouthU',
            'MouthE',
            'MouthO',
            'Fung1',
            'Fung1Low',
            'Fung1Up',
            'Fung2',
            'Fung2Low',
            'Fung2Up',
            'EyeExtraOn'
        ].indexOf(faceName)
    }
}
