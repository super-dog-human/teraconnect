import * as THREE from 'three'
import { GLTFLoader } from './GLTFLoader'
import { VRM } from '@pixiv/three-vrm'
import * as Const from '../constants'

export default class AvatarLoader {
  constructor() {
    this.poseKey = {}
    this.faceKey = {}
    this.vrm
    this.camera
    this.scene = new THREE.Scene()
    this.renderer
    this.bodySkin
    this.moveDirection
    this.animationMixer
    this.light
  }

  async render(avatarURL, container) {
    const domSize = this._domSize(container)

    this._setupCamera(domSize)
    await this._setupAvatar(avatarURL)

    return this._createDom(domSize)
  }

  setLightColor(color, intensity) {
    if (this.light) {
      this.light.color.setHex(color)
      this.light.intensity = intensity
    } else {
      this.light = new THREE.DirectionalLight(color, intensity)
      this.scene.add(this.light)
    }
  }

  _setupCamera(domSize) {
    this.camera = new THREE.PerspectiveCamera(
      1,
      domSize.width / domSize.height,
      150.0,
      160.0
    )
    //    this.camera.position.set(-0.6, 1.05, 155.0)
    this.camera.position.set(0, 0.8, 155.0)
  }

  async _setupAvatar(avatarURL) {
    const vrm = await new Promise(resolve => {
      const loader = new GLTFLoader()
      loader.load(avatarURL, gltf => {
        VRM.from(gltf).then(vrm => {
          resolve(vrm)
        })
      })
    })

    this.vrm = vrm
    this.scene.add(this.vrm.scene)
    this.setDefaultPose()
    this._getBone('hips').rotation.y = -2.7
  }

  setDefaultPose(part = 'all') {
    this._getBone('hips').rotation.y = -Math.PI

    if (part === 'leftArm' || part === 'all') {
      this._getBone('leftUpperArm').rotation.z = Const.RAD_70
      this._getBone('leftLowerArm').rotation.set(0, 0, 0)
      this._getBone('leftHand').rotation.set(0, 0, 0)
    }

    if (part === 'rightArm' || part === 'all') {
      this._getBone('rightUpperArm').rotation.z = -Const.RAD_70
      this._getBone('rightLowerArm').rotation.set(0, 0, 0)
      this._getBone('rightHand').rotation.set(0, 0, 0)
    }

    if (part === 'all') {
      this._getBone('neck').rotation.set(0, 0, 0)
    }
  }

  setForLandscape() {
    this._getBone('hips').rotation.y = Math.PI / 2
    this._getBone('hips').rotation.y = -2.5
    this._getBone('neck').rotation.x = 0.4
    this._getBone('spine').rotation.x = 0.2

    // load default.json
    ;['left', 'right'].forEach(side => {
      ['ThumbDistal', 'ThumbIntermediate', 'ThumbProximal'].forEach(
        boneName => {
          this._getBone(side + boneName).setRotationFromQuaternion(
            new THREE.Quaternion().set(
              0,
              (side === 'left' ? 1 : -1) * 0.17327451000744837,
              0,
              0.9848735676124518
            )
          )
        }
      )
      ;['IndexDistal', 'IndexIntermediate', 'IndexProximal'].forEach(
        boneName => {
          this._getBone(side + boneName).setRotationFromQuaternion(
            new THREE.Quaternion().set(
              0,
              0,
              (side === 'left' ? 1 : -1) * 0.2697967711570243,
              0.9629172873477994
            )
          )
        }
      )
      ;['MiddleDistal', 'MiddleIntermediate', 'MiddleProximal'].forEach(
        boneName => {
          this._getBone(side + boneName).setRotationFromQuaternion(
            new THREE.Quaternion().set(
              0,
              0,
              (side === 'left' ? 1 : -1) * 0.278007203863391,
              0.9605789892559898
            )
          )
        }
      )
      ;['RingDistal', 'RingIntermediate', 'RingProximal'].forEach(boneName => {
        this._getBone(side + boneName).setRotationFromQuaternion(
          new THREE.Quaternion().set(
            0,
            0,
            (side === 'left' ? 1 : -1) * 0.28619737572634124,
            0.9581706852786488
          )
        )
      })
      ;['LittleDistal', 'LittleIntermediate', 'LittleProximal'].forEach(
        boneName => {
          this._getBone(side + boneName).setRotationFromQuaternion(
            new THREE.Quaternion().set(
              0,
              (side === 'left' ? 1 : -1) * 0.28619737572634124,
              0.9581706852786488
            )
          )
        }
      )

      this._getBone(side + 'Hand').rotation.z = (side === 'left' ? 1 : -1) * 0.3
      this._getBone(side + 'UpperArm').rotation.x = -0.1
    })
  }

