import { detect } from 'detect-browser'
import { isMobile } from 'react-device-detect'
import ReactGA from 'react-ga'
import { GA_TRACKING_ID } from './constants'
ReactGA.initialize(GA_TRACKING_ID)

export function isProduction() {
    //    return process.env.NODE_ENV === 'production'
    return document.location.href.startsWith(
        'https://authoring.teraconnect.org/'
    )
}

export function canRecordLessonBrowser() {
    const browser = detect()
    if (browser.name === 'chrome') return true
    if (browser.name === 'firefox') return true
    if (!isMobile) return

    return false
}

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
    if (!isProduction()) return

    ReactGA.exception({
        category: componentName,
        action: err.message,
        description: `${err.stack.replace(/(@)(http|https):\/\//g, '(at)$2:')}`,
        fatal: isFatal
    })
}
