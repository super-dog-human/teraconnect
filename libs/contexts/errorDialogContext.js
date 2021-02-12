import React, { useState, useContext } from 'react'

const ErrorDialogContext = React.createContext({
  error: {},
  setError: () => {},
})

const ErrorDialogProvider = ({ children }) => {
  const errors = []
  const [error, setError] = useState()

  function showError(err) {
    errors.push(err)
    setError(errors[0])
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