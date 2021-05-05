import React, { useState, useContext } from 'react'

const DialogContext = React.createContext({
  dialog: null,
  isProcessing: false,
  showDialog: () => {},
  dismissDialog: () => {},
})

const DialogProvider = ({ children }) => {
  const [dialog, setDialog] = useState()
  const [isProcessing, setIsProcessing] = useState(false)

  function showDialog(dialog) {
    setDialog(dialog)
  }

  async function dismissDialog(callback) {
    setIsProcessing(true)
    if (callback) await callback()
    setIsProcessing(false)
    setDialog()
  }

  return (
    <DialogContext.Provider value={{ dialog, isProcessing, showDialog, dismissDialog }}>
      {children}
    </DialogContext.Provider>
  )
}

const useDialogContext = () => useContext(DialogContext)

export { DialogProvider, useDialogContext }