import React from 'react'
import { useErrorDialogContext } from '../../libs/contexts/errorDialogContext'
import ErrorDialog from './index'

export default function ClientErrorDialog() {
  const { error, resolveError } = useErrorDialogContext()

  function handleDismiss() {
    if (error.dismissCallback) error.dismissCallback()
    resolveError()
  }

  function handleCallback() {
    resolveError()
    error.callback()
  }

  return (
    <ErrorDialog error={error} handleDismiss={handleDismiss} handleCallback={handleCallback} />
  )
}
