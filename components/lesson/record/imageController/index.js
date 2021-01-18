/** @jsxImportSource @emotion/react */
import React, { useRef } from 'react'
import { css } from '@emotion/core'
import useImageUploader from '../../../../libs/hooks/lesson/record/useImageUploader'
import ImageUploadButton from './imageUploadButton'
import ScrollArrow from './scrollArrow'
import SelectorThumbnail from './selectorThumbnail'
import DragSwappable from '../../../dragSwappable'

export default function LessonRecordImageController({ id, token, images, setImages, setImageIndex, moveImage, hasDragOver }) {
  const inputFileRef = useRef(null)
  const { handleDragOver, handleDragLeave, handleDrop, handleChangeFile, handleUploadButtonClick } =
    useImageUploader(id, token, setImages, inputFileRef)

  return (
    <div css={bodyStyle}>
      <div css={controllerStyle}>
        <input type="file" accept="image/jpeg,image/png,image/gif,image/svg" multiple={true}
          onChange={handleChangeFile} css={inputFileStyle} ref={inputFileRef} />

        {images.length === 0 && (
          <ImageUploadButton hasDragOver={hasDragOver} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
            onDrop={handleDrop} onClick={handleUploadButtonClick} />
        )}

        {images.length > 0 && (
          <div css={selectorStyle}>
            <ScrollArrow direction="left" />
            <div css={thumbnailsStyle}>
              <DragSwappable onSwap={moveImage}>
                {images.map((image, i) =>
                  <SelectorThumbnail src={image.src} key={image.key} onClick={setImageIndex} data-index={i} />
                )}
              </DragSwappable>
            </div>
            <ScrollArrow direction="right" />
          </div>
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

const selectorStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '100%',
})

const thumbnailsStyle = css({
//  display: 'fixed',
//  height: '100%',
})