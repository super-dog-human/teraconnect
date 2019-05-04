require('dotenv').config()

import { isProduction } from './utility'

export const AUTH0_CLIENT_ID = isProduction()
    ? process.env.PROD_AUTH0_CLIENT_ID
    : process.env.DEV_AUTH0_CLIENT_ID
export const AUTH0_REDIRECT_URL = isProduction()
    ? 'https://authoring.teraconnect.org/_auth_callback'
    : 'http://localhost:1234/_auth_callback'
export const API_URL = isProduction()
    ? process.env.PROD_API_URL
    : process.env.DEV_API_URL

export const LESSON_API_URL = API_URL + 'lessons/{lessonID}'
export const LESSON_MATERIAL_API_URL = API_URL + 'lessons/{lessonID}/materials'
export const LESSON_VOICE_TEXT_API_URL =
    API_URL + 'lessons/{lessonID}/voice_texts'
export const LESSON_PACK_API_URL = API_URL + 'lessons/{lessonID}/packs'
export const STORAGE_OBJECT_API_URL = API_URL + 'storage_objects'
export const RAW_VOICE_API_URL = API_URL + 'raw_voices'
export const AVATAR_API_URL = API_URL + 'avatars'
export const GRAPHIC_API_URL = API_URL + 'graphics'

export const RATIO_16_TO_9 = 0.5625
export const RATIO_9_TO_16 = 1.77777777778
export const RAD_70 = 1.2217304763960306
export const RAD_90 = 1.5707963267948966
export const GA_TRACKING_ID = 'UA-120790122-1'
