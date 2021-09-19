import React from 'react'
import { event } from '../libs/gtag'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
  }

  static getDerivedStateFromError(error) {
    console.error(error)
    return { hasError: true }
  }

  componentDidCatch(error) {
    this.props.showError(
      {
        side: 'global',
        message: '予期せぬエラーが発生しました。',
        original: error,
        canDismiss: false,
        callback: () => { window.location.reload() },
        callbackName: '再読込',
      }
    )

    event('error', 'unknown', error.message, 1)
  }

  render() {
    return this.props.children
  }
}
