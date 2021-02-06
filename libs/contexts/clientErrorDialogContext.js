import React, { useState, useContext } from 'react'

const ClientErrorDialogContext = React.createContext({
  setClientError: () => {},
})

const ClientErrorDialogProvider = ({ children }) => {
  const [clientError, setClientError] = useState({})

  return (
    <ClientErrorDialogContext.Provider value={{ clientError, setClientError }}>
      {children}
    </ClientErrorDialogContext.Provider>
  )
}

const useClientErrorDialogContext = () => useContext(ClientErrorDialogContext)

export { ClientErrorDialogProvider, useClientErrorDialogContext }