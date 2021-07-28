import { useRef, useState, useCallback, useEffect } from 'react'
import { useLessonEditorContext } from '../../../contexts/lessonEditorContext'
import usePreventUnload from '../../usePreventUnload'
import useDebounce from '../../useDebounce'
import { setCache, setExistsDiffCache, isExistsCache, setInitialCache, removeExistsDiffCache, removeAllCache } from '../../../localStorageUtil'

export default function useLessonCacheController({ isLoading, lessonID }) {
  const materialQueRef = useRef({})
  const materialBusyQueRef = useRef({})
  const isLoadedRef = useRef(false)
  const isInitialSetRef = useRef(false)
  const shouldSetCacheRef = useRef(false)
  const [shouldUpdate, setShouldUpdate] = useState(false)
  const { generalSetting, avatars, embeddings, graphics, drawings, musics, speeches } = useLessonEditorContext()
  const { debouncedValue: shouldSetCache } = useDebounce(shouldUpdate, 3000) // 最頻でも3秒に1回しかlocalStorageへ書き込みを発生させない
  const [isPreventUnload, setIsPreventUnload] = useState(false)
  usePreventUnload(isPreventUnload)

  // localStorageへの書き込みはなるべく回数を抑えたいのでDebounceする
  const setCacheWithDebounce = useCallback(material => {
    if (!isLoadedRef.current) return

    setExistsDiffCache(lessonID)

    if (shouldSetCacheRef.current) {
      materialBusyQueRef.current = { ...materialBusyQueRef.current, ...material }
      return
    }

    materialQueRef.current = { ...materialQueRef.current, ...material }
    setIsPreventUnload(true)
    setShouldUpdate(true)
  }, [lessonID])

  const setCacheWithDebounceInBusied = useCallback(() => {
    setExistsDiffCache(lessonID)

    materialQueRef.current = { ...materialQueRef.current, ...materialBusyQueRef.current }
    materialBusyQueRef.current = {}
    setIsPreventUnload(true)
    setShouldUpdate(true)
  }, [lessonID])

  const setCaches = useCallback(() => {
    Object.keys(materialQueRef.current).forEach(key => {
      setCache(lessonID, key, materialQueRef.current[key])
    })
    materialQueRef.current = {}

    setIsPreventUnload(false)
    setShouldUpdate(false)
  }, [lessonID])

  function clearDiffFlag() {
    removeExistsDiffCache(lessonID)
  }

  function clearCache() {
    materialQueRef.current = {}
    materialBusyQueRef.current = {}
    removeAllCache(lessonID)
  }

  useEffect(() => {
    isLoadedRef.current = !isLoading
  }, [isLoading])

  useEffect(() => {
    shouldSetCacheRef.current = shouldSetCache
  }, [shouldSetCache])

  useEffect(() => {
    setCacheWithDebounce({ avatars })
  }, [avatars, setCacheWithDebounce])

  useEffect(() => {
    setCacheWithDebounce({ embeddings })
  }, [embeddings, setCacheWithDebounce])

  useEffect(() => {
    setCacheWithDebounce({ graphics })
  }, [graphics, setCacheWithDebounce])

  useEffect(() => {
    setCacheWithDebounce({ drawings })
  }, [drawings, setCacheWithDebounce])

  useEffect(() => {
    setCacheWithDebounce({ musics })
  }, [musics, setCacheWithDebounce])

  useEffect(() => {
    setCacheWithDebounce({ speeches })
  }, [speeches, setCacheWithDebounce])

  useEffect(() => {
    if (isLoading) return
    if (isInitialSetRef.current) return

    if (!isExistsCache(lessonID)) {
      setInitialCache({ lessonID, generalSetting, avatars, embeddings, graphics, drawings, musics, speeches })
    }
    isInitialSetRef.current = true
  }, [isLoading, lessonID, generalSetting, avatars, embeddings, graphics, drawings, musics, speeches])

  useEffect(() => {
    if (shouldSetCache) {
      setCaches()
    } else if (Object.keys(materialBusyQueRef.current).length > 0) {
      setCacheWithDebounceInBusied() // 書き込み中に発生した更新差分があれば次の書き込みに使用する
    }
  }, [shouldSetCache, setCaches, setCacheWithDebounceInBusied])

  return { clearDiffFlag, clearCache }
}