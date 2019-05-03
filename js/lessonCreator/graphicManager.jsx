import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fetchGraphics, uploadGraphics } from '../shared/utils/networkManager'
import styled from '@emotion/styled'
import { css } from 'emotion'
import { LessonGraphicCreatingContext } from './context'
import { ModalWindowContext } from '../shared/components/modalWindow/context'
import { openModal, closeModal } from '../shared/utils/utility'

const failedDownloadingGraphics = '画像の読み込みに失敗しました'
const failedUploadingGraphics = '画像のアップロードに失敗しました'

export default props => {
    const [graphics, setGraphics] = useState([])
    const [selectedGraphicIDs, setSelectedGraphicIDs] = useState([])
    const { isCreating, setIsCreating } = useContext(
        LessonGraphicCreatingContext
    )
    const modalWindow = useContext(ModalWindowContext)

    useEffect(() => {
        fetchGraphics()
            .then(graphics => {
                setGraphics(graphics)
            })
            .catch(err => {
                openModal(modalWindow, {
                    title: failedDownloadingGraphics,
                    message: err.message,
                    onClose: () => {
                        closeModal(modalWindow)
                        location.reload()
                    }
                })
            })
    }, [])

    const handleGraphicChange = useCallback(async event => {
        const changedID = event.target.value
        const isChecked = event.target.checked
        await setSelectedGraphicIDs(ids => {
            const newIds = isChecked
                ? [...ids, changedID]
                : ids.filter(id => {
                    return id != changedID
                })
            props.onGraphicsChange(newIds)
            return newIds
        })
    }, [])

    const onDrop = useCallback(async acceptedFiles => {
        if (isCreating) return
        if (acceptedFiles.lenth === 0) return

        setIsCreating(true)

        await uploadGraphics(acceptedFiles)
            .then(newGraphics => {
                setGraphics(graphics => graphics.concat(newGraphics))
                setIsCreating(false)
            })
            .catch(err => {
                setIsCreating(false)
                openModal(modalWindow, {
                    title: failedUploadingGraphics,
                    message: err.message,
                    onClose: () => {
                        closeModal(modalWindow)
                    }
                })
            })
    }, [])

    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        onDrop
    })

    return (
        <GraphicManagerContainer className="app-back-color-dark-gray">
            <GraphicScrollList>
                {graphics.map((graphic, i) => {
                    const isSelected = selectedGraphicIDs.includes(graphic.id)
                    return (
                        <GraphicLabel
                            key={i}
                            className={
                                isSelected
                                    ? selectedElementStyle
                                    : unselectElementStyle
                            }
                        >
                            <GraphicThumbnail src={graphic.thumbnailURL} />
                            <GraphicSelector
                                type="checkbox"
                                value={graphic.id}
                                checked={isSelected}
                                onChange={handleGraphicChange}
                            />
                        </GraphicLabel>
                    )
                })}
            </GraphicScrollList>
            <GraphicUploader className={isCreating ? 'd-none' : 'd-block'}>
                <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <span className="app-text-color-soft-white">
                        <UploadIcon>
                            <FontAwesomeIcon icon="folder-plus" />
                        </UploadIcon>
                        <UploadIconLabel>&nbsp;追加</UploadIconLabel>
                    </span>
                </div>
            </GraphicUploader>
            <UploadingStatus
                className={`app-text-color-soft-white ${
                    isCreating ? 'd-block' : 'd-none'
                }`}
            >
                <FontAwesomeIcon icon="spinner" spin />
            </UploadingStatus>
        </GraphicManagerContainer>
    )
}

const GraphicManagerContainer = styled.div`
    position: relative;
`

const GraphicScrollList = styled.div`
    position: relative;
    width: 600px;
    height: 250px;
    padding: 15px;
    overflow-y: scroll;
    &::-webkit-scrollbar {
        display: none;
    }
`

const selectedElementStyle = css`
    border: solid 6px #ec9f05;
`

const unselectElementStyle = css`
    border: 6px solid rgba(0, 0, 0, 0);
`

const GraphicLabel = styled.label`
    position: relative;
    margin-right: 10px;
    cursor: pointer;
    width: 122px;
    height: 122px;
`

const GraphicSelector = styled.input`
    display: none;
`

const GraphicThumbnail = styled.img`
    position: absolute;
    margin: auto;
    width: 110px;
    height: 110px;
    object-fit: contain;
`

const GraphicUploader = styled.div`
    position: absolute;
    width: 200px;
    height: 20px;
    right: 20px;
    bottom: 20px;
    cursor: pointer;
    text-align: right;
    &:hover {
        opacity: 0.7;
    }
`

const UploadIcon = styled.span`
    font-size: 25px;
`

const UploadIconLabel = styled.span`
    padding-left: 10px;
    font-size: 15px;
`

const UploadingStatus = styled.div`
    position: absolute;
    width: 40px;
    height: 40px;
    font-size: 40px;
    top: 200px;
    right: 30px;
`
