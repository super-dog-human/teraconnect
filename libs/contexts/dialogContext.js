import React, { useState, useContext } from 'react'

const DialogContext = React.createContext({
  dialog: null,
  showDialog: () => {},
  dismissDialog: () => {},
})

const DialogProvider = ({ children }) => {
  const [dialog, setDialog] = useState()

  function showDialog(body) {
    setDialog(body)
  }

  function dismissDialog(callback) {
    if (callback) callback()
    setDialog()
  }

  return (
    <DialogContext.Provider value={{ dialog, showDialog, dismissDialog }}>
      {children}
    </DialogContext.Provider>
  )
}

const useDialogContext = () => useContext(DialogContext)

export { DialogProvider, useDialogContext }