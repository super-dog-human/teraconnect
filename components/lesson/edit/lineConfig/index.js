/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react'
import Draggable from 'react-draggable'
import FullscreenContainer from '../../../fullscreenContainer'
import { css } from '@emotion/react'
import NewLine from './newLine/'
import Avatar from './avatar/'
import Drawing from './drawing/'
import Embedding from './embedding/'
import Graphic from './graphic/'
import Music from './music/'
import Speech from './speech/'
import { useLessonEditorContext } from '../../../../libs/contexts/lessonEditorContext'

export default function LineConfig({ lineConfig, setLineConfig, isTouchDevice }) {
  const[isShow, setIsShow] = useState(false)
  const { deleteLine } = useLessonEditorContext()

  function handleClose(hasCancelled) {
    setIsShow(false)
    if (hasCancelled && lineConfig.isPending) {
      deleteLine(lineConfig.action, lineConfig.index, lineConfig.line.elapsedTime)
    }
    setLineConfig({})
  }

  useEffect(() => {
    if (Object.keys(lineConfig).length > 0) {
      setIsShow(true)
    } else {
      setIsShow(false)
    }
  }, [lineConfig])

  const dialogStyle = css({
    backgroundColor: 'var(--dark-gray)',
    position: 'absolute',
    top: '20%',
    left: lineConfig.action === 'newLine' ? 'calc(50% - 300px)' : 'calc(50% - 350px)',
    borderRadius: '5px',
    width: lineConfig.action === 'newLine' ? '600px' : '700px',
    touchAction: 'none',
    filter: 'drop-shadow(2px 2px 2px gray)',
    willChange: 'filter', // safariの描画ゴミ抑止のためGPUを使用する
  })

  return (
    <>
      {isShow && <FullscreenContainer position='fixed' zKind='modal-panel'>
        <Draggable handle=".drag-handle">
          <div css={dialogStyle}>
            {lineConfig.action === 'newLine'   && <NewLine elapsedTime={lineConfig.elapsedTime} setLineConfig={setLineConfig} isTouchDevice={isTouchDevice} /> }
            {lineConfig.action === 'avatar'    && <Avatar    index={lineConfig.index} initialConfig={lineConfig.line} closeCallback={handleClose} />}
            {lineConfig.action === 'drawing'   && <Drawing   index={lineConfig.index} initialConfig={lineConfig.line} closeCallback={handleClose} />}
            {lineConfig.action === 'embedding' && <Embedding index={lineConfig.index} initialConfig={lineConfig.line} closeCallback={handleClose} />}
            {lineConfig.action === 'graphic'   && <Graphic   index={lineConfig.index} initialConfig={lineConfig.line} closeCallback={handleClose} />}
            {lineConfig.action === 'music'     && <Music     index={lineConfig.index} initialConfig={lineConfig.line} closeCallback={handleClose} />}
            {lineConfig.action === 'speech'    && <Speech    index={lineConfig.index} initialConfig={lineConfig.line} closeCallback={handleClose} />}
          </div>
        </Draggable>
      </FullscreenContainer>}
    </>
  )
}