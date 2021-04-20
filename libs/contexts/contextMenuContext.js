import React, { useState, useContext } from 'react'

const ContextMenuContext = React.createContext({
  contextMenu: {},
  setContextMenu: () => {},
  handleDismiss: () => {},
})

const ContextMenuProvider = ({ children }) => {
  const [contextMenu, setContextMenu] = useState({})

  function handleDismiss() {
    setContextMenu({})
  }

  return (
    <ContextMenuContext.Provider value={{ contextMenu, setContextMenu, handleDismiss }}>
      {children}
    </ContextMenuContext.Provider>
  )
}

const useContextMenuContext = () => useContext(ContextMenuContext)

export { ContextMenuProvider, useContextMenuContext }