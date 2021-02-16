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

export function stringToMinutesFormat(currentSecWithFloat) {
  const currentSec = Math.floor(currentSecWithFloat)
  const minutes = Math.floor(currentSec / 60).toString()
  const seconds = (currentSec - minutes * 60).toString()
  return `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`
}

export function arrayToUniq(arr) {
  return arr.filter((x, i, self) => {
    return self.indexOf(x) === i
  })
}

export function sendExceptionToGA(componentName, err, isFatal) {
//  if (!isProduction()) return

  ReactGA.exception({
    category: componentName,
    action: err.message,
    description: `${err.stack.replace(/(@)(http|https):\/\//g, '(at)$2:')}`,
    fatal: isFatal
  })
}

export function extentionNameTo3Chars(extention) {
  switch(extention) {
  case 'jpeg':
    return 'jpg'
  case 'svg+xml':
    return 'svg'
  default:
    return extention.substring(0, 3)
  }
}

export function switchSwipable(isSwipable) {
  (isSwipable) ? removeEvent() : addEvent()
  function addEvent() {
    window.addEventListener('touchmove', preventSwipe, { passive: false })
  }

  function removeEvent() {
    window.removeEventListener('touchmove', preventSwipe)
  }
}

function preventSwipe(e) {
  e.preventDefault()
  e.stopImmediatePropagation()
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