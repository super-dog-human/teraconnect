/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react'
import Draggable from 'react-draggable'
import FullscreenContainer from '../../../fullscreenContainer'
import { css } from '@emotion/core'
import NewLine from './newLine/'
import Avatar from './avatar/'
import Drawing from './drawing/'
import Graphic from './graphic/'
import Music from './music/'
import Speech from './speech/'
import { useLessonEditorContext } from '../../../../libs/contexts/lessonEditorContext'

export default function LineConfig({ config }) {
  const[isShow, setIsShow] = useState(false)
  const { deleteLine } = useLessonEditorContext()

  function handleClose() {
    setIsShow(false)
    if (config.action !== 'newLine' && config.isPending) {
      deleteLine(config.action, config.index, config.line.elapsedTime)
    }
    config.closeCallback()
  }

  useEffect(() => {
    if (Object.keys(config).length > 0) {
      setIsShow(true)
    } else {
      setIsShow(false)
    }
  }, [config])

  const dialogStyle = css({
    backgroundColor: 'var(--dark-gray)',
    position: 'absolute',
    top: '30%',
    left: 'calc(50% - 100px)',
    borderRadius: '5px',
    filter: 'drop-shadow(2px 2px 2px gray)',
    width: '80%',
    maxWidth: config.action === 'newLine' ? '600px' : '700px',
  })

  return (
    <>
      {isShow && <FullscreenContainer position='fixed' zKind='modal-panel'>
        <Draggable handle=".drag-handle">
          <div css={dialogStyle}>
            {config.action === 'newLine' && <NewLine elapsedTime={config.elapsedTime} closeCallback={handleClose} /> }
            {config.action === 'avatar'  && <Avatar  index={config.index} initialConfig={config.line} closeCallback={handleClose} />}
            {config.action === 'drawing' && <Drawing index={config.index} initialConfig={config.line} closeCallback={handleClose} />}
            {config.action === 'graphic' && <Graphic index={config.index} initialConfig={config.line} closeCallback={handleClose} />}
            {config.action === 'music'   && <Music   index={config.index} initialConfig={config.line} closeCallback={handleClose} />}
            {config.action === 'speech'  && <Speech  index={config.index} initialConfig={config.line} closeCallback={handleClose} />}
          </div>
        </Draggable>
      </FullscreenContainer>}
    </>
  )
}