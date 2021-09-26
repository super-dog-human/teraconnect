import React, { useState, useCallback, useContext } from 'react'
import { event } from '../gtag'

const ErrorDialogContext = React.createContext({
  error: {},
  setError: () => {},
  resolveError: () => {},
})

const errors = []

const ErrorDialogProvider = ({ children }) => {
  const [error, setError] = useState()

  const showError = useCallback(err => {
    errors.push(err)
    setError(errors[0])
    event('error', 'expected', err.message, 1)
  }, [])

  async function resolveError(callback) {
    if (callback) await callback()

    errors.shift()
    setError(errors[0])
  }

  return (
    <ErrorDialogContext.Provider value={{ error, showError, resolveError }}>
      {children}
    </ErrorDialogContext.Provider>
  )
}

const useErrorDialogContext = () => useContext(ErrorDialogContext)

export { ErrorDialogContext, ErrorDialogProvider, useErrorDialogContext }