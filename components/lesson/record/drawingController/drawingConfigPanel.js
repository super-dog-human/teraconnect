/** @jsxImportSource @emotion/react */
import React, { useState } from 'react'
import { css } from '@emotion/core'
import Vr from '../../../Vr'
import Spacer from '../../../spacer'
import FullScreenContainer from '../../../fullscreenContainer'
import Container from '../../../container'
import Flex from '../../../flex'
import ColorPicker from '../../../colorPicker'
import DrawingSortDownButton from './drawingSortDownButton'
import DrawingConfigButton from './drawingConfigButton'
import DrawingLineSelector from './drawingLineWidthSelector'
import 'react-colorful/dist/index.css'

export default function DrawingConfigPanel({ disabled, color, setColor, lineWidth, setLineWidth, enablePen, handlePen, enableEraser, handleEraser }) {
  const [showDrawingConfig, setShowDrawingConfig] = useState(false)
  const [panelPosition, setPanelposition] = useState({ top: 0, left: 0 })

  function handleShowPanel(e) {
    if (showDrawingConfig) {
      setShowDrawingConfig(false)
    } else {
      setPanelposition({ top: e.nativeEvent.pageY + 20, left: e.nativeEvent.pageX - 30 })
      setShowDrawingConfig(true)
    }
  }

  function handleWidthChange(e) {
    setLineWidth(e.target.dataset.width)
  }

  const contextMenuStyle = css({
    position: 'absolute',
    top: panelPosition.top + 10,
    left: panelPosition.left + 10,
    borderRadius: '5px',
    width: '180px',
    height: '250px',
    backgroundColor: 'var(--dark-gray)',
    filter: 'drop-shadow(2px 2px 2px gray)',
  })

  return (
    <>
      <DrawingSortDownButton onMouseDown={handleShowPanel} disabled={disabled} />
      <FullScreenContainer position='absolute' display={showDrawingConfig ? 'block' : 'none'}>
        <div css={backgroundStyle} onClick={handleShowPanel}>
          <div css={contextMenuStyle} onClick={e => e.stopPropagation()} >
            <Flex>
              <Container width='50'>
                <Flex justifyContent='center'>
                  <Container width='28'>
                    <Spacer height='20' />
                    <DrawingConfigButton name='drawing' isSelected={enablePen} onClick={handlePen}/>
                    <Spacer height='20' />
                    <DrawingConfigButton name='eraser' isSelected={enableEraser} onClick={handleEraser} />
                  </Container>
                </Flex>
              </Container>
              <Container height='250'>
                <Vr height='220px' color='var(--border-gray)' />
              </Container>
              <Spacer width='20' />
              <Container width='120'>
                <Spacer height='20' />
                <Container width='100'>
                  <DrawingLineSelector height='2' lineWidth='5' selected={lineWidth === '5'} onClick={handleWidthChange} />
                  <DrawingLineSelector height='4' lineWidth='10' selected={lineWidth === '10'} onClick={handleWidthChange} />
                  <DrawingLineSelector height='7' lineWidth='20' selected={lineWidth === '20'} onClick={handleWidthChange} />
                </Container>
                <Spacer height='20' />
                {!enableEraser &&
                  <ColorPicker initialColor={color} size='100' onChange={setColor} />
                }
              </Container>
            </Flex>
          </div>
        </div>
      </FullScreenContainer>
    </>
  )
}

const backgroundStyle = css({
  width: '100%',
  height: '100%',
})