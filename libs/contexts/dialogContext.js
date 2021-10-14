import React, { useState, useContext, useCallback } from 'react'

const DialogContext = React.createContext({
  dialog: null,
  isProcessing: false,
  showDialog: () => {},
  confirmDialog: () => {},
  dismissDialog: () => {},
})

const DialogProvider = ({ children }) => {
  const [dialog, setDialog] = useState()
  const [isProcessing, setIsProcessing] = useState(false)

  const showDialog = useCallback(dialog => {
    setDialog(dialog)
  }, [])

  async function confirmDialog(isSkipConfirm) {
    setIsProcessing(true)
    setSkippingConfirm(isSkipConfirm)
    if (dialog.callback) await dialog.callback()
    setIsProcessing(false)
    setDialog()
  }

  async function dismissDialog() {
    setIsProcessing(true)
    if (dialog.dismissCallback) await dialog.dismissCallback()
    setIsProcessing(false)
    setDialog()
  }

  function setSkippingConfirm(isSkipConfirm) {
    if (!isSkipConfirm) return
    if (!dialog.skipConfirmNextTimeKey) return
    localStorage.setItem(dialog.skipConfirmNextTimeKey, 'true')
  }

  return (
    <DialogContext.Provider value={{ dialog, isProcessing, showDialog, confirmDialog, dismissDialog }}>
      {children}
    </DialogContext.Provider>
  )
}

const useDialogContext = () => useContext(DialogContext)

export { DialogProvider, useDialogContext }