  _getBone(boneName) {
    return this.vrm.humanoid.getBoneNode(boneName)
  }

  _createDom(domSize) {
    this.renderer = new THREE.WebGLRenderer({
      alpha: true
      //      antialias: true
    })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(domSize.width, domSize.height)
    this.renderer.render(this.scene, this.camera)

    return this.renderer.domElement
  }

  setDefaultAnimation() {
    this.animationMixer = new THREE.AnimationMixer(this.vrm.scene)
    this.animationMixer.timeScale = 0
    //    this._setBreathAnimation()
    console.log(this.vrm.humanoid)
  }

  _setBreathAnimation() {
    const initQuat = new THREE.Quaternion(0.0, 0.0, 0.0, 1.0)

    const finHeadQuat = new THREE.Quaternion(0.0, 0.0, 0.0, 1.0)
    finHeadQuat.setFromEuler(new THREE.Euler(0.03 * Math.PI, 0.0, 0.0))
    const headTrack = new THREE.QuaternionKeyframeTrack(
      this._getBone('head').name + '.quaternion',
      [0.0, 3.0, 6.0],
      [...initQuat.toArray(), ...finHeadQuat.toArray(), ...initQuat.toArray()]
    )

    const finChestQuat = new THREE.Quaternion(0.0, 0.0, 0.0, 1.0)
    finChestQuat.setFromEuler(new THREE.Euler(0.01 * Math.PI, 0.0, 0.0))
    const chestTrack = new THREE.QuaternionKeyframeTrack(
      this._getBone('upperChest').name + '.quaternion',
      [0.0, 3.0, 6.0],
      [...initQuat.toArray(), ...finChestQuat.toArray(), ...initQuat.toArray()]
    )

    const clip = new THREE.AnimationClip('breath', 6.0, [headTrack, chestTrack])
    this.animationMixer.clipAction(clip)
  }

  initAnimationPlaying() {
    this.animationMixer._actions.forEach(action => {
      action.paused = false
      action.play() // animation is not start playing because already set timescale to 0.
    })
  }

  animate(deltaTime) {
    this.animationMixer.update(deltaTime)
    this.renderer.render(this.scene, this.camera)
  }

  updateSize(container) {
    if (!container) return // for resized before rendering completed.
    const size = this._domSize(container)
    this.renderer.setSize(size.width, size.height)
    this.renderer.render(this.scene, this.camera)
  }

  _domSize(container) {
    let playerWidth, playerHeight
    if (container.clientHeight / container.clientWidth > Const.RATIO_16_TO_9) {
      playerWidth = container.clientWidth
      playerHeight = Math.round(container.clientWidth * Const.RATIO_16_TO_9)
    } else {
      playerWidth = Math.round(container.clientHeight / Const.RATIO_16_TO_9)
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
    this.animationMixer.timeScale = 1
  }

  pause() {
    this.animationMixer.timeScale = 0
  }

  stop() {
    this.animationMixer._actions.forEach(action => {
      action.paused = true
    })
  }

  currentPosition() {
    /* これはなんだろう */
    //    return this.bones.Position.position
    return null
  }

  faceIndex(faceName) {
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
