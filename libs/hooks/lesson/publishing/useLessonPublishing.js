import { useRef, useState, useEffect } from 'react'
import useAvatar from '../../lesson/useAvatar'
import { filterObject, stringValueToRGBA, isValidISBN13 } from '../../../utils'
import { imageToThumbnailURL } from '../../../graphicUtils'
import { fetchBookTitle } from '../../../fetchGoogleBooks'

const maxThumbnailSize = { width: 480, height: 270 }

export default function useLessonPublishing({ lesson, material, setFormValue, handleCategorySelectChange, isLoading, onSubjectChange, avatars, allLessons, setting, dispatchSetting }) {
  const inputFileRef = useRef()
  const newReferenceRef = useRef()
  const [isExtendedOtherSetting, setIsExtendedOtherSetting] = useState(false)
  const [isAddingReference, setIsAddingReference] = useState(false)
  const [relationLessonThumbnailURL, setRelationLessonThumbnailURL] = useState({})
  const [avatarLight, setAvatarLight] = useState({})
  const [isAvatarLoading, setIsAvatarLoading] = useState(true)
  const { setAvatarConfig, avatarRef } = useAvatar({ setIsLoading: setIsAvatarLoading })

  function handleTitleChange(e) {
    dispatchSetting({ type: 'title', payload: e.target.value })
  }

  function handleDescriptionChange(e) {
    dispatchSetting({ type: 'description', payload: e.target.value })
  }

  function handleThumbnailUploadingClick() {
    inputFileRef.current.click()
  }

  function handleThumbnailChange(e) {
    const reader = new FileReader()
    const file = e.target.files[0]
    inputFileRef.current.value = ''
    reader.readAsDataURL(file)
    reader.onload = (e => {
      imageToThumbnailURL(e.target.result, maxThumbnailSize, (url) => {
        dispatchSetting({ type: 'thumbnailURL', payload: url })
      })
    })
  }

  function handleSubjectChange(e) {
    onSubjectChange(e)
    dispatchSetting({ type: 'subjectID', payload: parseInt(e.target.value) })
    setFormValue('categoryID', undefined) // 教科更新時は単元を未選択にする
  }

  function handleCategoryChange(e) {
    handleCategorySelectChange(e)

    let categoryID = e.target.value
    if (categoryID) {
      categoryID = parseInt(categoryID)
    } else {
      categoryID = undefined // selectにnullは渡せないのでundefinedにする
    }
    dispatchSetting({ type: 'categoryID', payload: categoryID })
  }

  function handleStatusChange(e) {
    dispatchSetting({ type: 'status', payload: e.target.value })
  }

  function handlePrevLessonChange(e) {
    const prevLessonID = parseInt(e.target.value)
    setRelationLessonURL(prevLessonID, setting.nextLessonID)
    dispatchSetting({ type: 'prevLessonID', payload: prevLessonID })
  }

  function handleNextLessonChange(e) {
    const nextLessonID = parseInt(e.target.value)
    setRelationLessonURL(setting.prevLessonID, nextLessonID)
    dispatchSetting({ type: 'nextLessonID', payload: nextLessonID })
  }

  async function handleAddReferenceClick() {
    const isbn = newReferenceRef.current.value
    if (!isValidISBN13(isbn)) return

    setIsAddingReference(true)

    fetchBookTitle(isbn).then(name => {
      dispatchSetting({ type: 'addReference', payload: { isbn, name } })
    }).catch(e => {
      console.error(e) // エラーでも処理を続行する
      dispatchSetting({ type: 'addReference', payload: { isbn, name: '' } })
    }).finally(() => {
      if (newReferenceRef.current) { // 最後の行でなければ今のISBNをクリア
        newReferenceRef.current.value = null
      }
      setIsAddingReference(false)
    })
  }

  function handleRemoveReferenceClick(e) {
    const targetIndex = e.currentTarget.dataset.index
    dispatchSetting({ type: 'removeReference', payload: targetIndex })
  }

  function handleReferenceISBNBlur(e) {
    const isbn = e.currentTarget.value
    const targetIndex = e.currentTarget.dataset.index
    dispatchSetting({ type: 'updateReference', payload: { targetIndex, isbn } })
  }

  function handleReferenceNameBlur(e) {
    const name = e.currentTarget.value
    const targetIndex = e.currentTarget.dataset.index
    dispatchSetting({ type: 'updateReference', payload: { targetIndex, name } })
  }

  function handleExtendSettingClick() {
    setIsExtendedOtherSetting(b => !b)
  }

  function handleBgImageChange(e) {
    dispatchSetting({ type: 'backgroundImageID', payload: parseInt(e.target.value) })
  }

  function handleAvatarChange(e) {
    const avatarID = parseInt(e.target.value)
    const avatar = avatars.find(a => a.id === avatarID)
    setAvatarConfig({ avatar })
    dispatchSetting({ type: 'avatarID', payload: avatarID })
  }

  function handleColorChange(color) {
    setAvatarConfig({ lightColor: color })
    dispatchSetting({ type: 'avatarLightColor', payload: color })
  }

  function setInitialSetting() {
    setAvatarLight(stringValueToRGBA(material.avatarLightColor))

    const payload = {
      categoryID: lesson.japaneseCategoryID,
      references: lesson.references || [],
      ...filterObject(lesson, ['thumbnailURL', 'title', 'subjectID', 'status', 'prevLessonID', 'nextLessonID']),
      ...filterObject(material, ['avatarID', 'avatarLightColor', 'backgroundImageID', 'backgroundImageURL', 'voiceSynthesisConfig']),
    }
    dispatchSetting({ type: 'initialize', payload })
  }

  function setRelationLessonURL(prevLessonID, nextLessonID) {
    setRelationLessonThumbnailURL({
      prev: allLessons.find(l => l.id === prevLessonID)?.thumbnailURL,
      next: allLessons.find(l => l.id === nextLessonID)?.thumbnailURL,
    })
  }

  useEffect(() => {
    if (!isLoading) return
    setInitialSetting()
  }, [isLoading])

  useEffect(() => {
    if (allLessons.length === 0) return
    setRelationLessonURL(lesson.prevLessonID, lesson.nextLessonID)
  }, [allLessons, lesson.prevLessonID, lesson.nextLessonID])

  useEffect(() => {
    if (!isExtendedOtherSetting) return
    setAvatarConfig({ avatar: material.avatar, lightColor: avatarLight })
  }, [isExtendedOtherSetting, material.avatar, material.avatarLightColor])

  return { isExtendedOtherSetting, inputFileRef, newReferenceRef, isAddingReference, relationLessonThumbnailURL, isAvatarLoading, avatarRef, avatarLight,
    handleExtendSettingClick, handleTitleChange, handleDescriptionChange, handleThumbnailUploadingClick, handleThumbnailChange, handleStatusChange, handleSubjectChange, handleCategoryChange,
    handlePrevLessonChange, handleNextLessonChange, handleAddReferenceClick, handleRemoveReferenceClick, handleReferenceISBNBlur, handleReferenceNameBlur, handleBgImageChange, handleAvatarChange, handleColorChange }
}