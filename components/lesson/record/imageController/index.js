/** @jsxImportSource @emotion/react */
import React, { useRef } from 'react'
import { css } from '@emotion/core'
import { Container, Row, Col } from 'react-grid-system'
import useImageUploader from '../../../../libs/hooks/lesson/record/useImageUploader'
import useImageController from '../../../../libs/hooks/lesson/record/useImageController'
import ImageUploadingWideButton from './imageUploadingWideButton'
import ImageUploadingButton from './imageUploadingButton'
import ScrollArrow from './scrollArrow'
import SelectorThumbnail from './selectorThumbnail'
import DragSwappable from '../../../dragSwappable'

export default function LessonRecordImageController({ id, token, setSelectedImage, setRecord, hasDragOver }) {
  const inputFileRef = useRef(null)
  const { imageID, selectImage, images, setImages, moveImage } = useImageController(setSelectedImage, setRecord)
  const { handleDragOver, handleDragLeave, handleDrop, handleChangeFile, handleUploadButtonClick } =
    useImageUploader(id, token, setImages, inputFileRef)

  return (
    <div css={bodyStyle}>
      <div css={controllerStyle}>
        <input type="file" accept="image/jpeg,image/png,image/gif,image/svg" multiple={true}
          onChange={handleChangeFile} css={inputFileStyle} ref={inputFileRef} />

        {images.length === 0 && (
          <ImageUploadingWideButton hasDragOver={hasDragOver} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
            onDrop={handleDrop} onClick={handleUploadButtonClick} />
        )}

        {images.length > 0 && (
          <Container css={selectorBarStyle} fluid>
            <Row>
              <Col sm={1}></Col>
              <Col sm={1}>
                <ScrollArrow direction="left" />
              </Col>
              <Col sm={8}>
                <DragSwappable onSwap={moveImage} css={selectorStyle}>
                  {images.map((image, i) =>
                    <SelectorThumbnail src={image.src} key={i} data-id={image.id} onClick={selectImage} isSelected={image.id === imageID} />
                  )}
                </DragSwappable>
              </Col>
              <Col sm={1}>
                <ScrollArrow direction="right" />
              </Col>
              <Col sm={1}>
                <ImageUploadingButton onClick={handleUploadButtonClick} />
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
  backgroundColor: 'rgba(255, 255, 255, 0.6)',
})

const controllerStyle = css({
  maxWidth: '1280px',
  height: '100%',
  margin: 'auto',
})

const inputFileStyle = css({
  display: 'none',
})

const selectorBarStyle = css({
  height: '100%',
})

const selectorStyle = css({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
})

const thumbnailsStyle = css({
//  display: 'fixed',
//  height: '100%',
})