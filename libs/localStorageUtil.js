const storageKeys = {
  isExistsCache: 'isExistsCache',
  isExistsDiffCache: 'isExistsDiffCache',
  generalSetting: 'generalSetting',
  avatars: 'lessonAvatars',
  embeddings: 'lessonEmbeddings',
  graphics: 'lessonGraphics',
  drawings: 'lessonDrawings',
  musics: 'lessonMusics',
  speeches: 'lessonSpeeches',
}

function keyName(lessonID, name) {
  return `cache_${lessonID}_${storageKeys[name]}`
}

export function getCache(lessonID, name) {
  return JSON.parse(localStorage.getItem(keyName(lessonID, name)) || '""')
}

export function setCache(lessonID, key, obj) {
  localStorage.setItem(keyName(lessonID, key), JSON.stringify(obj))
}

function removeCache(lessonID, key) {
  localStorage.removeItem(keyName(lessonID, key))
}

export function setExistsDiffCache(lessonID) {
  setCache(lessonID, 'isExistsDiffCache', true)
}

export function removeExistsDiffCache(lessonID) {
  removeCache(lessonID, 'isExistsDiffCache')
}

export function removeAllCache(lessonID) {
  Object.keys(storageKeys).forEach(key => removeCache(lessonID, key))
}

export function isExistsDiff(lessonID) {
  return localStorage.getItem(keyName(lessonID, 'isExistsDiffCache')) === 'true'
}

export function isExistsCache(lessonID) {
  return localStorage.getItem(keyName(lessonID, 'isExistsCache')) === 'true'
}

export function setInitialCache({ lessonID, generalSetting, avatars, embeddings, graphics, drawings, musics, speeches }) {
  localStorage.setItem(keyName(lessonID, 'isExistsCache'), 'true')
  localStorage.setItem(keyName(lessonID, 'generalSetting'), JSON.stringify(generalSetting))
  localStorage.setItem(keyName(lessonID, 'avatars'), JSON.stringify(avatars))
  localStorage.setItem(keyName(lessonID, 'embeddings'), JSON.stringify(embeddings))
  localStorage.setItem(keyName(lessonID, 'graphics'), JSON.stringify(graphics))
  localStorage.setItem(keyName(lessonID, 'drawings'), JSON.stringify(drawings))
  localStorage.setItem(keyName(lessonID, 'musics'), JSON.stringify(musics))
  localStorage.setItem(keyName(lessonID, 'speeches'), JSON.stringify(speeches))
}

export function updateGeneralSettingCache(lessonID, newSetting) {
  const voiceSynthesisConfig = newSetting.voiceSynthesisConfig
  delete newSetting.voiceSynthesisConfig

  let setting = getCache(lessonID, 'generalSetting')
  setting = { ...setting, ...newSetting }
  setting.voiceSynthesisConfig = { ...setting.voiceSynthesisConfig, ...voiceSynthesisConfig }

  setCache(lessonID, 'generalSetting', setting)
}