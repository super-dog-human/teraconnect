/** @jsxImportSource @emotion/react */
import React from 'react'
import ReactDOM from 'react-dom'
import { css } from '@emotion/core'
import AvatarLoader from '../../libs/avatar/loader'
import { Clock } from 'three'

export default class AloneAvatar extends React.Component {
  constructor(props) {
    super(props)
    this.container
    this.clock = new Clock()
    this.state = {
      avatarLoader: new AvatarLoader()
    }
  }

  async componentDidMount() {
    const dom = await this.state.avatarLoader.render(
      '/model/alone.vrm',
      this.container
    )
    this.state.avatarLoader.setLightColor(0x888888)
    this.state.avatarLoader.setForLandscape()
    this.state.avatarLoader.setDefaultAnimation()
    this.state.avatarLoader.initAnimationPlaying()
    this.state.avatarLoader.play()
    this.animate()
    ReactDOM.findDOMNode(this.container).append(dom)

    addEventListener('resize', () => {
      this.state.avatarLoader.updateSize(this.container)
    })
  }

  animate() {
    this.state.avatarLoader.animate(this.clock.getDelta())
    requestAnimationFrame(() => this.animate())
  }

  componentWillUnmount() {
    if (this.avatarLoader) this.avatarLoader.clearBeforeUnload()
  }

  render() {
    return (
      <div css={bodyStyle}>
        <div
          css={canvasStyle}
          ref={e => {
            this.container = e
          }}
        ></div>
      </div>
    )
  }
}

const bodyStyle = css({
  width: '100%',
  height: '100%',
  textAlign: 'center'
})

const canvasStyle = css({
  width: 'auto',
  minWidth: '800px',
  height: '450px',
  animation: 'fadeIn 2s ease 0s 1 normal'
})
