import * as THREE from 'three'
import { GLTFLoader } from 'ThreejsExample/jsm/loaders/GLTFLoader'
import { VRM, VRMSchema } from '@pixiv/three-vrm'
import * as Const from '../constants'

const raycaster = new THREE.Raycaster()
const mousePosition = new THREE.Vector2()
const plane = new THREE.Plane()
const planeNormal = new THREE.Vector3(0, 0, 1)
const planeIntersect = new THREE.Vector3()
const positionShift = new THREE.Vector3()

export default class AvatarLoader {
  constructor() {
    this.domSize = {}
    this.poseKey = {}
    this.faceKey = {}
    this.vrm
    this.camera
    this.scene = new THREE.Scene()
    this.renderer
    this.animationMixer
    this.animationClip = {}
    this.light
  }

  async render(avatar, container) {
    this._calcDomSize(container)

    this._setupCamera()
    await this._setupAvatar(avatar)

    this._setDefaultAnimation()
    const dom = this._createDom()

    this.setDefaultPose(avatar)

    return dom
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

  isOverAvatar(x, y) {
    return this._intersectObjects(x, y).length > 0
  }

  prepareMovePosition(x, y) {
    const intersects = this._intersectObjects(x, y)
    if (intersects.length === 0) return false

    plane.setFromNormalAndCoplanarPoint(planeNormal, intersects[0].point)
    positionShift.subVectors(this.vrm.scene.position, intersects[0].point)

    return true
  }

  movePosition(x, y) {
    this._setRaycast(x, y)

    raycaster.ray.intersectPlane(plane, planeIntersect)
    this.vrm.scene.position.addVectors(planeIntersect, positionShift)
    this._setBodyRotationByXPosition(mousePosition.x)
  }

  movePositions(positions) {
    this.vrm.scene.position.set(...positions)
    const positionX = new THREE.Vector3(...positions).clone().project(this.camera).x
    this._setBodyRotationByXPosition(positionX)
  }

  switchSpeaking(isSpeaking) {
    if (!this.animationClip.speaking) return

    if (isSpeaking) {
      this.animationClip.speaking.play()
    } else {
      this.animationClip.speaking.stop()
    }
  }

  animate(deltaTime) {
    if (!this.vrm) return

    this.vrm.update(deltaTime)
    this.animationMixer.update(deltaTime)
    this.renderer.render(this.scene, this.camera)
  }

  updateSize(container) {
    if (!container) return // アバター表示要素がまだ存在しなければスキップ
    if (!this.renderer) return // レンダラーの初期化前にリサイズが発生したらスキップ

    this._calcDomSize(container)
    this.renderer.setSize(this.domSize.width, this.domSize.height)
    this.renderer.render(this.scene, this.camera)
  }

  clearBeforeUnload() {
    if (this.scene) {
      this.scene.remove(this.scene.children)
    }
  }

  setDefaultPose(avatar) {
    this._getBone('hips').rotation.y = Math.PI // どのアバターも真後ろを向いているので反転

    this.vrm.scene.scale.set(...[...Array(3)].map(() => avatar.config.scale))
    this.vrm.scene.position.set(...avatar.config.positions)
    avatar.config.initialPoses.forEach(p => {
      this._getBone(p.boneName).rotation.set(...p.rotations)
    })
  }

  setMovingAnimation({ durationSec, startPositions, destinationPositions, animations }) {
    if (this.animationClip.moving) this.animationClip.moving.stop()

    const rotationStartSec = durationSec > 0.2 ? durationSec - 0.2 : durationSec

    this.vrm.scene.position.set(...startPositions)
    const track = new THREE.VectorKeyframeTrack('.position', [0, rotationStartSec, durationSec], [...startPositions, ...destinationPositions, ...destinationPositions])
    const movingClip = new THREE.AnimationClip('moving', durationSec, [track])
    this.animationClip.moving = this.animationMixer.clipAction(movingClip)
    this.animationClip.moving.setLoop(THREE.LoopOnce)
    this.animationClip.moving.clampWhenFinished = true
    this.animationClip.moving.play()

    if (this.animationClip.movingRotation) this.animationClip.movingRotation.stop()
    const startX2D = new THREE.Vector3(...startPositions).clone().project(this.camera).x
    const destX2D = new THREE.Vector3(...destinationPositions).clone().project(this.camera).x
    const startX = this._bodyRotationByXPosition(startX2D > destX2D ? 1 : -1)
    const destinationX = this._bodyRotationByXPosition(destX2D)
    const rotationTrack = new THREE.VectorKeyframeTrack(`${this._getBone('hips').name}.rotation[y]`, [0, rotationStartSec, durationSec], [startX, startX, destinationX])
    const rotationClip = new THREE.AnimationClip('movingRotation', durationSec, [rotationTrack])
    this.animationClip.movingRotation = this.animationMixer.clipAction(rotationClip)
    this.animationClip.movingRotation.setLoop(THREE.LoopOnce)
    this.animationClip.movingRotation.clampWhenFinished = true
    this.animationClip.movingRotation.play()

    if (this.animationClip.walking) this.animationClip.walking.stop()
    const clips = animations.map(a =>
      new THREE.VectorKeyframeTrack(`${this._getBone(a.boneName).name}.rotation[${a.axis}]`, a.keyTimes, a.rotations)
    )
    const walkingClip = new THREE.AnimationClip('walking', animations[0].durationSec, clips)
    this.animationClip.walking = this.animationMixer.clipAction(walkingClip)
    this.animationClip.walking.setLoop(THREE.LoopRepeat)
    this.animationClip.walking.play()
  }

  removeMovingAnimation() {
    if (this.animationClip.moving) this.animationClip.moving.stop()
    if (this.animationClip.movingRotation) this.animationClip.movingRotation.stop()
    if (this.animationClip.walking) this.animationClip.walking.stop()
    delete this.animationClip.moving
    delete this.animationClip.movingRotation
    delete this.animationClip.walking
  }

  play() {
    this.animationMixer.timeScale = 1
  }

  stop() {
    this.animationMixer.timeScale = 0
  }

  currentPosition() {
    return this.vrm.scene.position
  }

  _calcDomSize(container) {
    let playerWidth, playerHeight
    if (container.clientHeight / container.clientWidth > Const.RATIO_16_TO_9) {
      playerWidth = container.clientWidth
      playerHeight = Math.round(container.clientWidth * Const.RATIO_16_TO_9)
    } else {
      playerWidth = Math.round(container.clientHeight / Const.RATIO_16_TO_9)
      playerHeight = container.clientHeight
    }

    this.domSize = { width: playerWidth, height: playerHeight }
  }

  _setRaycast(x, y) {
    mousePosition.x = (x / this.domSize.width) * 2 - 1
    mousePosition.y = ((y / this.domSize.height) * 2 - 1) * -1
    raycaster.setFromCamera(mousePosition, this.camera)
  }

  _intersectObjects(x, y) {
    if (!this.vrm) return []
    this._setRaycast(x, y)
    return raycaster.intersectObjects(this.vrm.scene.children)
  }

  _setupCamera() {
    this.camera = new THREE.PerspectiveCamera(
      1,
      this.domSize.width / this.domSize.height,
      150.0,
      160.0
    )
    this.camera.position.set(0, 0, 155.0)
  }

  async _setupAvatar(avatar) {
    if (this.vrm) {
      this.scene.remove(this.vrm.scene)
      this.vrm = null
    }

    this.vrm = await new Promise(resolve => {
      const loader = new GLTFLoader()
      loader.load(avatar.url, gltf => {
        VRM.from(gltf).then(vrm => {
          resolve(vrm)
        })
      })
    })

    this.scene.add(this.vrm.scene)
  }

  _setBodyRotationByXPosition(x) {
    // xは-1〜+1の範囲をとる。完全に真横を向かないよう0.7をかけて使用する
    this._getBone('hips').rotation.y = this._bodyRotationByXPosition(x)
  }

  _bodyRotationByXPosition(x) {
    return Math.PI - x * 0.7
  }

  _getBone(boneName) {
    return this.vrm.humanoid.getBoneNode(boneName)
  }

  _createDom() {
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.domSize.width, this.domSize.height)
    this.renderer.render(this.scene, this.camera)

    // rendererの作成後でないとアバターの正しい位置が取得できないので、ここで体の向きを調整
    const currentPosition = this.vrm.scene.getWorldPosition(new THREE.Vector3()).project(this.camera)
    this._setBodyRotationByXPosition(currentPosition.x)

    return this.renderer.domElement
  }

