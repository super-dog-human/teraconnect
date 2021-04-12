export default function useSpeechTextEdit(setConfig) {
  function setSubtitle(subtitle) {
    setConfig(config => {
      config.subtitle = subtitle
      return { ...config }
    })
  }

  function setBody(body) {
    setConfig(config => {
      config.caption.body = body
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