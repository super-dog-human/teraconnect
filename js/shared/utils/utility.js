import ReactGA from 'react-ga'

export function isProduction() {
    return document.location.href.startsWith(
        'https://authoring.teraconnect.org/'
    )
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

export function arraySum(arr) {
    return arr.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
    )
}

export function arrayAverage(arr) {
    return arraySum(arr) / arr.length
}

export function arrayToUniq(arr) {
    return arr.filter((x, i, self) => {
        return self.indexOf(x) === i
    })
}

export function sendExceptionToGA(componentName, err, isFatal) {
    ReactGA.exception({
        category: componentName,
        description: `${err.message} ${err.stack.replace(
            /\s.*?@.*?\s/,
            '[MASKED EMAIL]'
        )}`,
        fatal: isFatal
    })
}
