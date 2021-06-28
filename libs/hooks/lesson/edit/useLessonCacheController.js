import { useRef, useState, useEffect } from 'react'
import { useLessonEditorContext } from '../../../contexts/lessonEditorContext'
import usePreventUnload from '../../usePreventUnload'
import useDebounce from '../../useDebounce'

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

export default function useLessonCacheController({ isLoading, lessonID }) {
  const materialQueRef = useRef({})
  const materialBusyQueRef = useRef({})
  const [shouldUpdate, setShouldUpdate] = useState(false)
  const { generalSetting, avatars, embeddings, graphics, drawings, musics, speeches } = useLessonEditorContext()
  const { debouncedValue: shouldSetCache } = useDebounce(shouldUpdate, 3000) // 最頻でも3秒に1回しかlocalStorageへ書き込みを発生させない
  const [isPreventUnload, setIsPreventUnload] = useState(false)
  usePreventUnload(isPreventUnload)

  function getCache(name) {
    return JSON.parse(localStorage.getItem(keyName(name)) || '""')
  }

  // localStorageへの書き込みはなるべく回数を抑えたいのでDebounceする
  function setCacheWithDebounce(material) {
    if (isLoading) return

    if (!isExistsDiff()) {
      localStorage.setItem(keyName('isExistsDiffCache'), 'true')
    }

    if (shouldSetCache) {
      materialBusyQueRef.current = { ...materialBusyQueRef.current, ...material }
      return
    }

    materialQueRef.current = { ...materialQueRef.current, ...material }
    setIsPreventUnload(true)
    setShouldUpdate(true)
  }

  function setCacheWithDebounceInBusied() {
    if (!isExistsDiff()) {
      localStorage.setItem(keyName('isExistsDiffCache'), 'true')
    }

    materialQueRef.current = { ...materialQueRef.current, ...materialBusyQueRef.current }
    materialBusyQueRef.current = {}
    setIsPreventUnload(true)
    setShouldUpdate(true)
  }

  function setCache() {
    Object.keys(materialQueRef.current).forEach(key => {
      localStorage.setItem(keyName(key), JSON.stringify(materialQueRef.current[key]))
    })
    materialQueRef.current = {}

    setIsPreventUnload(false)
    setShouldUpdate(false)
  }

  function clearDiffFlag() {
    localStorage.removeItem(keyName('isExistsDiffCache'))
  }

  function clearCache() {
    materialQueRef.current = {}
    materialBusyQueRef.current = {}
    Object.keys(storageKeys).forEach(key => localStorage.removeItem(keyName(key)))
  }

  function isExistsCache() {
    return localStorage.getItem(keyName('isExistsCache')) === 'true'
  }

  function isExistsDiff() {
    return localStorage.getItem(keyName('isExistsDiffCache')) === 'true'
  }

  function keyName(name) {
    return `cache_${lessonID}_${storageKeys[name]}`
  }

  function setInitialCache() {
    localStorage.setItem(keyName('isExistsCache'), 'true')
    localStorage.setItem(keyName('generalSetting'), JSON.stringify(generalSetting))
    localStorage.setItem(keyName('avatars'), JSON.stringify(avatars))
    localStorage.setItem(keyName('embeddings'), JSON.stringify(embeddings))
    localStorage.setItem(keyName('graphics'), JSON.stringify(graphics))
    localStorage.setItem(keyName('drawings'), JSON.stringify(drawings))
    localStorage.setItem(keyName('musics'), JSON.stringify(musics))
    localStorage.setItem(keyName('speeches'), JSON.stringify(speeches))
  }

  useEffect(() => {
    setCacheWithDebounce({ avatars })
  }, [avatars])

  useEffect(() => {
    setCacheWithDebounce({ embeddings })
  }, [embeddings])

  useEffect(() => {
    setCacheWithDebounce({ graphics })
  }, [graphics])

  useEffect(() => {
    setCacheWithDebounce({ drawings })
  }, [drawings])

  useEffect(() => {
    setCacheWithDebounce({ musics })
  }, [musics])

  useEffect(() => {
    setCacheWithDebounce({ speeches })
  }, [speeches])

  useEffect(() => {
    if (isLoading) return
    if (!isExistsCache()) {
      setInitialCache()
    }
  }, [isLoading])

  useEffect(() => {
    if (shouldSetCache) {
      setCache()
    } else if (Object.keys(materialBusyQueRef.current).length > 0) {
      setCacheWithDebounceInBusied() // 書き込み中に発生した更新差分があれば次の書き込みに使用する
    }
  }, [shouldSetCache])

  return { isExistsCache, isExistsDiff, clearDiffFlag, getCache, clearCache }
}