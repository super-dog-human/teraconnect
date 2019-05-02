import React, { useCallback, useContext, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDropzone } from 'react-dropzone'
import AvatarRightsChecker from './utils/avatarRightsChecker'
import { fetchAvatars, uploadAvatar } from '../shared/utils/networkManager'
import styled from '@emotion/styled'
import { css } from 'emotion'
import { LessonAvatarCreatingContext } from './context'
import { ModalWindowContext } from '../shared/components/modalWindow/context'
import { openModal, closeModal } from '../shared/utils/utility'

const defaultThumbnailURL =
    'https://storage.googleapis.com/teraconn_thumbnail/avatar/default.png'
const userAvatarFileErrorTitle = '使用できないファイルです'
const failedDownloadingAvatarFile = 'アバターの読み込みに失敗しました'
const failedUploadingAvatarFile = 'アバターのアップロードに失敗しました'
const userAvatarFileErrorMessage =
    '下記の条件を確認してください。\n\n・再配布可能な設定である\n・VRoid Studioで作成したVRMファイルである\n・ファイルサイズが30MB以下である'
const confirmAvatarLicenceTitle = 'アバターの使用権を確認してください。'
const confirmAvatarLicenceMessage =
    '\n※上記全てに該当しないと、このファイルは使用できません。'
const maxFileBytes = 31457280

export default props => {
    const [isLoading, setIsLoading] = useState(true)
    const [selectedAvatarID, setSelectedAvatarID] = useState('')
    const [hasAddedAvatar, setHasAddedAvatar] = useState(false)
    const [avatars, setAvatars] = useState([])
    const { isCreating, setIsCreating } = useContext(
        LessonAvatarCreatingContext
    )
    const modalWindow = useContext(ModalWindowContext)

    useEffect(() => {
        if (avatars.length === 0) {
            fetchAvatars()
                .then(fetchedAvatars => {
                    setIsLoading(false)
                    setAvatars(fetchedAvatars)
                })
                .catch(err => {
                    console.error(err)
                    setIsLoading(false)
                    openModal(modalWindow, {
                        title: failedDownloadingAvatarFile,
                        message: err.message,
                        onClose: () => {
                            closeModal(modalWindow)
                            location.reload()
                        }
                    })
                })
        }
    }, [])

    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
        if (isCreating) return

        if (rejectedFiles.length > 0) {
            openModal(modalWindow, {
                title: userAvatarFileErrorTitle,
                message: userAvatarFileErrorMessage,
                onClose: () => {
                    closeModal(modalWindow)
                }
            })
            return
        }

        if (acceptedFiles.length === 0) return

        createNewAvatar(acceptedFiles[0])
    }, [])

    const { getRootProps, getInputProps } = useDropzone({
        accept: '.vrm',
        maxSize: maxFileBytes,
        multiple: false,
        onDrop
    })

    function handleAvatarChange(event) {
        const avatarID = event.target.value // can't unchecked after checked once.
        setSelectedAvatarID(avatarID)
        props.onAvatarChange(avatarID)
    }

    async function createNewAvatar(file) {
        setIsCreating(true)

        const url = file.preview
        const checker = new AvatarRightsChecker()

        await checker.loadAvatar(url) // TODO catch error

        if (!checker.canUse()) {
            openModal(modalWindow, {
                title: userAvatarFileErrorTitle,
                message: userAvatarFileErrorMessage,
                onClose: () => {
                    closeModal(modalWindow)
                },
                isError: true
            })

            setIsCreating(false)
            return
        }

        if (checker.shouldShowConfirmForUsing()) {
            openModal(modalWindow, {
                title: confirmAvatarLicenceTitle,
                message: checker.confirmMessage() + confirmAvatarLicenceMessage,
                onClickOK: () => {
                    closeModal(modalWindow)
                    uploadUserAvatar(url, checker)
                },
                onClickCancel: () => {
                    closeModal(modalWindow)
                    setIsCreating(false)
                },
                needsConfirm: true,
                okButtonLabel: 'はい',
                cancelButtonLabel: 'いいえ'
            })
        } else {
            uploadUserAvatar(url, checker)
        }
    }

    function uploadUserAvatar(url, checker) {
        uploadAvatar(url)
            .then(id => {
                avatars.push({ id: id })
                setAvatars(avatars)
                setHasAddedAvatar(true)
                setIsCreating(false)
            })
            .catch(err => {
                openModal(modalWindow, {
                    title: failedUploadingAvatarFile,
                    message: err.message,
                    onClose: () => {
                        closeModal(modalWindow)
                    }
                })
            })

        // TODO updateAvatar
        // checker.meta.author
    }

    return (
        <AvatarMangaerContainer className="app-back-color-dark-gray">
            <div className="form-inline">
                {avatars.map((avatar, i) => {
                    const isSelected = avatar.id === selectedAvatarID
                    return (
                        <AvatarLabel
                            key={i}
                            className={
                                isSelected
                                    ? selectedElementStyle
                                    : unselectElementStyle
                            }
                        >
                            <AvatarThumbnail
                                src={
                                    avatar.thumbnailURL
                                        ? avatar.thumbnailURL
                                        : defaultThumbnailURL
                                }
                            />
                            <AvatarSelector
                                type="checkbox"
                                value={avatar.id}
                                checked={isSelected}
                                onChange={handleAvatarChange}
                            />
                        </AvatarLabel>
                    )
                })}
                <AvatarUploader
                    className={
                        isCreating || hasAddedAvatar ? 'd-none' : 'd-block'
                    }
                    data-tip="VRMファイルは、授業再生のため再配布されます"
                >
                    <div
                        {...getRootProps({
                            style: {
                                width: '100px',
                                height: '100px',
                                position: 'absolute'
                            }
                        })}
                    >
                        <input {...getInputProps()} />
                        <UploadIcon className="app-text-color-soft-white">
                            <FontAwesomeIcon icon="file-upload" />
                        </UploadIcon>
                        <UploadIconLabel
                            id="upload-avatar-text"
                            className="app-text-color-soft-white"
                        >
                            &nbsp;追加
                        </UploadIconLabel>
                    </div>
                </AvatarUploader>
                <UploadingStatus
                    className={isLoading || isCreating ? 'd-block' : 'd-none'}
                >
                    <LoadingIcon className="app-text-color-soft-white">
                        <FontAwesomeIcon icon="spinner" spin />
                    </LoadingIcon>
                </UploadingStatus>
            </div>
        </AvatarMangaerContainer>
    )
}

