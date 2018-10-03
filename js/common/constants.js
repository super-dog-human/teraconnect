export const PRODUCTION_API_URL  = 'https://api.teraconnect.org/';
export const DEVELOPMENT_API_URL = 'http://localhost:8080/';

export function isProduction() {
//    return document.location.href.startsWith('https://authoring.teraconnect.org/');
    return true;
}
export const API_URL                   = isProduction() ? PRODUCTION_API_URL : DEVELOPMENT_API_URL;
export const LESSON_API_URL            = API_URL + 'lessons/{lessonID}';
export const LESSON_MATERIAL_API_URL   = API_URL + 'lessons/{lessonID}/materials';
export const LESSON_VOICE_TEXT_API_URL = API_URL + 'lessons/{lessonID}/voice_texts';
export const LESSON_PACK_API_URL       = API_URL + 'lessons/{lessonID}/packs';
export const STORAGE_OBJECT_API_URL    = API_URL + 'storage_objects';
export const RAW_VOICE_API_URL         = API_URL + 'raw_voices';
export const AVATAR_API_URL            = API_URL + 'avatars';
export const GRAPHIC_API_URL           = API_URL + 'graphics';
export const RATIO_16_TO_9             = 0.5625;
export const RATIO_9_TO_16             = 1.77777777778;
export const RAD_70                    = 1.2217304763960306;
export const RAD_90                    = 1.5707963267948966;