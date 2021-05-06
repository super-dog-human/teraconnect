import ReactGA from 'react-ga'
import { GA_TRACKING_ID } from './constants'
ReactGA.initialize(GA_TRACKING_ID)

export function filterObject(obj, keys) {
  return Object.keys(obj)
    .filter(key => keys.includes(key))
    .reduce((newObj, key) => {
      return {
        ...newObj,
        [key]: obj[key]
      }
    }, {})
}

export function disableAllButtons() {
  Array.from(document.getElementsByTagName('button'), button => {
    button.disabled = true
  })
}

export function stringToUpperCamel(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function floatSecondsToMinutesFormat(elapsedSeconds) {
  const minutes = Math.floor(elapsedSeconds / 60) % 60      // 分は端数の秒が不要なので切り捨て
  const seconds = Math.floor(elapsedSeconds - minutes * 60) // 秒数も小数点以下は切り捨て
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function arrayToUniq(arr) {
  return arr.filter((x, i, self) => {
    return self.indexOf(x) === i
  })
}

export function extentionNameTo3Chars(extention) {
  switch(extention) {
  case 'jpeg':
    return 'jpg'
  default:
    return extention.substring(0, 3)
  }
}

export function addPreventSwipeEvent() {
  window.addEventListener('touchmove', preventSwipe, { passive: false })
}

export function removePreventSwipeEvent() {
  window.removeEventListener('touchmove', preventSwipe)
}

let isSwipable = true
export function switchSwipable(status) {
  isSwipable = status
}

function preventSwipe(e) {
  if (!e.cancelable) return
  if (!isSwipable) {
    e.preventDefault()
    e.stopImmediatePropagation()
  }
}

export function mouseOrTouchPositions(e, touchEventNames) {
  if (touchEventNames.includes(e.type)) {
    const targetRect = e.target.getBoundingClientRect()
    const x = e.changedTouches[0].pageX - targetRect.x - window.pageXOffset
    const y = e.changedTouches[0].pageY - targetRect.y - window.pageYOffset
    return [x, y]
  } else {
    return [e.nativeEvent.offsetX, e.nativeEvent.offsetY]
  }
}

export function findNextElement(origin, tagName, callback) {
  let next = origin.nextElementSibling
  while(next) {
    let nexts = next.getElementsByTagName(tagName)
    if (nexts.length > 0) {
      callback(nexts)
      break
    }
    next = next.nextElementSibling
  }
}

export function inRange(left, right, value) {
  const min = Math.min(left, right)
  const max = Math.max(left, right)
  return min <= value && max >= value
}

export function isBlobURL(url) {
  return url.startsWith('blob:')
}

export function generateRandomID() {
  return Math.random().toString(32).substring(2)
}