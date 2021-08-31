import { useCallback } from 'react'

export default function useSpeechTextEditor(dispatchConfig) {
  function setSubtitle(e) {
    dispatchConfig({ type: 'subtitle', payload: e.target.value })
  }

  function setBody(e) {
    dispatchConfig({ type: 'captionBody', payload: e.target.value })
  }

  const setBodyColor = useCallback(color => {
    dispatchConfig({ type: 'captionBodyColor', payload: color })
  }, [dispatchConfig])

  const setBorderColor = useCallback(color => {
    dispatchConfig({ type: 'captionBorderColor', payload: color })
  }, [dispatchConfig])

  function setHorizontalAlign(align) {
    dispatchConfig({ type: 'captionHorizontalAlign', payload: align })
  }

  function setVerticalAlign(align) {
    dispatchConfig({ type: 'captionVerticalAlign', payload: align })
  }

  return { setSubtitle, setBody, setBodyColor, setBorderColor, setHorizontalAlign, setVerticalAlign }
}