  _setDefaultAnimation() {
    this.animationMixer = new THREE.AnimationMixer(this.vrm.scene)
    this.animationMixer.timeScale = 0
    this._setBreathAnimation()
    this._setSpeakingAnimation()
    this._initAnimationPlaying()
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
      this._getBone('chest').name + '.quaternion',
      [0.0, 3.0, 6.0],
      [...initQuat.toArray(), ...finChestQuat.toArray(), ...initQuat.toArray()]
    )

    const clip = new THREE.AnimationClip('breath', 6.0, [headTrack, chestTrack])
    this.animationClip = {}
    this.animationClip.initial = this.animationMixer.clipAction(clip)
  }

  _setSpeakingAnimation() {
    const clip = THREE.AnimationClip.parse({
      name: 'speaking',
      tracks: [{
        name: this.vrm.blendShapeProxy.getBlendShapeTrackName(VRMSchema.BlendShapePresetName.A),
        type: 'number',
        times: [0, 0.2, 0.5],
        values: [0, 1.0, 0],
      }],
    })
    this.animationClip.speaking = this.animationMixer.clipAction(clip)
  }

  _initAnimationPlaying() {
    this.animationClip.initial.paused = false
    this.animationClip.initial.play() // playを実行しても、mixerのtimescaleが0ならアニメーションは開始されない
  }
}
