/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import InputText from '../../../../form/inputText'
import ColorPickerCube from '../../../../colorPickerCube'
import CubeButton from '../../../../cubeButton'
import useSpeechTextEdit from '../../../../../libs/hooks/lesson/edit/useSpeechTextEdit'

export default function TextTab({ config, handleClose }) {
  const { handleChangeBodyColor, handleChangeBorderColor, handleTopAlignClick } = useSpeechTextEdit(config)

  /*
SizeVW          uint8  `json:"sizeVW"`
	Body            string `json:"body"`
	BodyColor       string `json:"bodyColor"`
	BorderColor     string `json:"borderColor"`
	HorizontalAlign string `json:"horizontalAlign"`
	VerticalAlign   string `json:"verticalAlign"`
*/

  return (
    <div css={bodyStyle}>
      <div>
        <div css={formLabelStyle}>字幕</div>
        <InputText css={inputFormStyle} key={config.subtitle} defaultValue={config.subtitle} />
        <div css={formLabelStyle}>テロップ</div>
        <InputText css={inputFormStyle} key={config.caption?.body} defaultValue={config.caption?.body} />
        <ColorPickerCube initialColor={config.caption?.bodyColor || '#ff0000'} onChange={handleChangeBodyColor} css={bodyColorPickerStyle} />
        <ColorPickerCube initialColor={config.caption?.borderColor || '#0000ff'} onChange={handleChangeBorderColor} isBorder={true} css={borderColorPickerStyle} />
        <CubeButton icon="align-left" onClick={handleTopAlignClick} css={alignButtonStyle} />
        <CubeButton icon="align-center" onClick={handleTopAlignClick} css={alignButtonStyle} />
        <CubeButton icon="align-right" onClick={handleTopAlignClick} css={alignButtonStyle} />
        <CubeButton icon="align-top" onClick={handleTopAlignClick} css={alignButtonStyle} />
        <CubeButton icon="align-middle" onClick={handleTopAlignClick} css={alignButtonStyle} />
        <CubeButton icon="align-bottom" onClick={handleTopAlignClick} css={alignButtonStyle} />
      </div>
      <div css={footerStyle}>
        <div>{'00:00:123'}</div>
        <button onClick={handleClose}>キャンセル</button>
        <button>確定</button>
      </div>
    </div>
  )
}

const bodyStyle = css({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  padding: '50px',
})

const formLabelStyle = css({
  fontSize: '13px',
  marginBottom: '3px',
  color: 'var(--soft-white)',
})

const inputFormStyle = css({
  backgroundColor: 'inherit',
  border: 'none',
  borderBottom: '1px solid var(--text-gray)',
  color: 'var(--soft-white)',
  fontSize: '18px',
  lineHeight: '18px',
  [':focus']: {
    outline: 'none',
  },
})

const bodyColorPickerStyle = css({
  width: '20px',
  height: '20px',
})

const borderColorPickerStyle = css({
  width: '20px',
  height: '20px',
})

const alignButtonStyle = css({
  width: '30px',
  height: '30px',
  padding: '5px',
  [':hover']: {
    opacity: '0.3',
  },
})

const footerStyle = css({
  marginTop: 'auto',
})
