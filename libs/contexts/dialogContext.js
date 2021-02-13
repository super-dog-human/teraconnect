import React, { useState, useContext } from 'react'

const DialogContext = React.createContext({
  dialog: null,
  showDialog: () => {},
  dismissDialog: () => {},
})

const DialogProvider = ({ children }) => {
  const [dialog, setDialog] = useState()

  function showDialog(dialog) {
    setDialog(dialog)
  }

  function dismissDialog(callback) {
    setDialog()
    if (callback) callback()
  }

  return (
    <DialogContext.Provider value={{ dialog, showDialog, dismissDialog }}>
      {children}
    </DialogContext.Provider>
  )
}

const useDialogContext = () => useContext(DialogContext)

export { DialogProvider, useDialogContext }