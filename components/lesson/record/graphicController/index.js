/** @jsxImportSource @emotion/react */
import React, { useRef } from 'react'
import { css } from '@emotion/core'
import { Container, Row, Col } from 'react-grid-system'
import useImageUploaderBar from '../../../../libs/hooks/lesson/record/useImageUploaderBar'
import useImageControllerBar from '../../../../libs/hooks/lesson/record/useImageControllerBar'
import { useLessonRecorderContext } from '../../../../libs/contexts/lessonRecorderContext'
import InputFile from '../../../form/inputFile'
import UploadingWideButton from './uploadingWideButton'
import UploadingButton from './uploadingButton'
import ScrollArrow from './scrollArrow'
import SelectorThumbnail from './selectorThumbnail'
import DragSwappable from '../../../dragSwappable'
import { SUPPORTED_IMAGE_FILES } from '../../../../libs/constants'

export default function LessonRecordGraphicController({ lessonID, setSelectedGraphic, initialGraphics, hasDragOver, isTouchDevice }) {
  const selectImageBarRef = useRef(null)
  const inputFileRef = useRef(null)
  const { imageID, selectImage, removeImage, images, setImages, moveImage } = useImageControllerBar({ initialGraphics, setSelectedGraphic })
  const { handleDragOver, handleDragLeave, handleDrop, handleFileChange, handleUploadButtonClick } = useImageUploaderBar(lessonID, images, setImages, inputFileRef, selectImageBarRef)
  const { isFinishing } = useLessonRecorderContext()

  return (
    <div css={bodyStyle}>
      <div css={controllerStyle}>
        <InputFile accept={SUPPORTED_IMAGE_FILES} multiple={true} onChange={handleFileChange} ref={inputFileRef} />

        {images.length === 0 && (
          <UploadingWideButton hasDragOver={hasDragOver} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
            onDrop={handleDrop} onClick={handleUploadButtonClick} disabled={isFinishing} isTouchDevice={isTouchDevice} />
        )}

        {images.length > 0 && (
          <Container fluid>
            <Row>
              <Col sm={1}></Col>
              <Col sm={1} css={centeringStyle}>
                <ScrollArrow direction="left" targetRef={selectImageBarRef} />
              </Col>
              <Col sm={8}>
                <div css={selectImageBarStyle} ref={selectImageBarRef}>
                  <DragSwappable onDragOver={moveImage} isSwapImmediately={true}>
                    {images.map((image, i) =>
                      <SelectorThumbnail image={image} key={i} onClick={selectImage} onRemoveClick={removeImage} isSelected={image.id === imageID} isFinishing={isFinishing} isTouchDevice={isTouchDevice} />
                    )}
                  </DragSwappable>
                </div>
              </Col>
              <Col sm={1} css={centeringStyle}>
                <ScrollArrow direction="right" targetRef={selectImageBarRef} isTouchDevice={isTouchDevice} />
              </Col>
              <Col sm={1} css={centeringStyle}>
                <UploadingButton onClick={handleUploadButtonClick} disabled={isFinishing} isTouchDevice={isTouchDevice} />
              </Col>
            </Row>
          </Container>
        )}
      </div>
    </div>
  )
}

const bodyStyle = css({
  width: '100%',
  height: '120px',
  backgroundColor: 'gray',
})

const controllerStyle = css({
  maxWidth: '1280px',
  height: '100%',
  margin: 'auto',
})

const centeringStyle = css({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  height: '120px',
})

const selectImageBarStyle =css({
  overflowX: 'scroll',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  scrollbarWidth: 'none',
  display: 'flex',
  scrollBehavior: 'auto', // smoothにするとChromeでJSからのscrollが動かなくなる
  flexDirection: 'row',
  alignItems: 'center',
  height: '120px',
})