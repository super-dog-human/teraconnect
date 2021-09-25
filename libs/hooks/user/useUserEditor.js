import { useRef, useState, useReducer, useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import useFetch from '../useFetch'
import { putFile } from '../../fetch'
import { filterObject } from '../../utils'
import { dataURLToBlob } from '../../graphicUtils'
import { imageToThumbnailURL } from '../../graphicUtils'
import { useErrorDialogContext } from '../../contexts/errorDialogContext'

const maxThumbnailSize = { width: 250, height: 250 }
const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export default function useUserEditor({ user } ) {
  const router = useRouter()
  const newSettingRef = useRef({})
  const inputFileRef = useRef()
  const [initialLoading, setInitialLoading] = useState(true)
  const [isNewUser, setIsNewUser] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isUpdated, setIsUpdated] = useState(false)
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({})
  const { onChange: handleNameInputChange, ...nameInputProps } = register('name', { required: true })
  const { onChange: handleEmailInputChange, ...emailInputProps } = register('email', { required: true, pattern: emailRegEx })
  const { onChange: handleProfileInputChange, ...profileInputProps } = register('profile', { required: false })
  const [account, dispatchAccount] = useReducer(accountReducer, {})
  const { fetchWithAuth, post } = useFetch()
  const { showError } = useErrorDialogContext()

  function accountReducer(state, { type, payload }) {
    if (type === 'initialize') {
      if (isNewUser) newSettingRef.current = payload
      return payload
    }

    switch (type) {
    case 'name':
      newSettingRef.current.name = payload
      return { ...state, 'name': payload }
    case 'email':
      newSettingRef.current.email = payload
      return { ...state, 'email': payload }
    case 'profile':
      newSettingRef.current.profile = payload
      return { ...state, 'profile': payload }
    case 'thumbnailURL':
      newSettingRef.current.thumbnailURL = payload
      return { ...state, 'thumbnailURL': payload }
    default:
      throw new Error()
    }
  }

  function handleNameChange(e) {
    dispatchAccount({ type: 'name', payload: e.target.value })
    handleNameInputChange(e)
  }

  function handleEmailChange(e) {
    dispatchAccount({ type: 'email', payload: e.target.value })
    handleEmailInputChange(e)
  }

  function handleProfileChange(e) {
    dispatchAccount({ type: 'profile', payload: e.target.value })
    handleProfileInputChange(e)
  }

  function handleThumbnailChange(e) {
    const reader = new FileReader()
    const file = e.target.files[0]
    inputFileRef.current.value = ''
    reader.readAsDataURL(file)
    reader.onload = (e => {
      imageToThumbnailURL(e.target.result, maxThumbnailSize, (url) => {
        dispatchAccount({ type: 'thumbnailURL', payload: url })
      })
    })
  }

  function handleThumbnailUploadingClick() {
    inputFileRef.current.click()
  }

  function handleSubmitClick() {
    setIsUpdated(false)
    if (isUpdating) return

    setIsUpdating(true)
    updateSetting()
  }

  async function updateSetting() {
    const requestBody = filterObject(newSettingRef.current, ['name', 'email', 'profile'])
    const thumbnailURL = newSettingRef.current.thumbnailURL

    const request = isNewUser ? ['/users', requestBody, 'POST'] : ['/users/me', requestBody, 'PATCH']
    await post(...request)
      .then(async () => {
        newSettingRef.current = {}
        if (thumbnailURL) {
          uploadThumbnail(thumbnailURL)
        } else {
          finalizeUploading()
        }
      }).catch(e => {
        // 既に登録済みである旨エラーを出す
        showError({
          message: 'ユーザーの登録に失敗しました。',
          original: e,
          canDismiss: true,
          callback: () => {
            updateSetting()
          },
          dismissCallback: () => {
            setIsUpdating(false)
          }
        })
        console.error(e)
      })
  }

  async function uploadThumbnail(url) {
    post('/users/me/thumbnail').then(async (r) => {
      const file = dataURLToBlob(url, 'image/png')
      uploadImageFile(r.url, file)
    }).catch(e => {
      showError({
        message: 'サムネイル作成の準備に失敗しました。',
        original: e,
        canDismiss: true,
        callback: () => {
          uploadThumbnail(url)
        },
        dismissCallback: () => {
          setIsUpdating(false)
        },
      })
      console.error(e)
    })
  }

  function uploadImageFile(url, file) {
    putFile(url, file, file.type).then(() => {
      finalizeUploading()
    }).catch(e => {
      showError({
        message: 'サムネイルのアップロードに失敗しました。',
        original: e,
        canDismiss: true,
        callback: () => {
          uploadImageFile(url, file)
        },
        dismissCallback: () => {
          setIsUpdating(false)
        },
      })
      console.error(e)
    })
  }

  function finalizeUploading() {
    newSettingRef.current = {}
    if (isNewUser) {
      router.push('/dashboard')
    }
    setIsNewUser(false)
    setIsUpdating(false)
    setIsUpdated(true)
  }

  const fetchProfile = useCallback(() => {
    fetchWithAuth('/users/me').then(user => {
      const thumbnailURL = `${process.env.NEXT_PUBLIC_GOOGLE_STORAGE_BUCKET_URL}/user/${user.id}.png?${Date.now()}`
      setValue('name', user.name)
      setValue('email', user.email)
      setValue('profile', user.profile)
      setValue('thumbnailURL', thumbnailURL)
      dispatchAccount({ type: 'initialize', payload: { id: user.id, name: user.name, email: user.email, thumbnailURL } })
      setInitialLoading(false)
    }).catch(e => {
      if (e.response.status === 404) {
        setIsNewUser(true)
        setInitialLoading(false)
        setValue('name', user.name)
        setValue('email', user.email)
        setValue('thumbnailURL', user.image)
        dispatchAccount({ type: 'initialize', payload: { name: user.name, email: user.email, thumbnailURL: user.image } })
      } else {
        showError({
          message: 'ユーザー情報の取得に失敗しました。',
          original: e,
          canDismiss: false,
          callback: () => {
            fetchProfile()
          },
        })
      }
    })
  }, [user, setValue, fetchWithAuth, dispatchAccount, showError])

  useEffect(() => {
    if (Object.keys(account).length > 0) return
    fetchProfile()
  }, [account, fetchProfile])

  return { initialLoading, isNewUser, isUpdating, isUpdated, account, inputFileRef,
    handleNameChange, handleEmailChange, handleProfileChange, handleThumbnailChange, handleThumbnailUploadingClick, handleSubmit, handleSubmitClick,
    nameInputProps, emailInputProps, profileInputProps, formErrors: errors }
}