const AvatarMangaerContainer = styled.div`
    position: relative;
    padding: 15px;
    width: 600px;
    height: 140px;
    &::-webkit-scrollbar {
        display: none;
    }
`
const AvatarThumbnail = styled.img`
    width: 100px;
    height: 100px;
`

const selectedElementStyle = css`
    border: solid 6px #ec9f05;
`

const unselectElementStyle = css`
    border: 6px solid rgba(0, 0, 0, 0);
`

const AvatarLabel = styled.label`
    width: 110px;
    height: 110px;
    position: relative;
    margin-right: 10px;
    cursor: pointer;
`

const AvatarSelector = styled.input`
    display: none;
`

const AvatarUploader = styled.div`
    position: relative;
    width: 100px;
    height: 100px;
    border: 2px dashed white;
    cursor: pointer;
    &:hover {
        opacity: 0.7;
    }
`

const UploadIcon = styled.div`
    position: absolute;
    width: 40px;
    height: 40px;
    font-size: 40px;
    text-align: center;
    top: 20%;
    left: 0;
    right: 0;
    margin: auto;
`

const UploadIconLabel = styled.div`
    position: absolute;
    width: 100%;
    text-align: center;
    bottom: 20%;
    font-size: 12px;
`

const UploadingStatus = styled.div`
    position: relative;
    width: 100px;
    height: 100px;
`

const LoadingIcon = styled.div`
    position: absolute;
    width: 40px;
    height: 40px;
    font-size: 40px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
`
