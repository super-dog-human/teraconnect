import { isProduction, isStaging } from './utility'

export const PRODUCTION_API_URL = 'https://api.teraconnect.org/'
export const STAGING_API_URL =
    'https://teraconnect-api-development-dot-teraconnect-209509.appspot.com/'
export const PRODUCTION_URL = 'https://teraconnect.org/'
export const STAGING_URL =
    'https://teraconnect-authoring-development-dot-teraconnect-209509.appspot.com/'
export const DEVELOPMENT_URL = 'http://localhost:1234/'

export const FRONT_URL = isProduction()
    ? PRODUCTION_API_URL
    : isStaging()
        ? STAGING_API_URL
        : DEVELOPMENT_URL
export const API_URL = isProduction() ? PRODUCTION_API_URL : STAGING_API_URL
export const AUTH0_PRODUCTION_CLIENT_ID = 'm0b05bVI1hIfAjNE20V6YDHU4lmk5eG4'
export const AUTH0_DEVELOPMENT_CLIENT_ID = 'fKN9OEt7vlcyspp8qLrvPqFteSXGI8DO'
export const AUTH0_CLIENT_ID = isProduction()
    ? AUTH0_PRODUCTION_CLIENT_ID
    : AUTH0_DEVELOPMENT_CLIENT_ID
export const AUTH_REDIRECT_URL = FRONT_URL + 'auth_callback'
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
