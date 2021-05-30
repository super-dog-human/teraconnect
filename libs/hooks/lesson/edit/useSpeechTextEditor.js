export default function useSpeechTextEditor(dispatchConfig) {
  function setSubtitle(e) {
    dispatchConfig({ type: 'subtitle', payload: e.target.value })
  }

  function setBody(e) {
    dispatchConfig({ type: 'captionBody', payload: e.target.value })
  }

  function setBodyColor(color) {
    dispatchConfig({ type: 'captionBodyColor', payload: color })
  }

  function setBorderColor(color) {
    dispatchConfig({ type: 'captionBorderColor', payload: color })
  }

  function setHorizontalAlign(align) {
    dispatchConfig({ type: 'captionHorizontalAlign', payload: align })
  }

  function setVerticalAlign(align) {
    dispatchConfig({ type: 'captionVerticalAlign', payload: align })
  }

  return { setSubtitle, setBody, setBodyColor, setBorderColor, setHorizontalAlign, setVerticalAlign }
}