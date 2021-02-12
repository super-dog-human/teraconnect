import React from 'react'
import ErrorDialog from './index'

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
      callback: () => { console.log('try reload'); window.location.reload() },
      callbackName: '再読込',
    }

    return { error: catchedError }
  }

  componentDidCatch(error, errorInfo) {
    console.error('error: ', error)
    console.error('errorInfo', errorInfo.componentStack)
    // gtag
  }

  render() {
    if (this.state.error) {
      return <ErrorDialog error={this.state.error} />
    }

    return this.props.children
  }
}
