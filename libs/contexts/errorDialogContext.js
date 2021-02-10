import React, { useState, useContext } from 'react'

const ErrorDialogContext = React.createContext({
  error: {},
  setError: () => {},
})

const ErrorDialogProvider = ({ children }) => {
  const [error, setError] = useState({})
  return (
    <ErrorDialogContext.Provider value={{ error, setError }}>
      {children}
    </ErrorDialogContext.Provider>
  )
}

const useErrorDialogContext = () => useContext(ErrorDialogContext)

export { ErrorDialogProvider, useErrorDialogContext }