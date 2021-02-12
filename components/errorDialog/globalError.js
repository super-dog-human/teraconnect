import React from 'react'
import ErrorDialog from './index'
import { event } from '../../libs/gtag'


export default class GlobalErrorDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    const catchedError = {
      side: 'global',
      message: '予期せぬエラーが発生しました。',
      original: error,
      canDismiss: false,
      callback: () => { /* 実際にはhandleCallbackが実行される */ },
      callbackName: '再読込',
    }

    event('error', 'unknown', error.message, 1)

    return { error: catchedError }
  }

  handleCallback() {
    window.location.reload()
  }

  render() {
    if (this.state.error) {
      return <><ErrorDialog error={this.state.error} handleCallback={this.handleCallback} />{this.props.children}</>
    }

    return this.props.children
  }
}
