/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react'
import Draggable from 'react-draggable'
import FullscreenContainer from '../../../fullscreenContainer'
import { css } from '@emotion/core'
import NewLine from './newLine/'
import Avatar from './avatar/'
import Drawing from './drawing/'
import Embedding from './embedding/'
import Graphic from './graphic/'
import Music from './music/'
import Speech from './speech/'
import { useLessonEditorContext } from '../../../../libs/contexts/lessonEditorContext'

export default function LineConfig({ lineConfig, setLineConfig }) {
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
    top: '30%',
    left: 'calc(50% - 100px)',
    borderRadius: '5px',
    filter: 'drop-shadow(2px 2px 2px gray)',
    width: '80%',
    maxWidth: lineConfig.action === 'newLine' ? '600px' : '700px',
  })

  return (
    <>
      {isShow && <FullscreenContainer position='fixed' zKind='modal-panel'>
        <Draggable handle=".drag-handle">
          <div css={dialogStyle}>
            {lineConfig.action === 'newLine'   && <NewLine elapsedTime={lineConfig.elapsedTime} setLineConfig={setLineConfig} /> }
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