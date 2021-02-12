import React, { useState, useContext } from 'react'

const ErrorDialogContext = React.createContext({
  error: {},
  setError: () => {},
  resolveError: () => {},
})

const errors = []

const ErrorDialogProvider = ({ children }) => {
  const [error, setError] = useState()

  function showError(err) {
    errors.push(err)
    setError(errors[0])
    // gtag
  }

  function resolveError() {
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

export { ErrorDialogProvider, useErrorDialogContext }