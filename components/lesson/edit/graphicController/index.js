/** @jsxImportSource @emotion/react */
import React, { useRef } from 'react'
import { css } from '@emotion/core'
import Spacer from '../../../spacer'
import ThumbnailController from './thumbnailController'
import InputFile from '../../../form/inputFile'
import useGraphicController from '../../../../libs/hooks/lesson/edit/useGraphicController'
import { useLessonEditorContext } from '../../../../libs/contexts/lessonEditorContext'
import { useDialogContext } from '../../../../libs/contexts/dialogContext'

export default function LessonEditGraphicController() {
  const inputFileRef = useRef()
  const targetGraphicID = useRef('')
  const { setGraphics, graphicURLs, setGraphicURLs } = useLessonEditorContext()
  const { swapGraphic, removeGraphic } = useGraphicController({ setGraphics, setGraphicURLs })
  const { showDialog } = useDialogContext()

  function uploadNewImage(currentGraphicID) {
    targetGraphicID.current = currentGraphicID
    inputFileRef.current.click()
  }

  function confirmSwappingGraphic(e) {
    if (e.target.files.length === 0) return // 画像を選択せずに閉じた場合は何もしない

    showDialog({
      title: '差し替えの確認',
      message: '選択した画像で差し替えますか？',
      canDismiss: true,
      dismissName: 'キャンセル',
      callbackName: '差し替える',
      callback: () => {
        swapGraphic(targetGraphicID.current, e.target.files[0])
        inputFileRef.current.value = ''
      },
      dismissCallback: () => {
        inputFileRef.current.value = ''
      },
    })
  }

  function confirmRemovingGraphic(currentGraphicID) {
    showDialog({
      title: '削除の確認',
      message: '画像を完全に削除しますか？',
      canDismiss: true,
      dismissName: 'キャンセル',
      callbackName: '削除',
      callback: () => removeGraphic(currentGraphicID),
    })
  }

  return (
    <div css={bodyStyle}>
      <Spacer height='70' />
      <div css={headerStyle}>
        <hr />
      </div>
      <div css={containerStyle}>
        {Object.keys(graphicURLs).map(key => (
          <div css={thumbnailStyle} key={key}>
            <ThumbnailController graphicID={key} url={graphicURLs[key]} swapGraphic={uploadNewImage} removeGraphic={confirmRemovingGraphic} />
          </div>
        ))}
      </div>
      <div>
        <InputFile accept="image/jpeg,image/png,image/gif" onChange={confirmSwappingGraphic} ref={inputFileRef} />
      </div>
    </div>
  )
}

const bodyStyle = css({
  height: 'calc(100% - 253px - 45px - 70px)', // 自身の上に存在する要素分を差し引く
})

const headerStyle = css({
  height: '50px',
  fontSize: '14px',
  textAlign: 'center',
  color: 'gray',
})

const containerStyle = css({
  height: 'calc(100% - 50px)',
  overflowX: 'scroll',
  display: 'flex',
  alignContent: 'flex-start',
  flexWrap: 'wrap',
})

const thumbnailStyle = css({
  flex: 'calc(50% - 40px) 0',
  margin: '20px',
})