/** @jsxImportSource @emotion/react */
import React, { useRef } from 'react'
import { css } from '@emotion/core'

export default function LessonRecordImageController({ setImageIndex, images, uploadImages, hasDragOver }) {
  const inputFileRef = useRef(null)

  function handleDragOver() {
    // 表示変える
  }

  function handleDragLeave() {

  }

  function handleDrop(e) {
    uploadImages(e.dataTransfer.files)
  }

  function handleChangeFile(e) {
    uploadImages(e.target.files)
    e.target.value = '' // ここでリセットしちゃって大丈夫？
  }

  function handleUploadButtonClick() {
    inputFileRef.current.click()
  }

  // onAnimationEnd

  const wideUploadButtonStyle = css({
    display: 'block',
    width: '600px',
    height: '60px',
    backgroundColor: hasDragOver ? 'var(--dark-purple)' : 'inherited',
    margin: 'auto',
    cursor: 'pointer',
    color: 'white',
    border: '2px var(--border-gray) dashed',
    borderStyle: 'dashed',
    [':hover']: {
      background: 'var(--dark-purple)',
    },
    ['>img']: {
      verticalAlign: 'middle',
      marginRight: '30px',
    },
    ['>span']: {
      fontSize: '15px',
      lineHeight: '15px',
      verticalAlign: 'middle',
    },
  })

  return (
    <div css={bodyStyle}>
      <div css={controllerStyle}>
        <input type="file" accept="image/jpeg,image/png,image/gif,image/svg" multiple={true} onChange={handleChangeFile} css={inputFileStyle} ref={inputFileRef} />
        {
          images.length === 0 && <div css={wideUploadAreaStyle} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
            <button css={wideUploadButtonStyle} onClick={handleUploadButtonClick}>
              <img src="/img/icon/photo-upload.svg" css={uploadIconStyle} />
              <span>画像をアップロードして、授業内で表示できます。</span>
            </button>
          </div>
        }
        {images.length > 0 && images.map((image) =>
          <img src={image.url} key={image.key} />
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
  margin: 'auto',
})

const wideUploadAreaStyle = css({
  paddingTop: '30px',
})

const uploadIconStyle = css({
  width: '40px',
  height: 'auto',
})

const inputFileStyle = css({
  display: 'none',
})