export default function useSpeechTextEdit(setConfig) {
  function setSubtitle(e) {
    setConfig(config => {
      config.subtitle = e.target.value
      return { ...config }
    })
  }

  function setBody(e) {
    setConfig(config => {
      config.caption.body = e.target.value
      return { ...config }
    })
  }

  function setBodyColor(color) {
    setConfig(config => {
      config.caption.bodyColor = color
      return { ...config }
    })
  }

  function setBorderColor(color) {
    setConfig(config => {
      config.caption.borderColor = color
      return { ...config }
    })
  }

  function setHorizontalAlign(align) {
    setConfig(config => {
      config.caption.horizontalAlign = align
      return { ...config }
    })
  }

  function setVerticalAlign(align) {
    setConfig(config => {
      config.caption.verticalAlign = align
      return { ...config }
    })
  }

  return { setSubtitle, setBody, setBodyColor, setBorderColor, setHorizontalAlign, setVerticalAlign }
}