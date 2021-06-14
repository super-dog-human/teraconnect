import { useRef, useState, useEffect } from 'react'
import { useLessonEditorContext } from '../../../contexts/lessonEditorContext'
import usePreventUnload from '../../usePreventUnload'
import useDebounce from '../../useDebounce'

const storageKeys = {
  isExistsDiffCache: 'isExistsDiffCache',
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
  const { avatars, embeddings, graphics, drawings, musics, speeches } = useLessonEditorContext()
  const { debouncedValue: shouldSetCache } = useDebounce(shouldUpdate, 3000) // 最頻でも3秒に1回しかlocalStorageへ書き込みを発生させない
  const [isPreventUnload, setIsPreventUnload] = useState(false)
  usePreventUnload(isPreventUnload)

  function getCache(name) {
    localStorage.getItem(JSON.parse(keyName(name)))
  }

  function setCacheWithDebounce(material) {
    if (isLoading) return
    if (shouldSetCache) {
      materialBusyQueRef.current = { ...materialBusyQueRef.current, ...material }
      return
    }

    materialQueRef.current = { ...materialQueRef.current, material }
    setIsPreventUnload(true)
    setShouldUpdate(true)
  }

  function setCacheWithDebounceInBusied() {
    materialQueRef.current = { ...materialQueRef.current, ...materialBusyQueRef.current }
    materialBusyQueRef.current = {}
    setIsPreventUnload(true)
    setShouldUpdate(true)
  }

  function setCache() {
    if (!isExistsCache()) {
      localStorage.setItem(keyName('isExistsDiffCache'), 'true')
    }

    Object.keys(materialQueRef.current).forEach(key => {
      localStorage.setItem(keyName(key), JSON.stringify(materialQueRef.current[key]))
    })
    materialQueRef.current = {}

    setIsPreventUnload(false)
    setShouldUpdate(false)
  }

  function clearCache() {
    materialQueRef.current = {}
    materialBusyQueRef.current = {}
    Object.values(storageKeys).forEach(key => localStorage.removeItem(key))
  }

  function isExistsCache() {
    return localStorage.getItem(keyName('isExistsDiffCache')) === 'true'
  }

  function keyName(name) {
    return `cache_${lessonID}_${storageKeys[name]}`
  }

  function setInitialCache() {
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
      setCache()                     // localStorageへの書き込みはなるべく回数を抑えたいのでDebounceする
    } else if (Object.keys(materialBusyQueRef.current).length > 0) {
      setCacheWithDebounceInBusied() // 書き込み中に発生した更新差分があれば次の書き込みに使用する
    }
  }, [shouldSetCache])

  return { isExistsCache, getCache, clearCache }
}