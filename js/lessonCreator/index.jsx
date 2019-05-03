import React, { useCallback, useContext, useEffect, useState } from 'react'
import { __RouterContext } from 'react-router-dom'
import styled from '@emotion/styled'
import ReactTooltip from 'react-tooltip'
import GraphicManager from './graphicManager'
import AvatarManager from './avatarManager'
import {
    LessonGraphicCreatingContext,
    LessonAvatarCreatingContext
} from './context'
import { IndicatorContext } from '../shared/components/indicator/context'
import { ModalWindowContext } from '../shared/components/modalWindow/context'
import { postLesson } from '../shared/utils/networkManager'
import {
    canRecordLessonBrowser,
    sendExceptionToGA,
    showLoading,
    hideLoading,
    openModal,
    closeModal
} from '../shared/utils/utility'

// メッセージ定数はreact-intl導入時にここから追い出す
const mobileWarningTitle = '非対応の環境です'
const mobileWarningMessage =
    '・授業はChrome/Firefox/Operaで作成できます\n・モバイル環境では授業を作成できません\n'
const creatingLessonErrorTitle = '授業の作成に失敗しました'

let title = ''
let description = ''
let avatarID = ''
let graphicIDs = []

export default () => {
    const [isFormCreatable, setIsFormCreatable] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [isGraphicCreating, setIsGraphicCreating] = useState(false)
    const [isAvatarCreating, setIsAvatarCreating] = useState(false)
    const indicator = useContext(IndicatorContext)
    const modalWindow = useContext(ModalWindowContext)
    const router = useContext(__RouterContext)

    useEffect(() => {
        if (!canRecordLessonBrowser()) {
            openModal(modalWindow, {
                title: mobileWarningTitle,
                message: mobileWarningMessage,
                onClose: () => {
                    closeModal(modalWindow)
                    router.history.replace('/')
                }
            })
        }

        if (isCreating) {
            showLoading(indicator)
        } else {
            hideLoading(indicator)
        }
    }, [isCreating])

    const handleChangeTitle = useCallback(event => {
        title = event.target.value
        switchCreatableForm()
    }, [])

    const handleChangeDescription = useCallback(event => {
        description = event.target.value
    }, [])

    const handleChangeAvatar = useCallback(id => {
        avatarID = id
        switchCreatableForm()
    }, [])

    const handleChangeGraphics = useCallback(ids => {
        graphicIDs = ids
    }, [])

    const switchCreatableForm = useCallback(() => {
        const isFormCreatable = title.length > 0 && avatarID !== ''
        setIsFormCreatable(isFormCreatable)
    }, [])

    const handleFormSubmit = useCallback(event => {
        event.preventDefault()

        setIsCreating(true)

        const lessonBody = {
            title: title,
            description: description,
            avatarID: avatarID,
            graphicIDs: graphicIDs
        }

        postLesson(lessonBody)
            .then(lesson => {
                afterPostLesson(lesson.id)
            })
            .catch(err => {
                sendExceptionToGA(constructor.name, err, false)
                openModal(modalWindow, {
                    title: creatingLessonErrorTitle,
                    message: err.message,
                    onClose: () => {
                        closeModal(modalWindow)
                        setIsCreating(false)
                    }
                })
            })
    }, [])

    const afterPostLesson = useCallback(lessonID => {
        const interval = setInterval(() => {
            if (!isGraphicCreating && !isAvatarCreating) {
                setIsCreating(false)
                clearInterval(interval)
                router.history.push(`/lessons/${lessonID}/record`)
            }
        }, 1000)
    }, [])

    return (
        <>
            <LessonCreatorContainer className="app-back-color-soft-white">
                <LessonForm onSubmit={handleFormSubmit}>
                    <LessonTitle onChange={handleChangeTitle} />
                    <LessonDescription onChange={handleChangeDescription} />
                    <LessonGraphicCreatingContext.Provider
                        value={{
                            isCreating: isGraphicCreating,
                            setIsCreating: isCreating => {
                                setIsGraphicCreating(isCreating)
                            }
                        }}
                    >
                        <LessonGraphic
                            onGraphicsChange={handleChangeGraphics}
                        />
                    </LessonGraphicCreatingContext.Provider>
                    <LessonAvatarCreatingContext.Provider
                        value={{
                            isCreating: isAvatarCreating,
                            setIsCreating: isCreating => {
                                setIsAvatarCreating(isCreating)
                            }
                        }}
                    >
                        <LessonAvatar onAvatarChange={handleChangeAvatar} />
                    </LessonAvatarCreatingContext.Provider>
                    <SubmitButton disabled={!isFormCreatable || isCreating} />
                </LessonForm>
                <ReactTooltip className="tooltip" place="top" type="warning" />
            </LessonCreatorContainer>
        </>
    )
}

const LessonCreatorContainer = styled.div`
    padding-top: 50px;
    padding-bottom: 100px;
`

const LessonForm = styled.form`
    width: 80%;
    max-width: 600px;
    margin: auto;
`

const ButtonWithTopMargin = styled.button`
    margin-top: 30px;
`

const SubmitButton = ({ disabled }) => (
    <ButtonWithTopMargin
        type="submit"
        className="btn btn-primary btn-lg"
        disabled={disabled}
    >
        作成
    </ButtonWithTopMargin>
)

const FormLabel = ({ body, isRequired = false }) => {
    const requireSymbol = <span className="text-danger">&nbsp;*</span>
    const label = (
        <label
            htmlFor="lesson-title"
            className="app-text-color-dark-gray font-weight-bold"
        >
            {body}
            {isRequired ? requireSymbol : ''}
        </label>
    )
    return label
}

const LessonTitle = ({ onChange }) => (
    <div className="form-group">
        <FormLabel body="タイトル" isRequired={true} />
        <input
            type="text"
            className="form-control"
            onChange={event => onChange(event)}
            required
        />
    </div>
)

const LessonDescription = ({ value, onChange }) => (
    <div className="form-group">
        <FormLabel body="説明" />
        <textarea
            className="form-control"
            rows="3"
            value={value}
            onChange={onChange}
        />
    </div>
)

const LessonGraphic = props => (
    <div className="form-group" data-tip="選択した順で画像が使用できます">
        <FormLabel body="メディア" />
        <GraphicManager {...props} />
    </div>
)

const LessonAvatar = props => (
    <div className="form-group">
        <FormLabel body="アバター" isRequired={true} />
        <AvatarManager {...props} />
    </div>
)
