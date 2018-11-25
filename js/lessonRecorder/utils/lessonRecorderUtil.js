import axios from 'axios'
import { fetchSignedURLs } from '../../shared/utils/networkManager'

export async function fetchLessonGraphicURLs(lessonGraphics) {
    if (lessonGraphics.length === 0) {
        return []
    }

    const urlHeaders = lessonGraphics.map(graphic => {
        return {
            id: graphic.id,
            entity: 'Graphic',
            extension: graphic.fileType
        }
    })

    const urls = await fetchSignedURLs(urlHeaders)

    return Promise.all(
        lessonGraphics.map(async (graphic, i) => {
            return {
                id: graphic.id,
                url: await fetchAndConvertToObjectURL(urls[i]),
                fileType: graphic.fileType
            }
        })
    )
}

async function fetchAndConvertToObjectURL(url) {
    const result = await axios.get(url, { responseType: 'blob' })
    return URL.createObjectURL(result.data)
}

export function clearLessonObject(urls) {
    urls.forEach(url => {
        URL.revokeObjectURL(url)
    })
}
