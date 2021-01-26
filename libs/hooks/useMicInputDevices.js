import { useState, useEffect } from 'react'

export default function useMicInputDevices() {
  const [devices, setDevices] = useState([])

  function requestMicPermission() {
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    }).then(() => {
      navigator.mediaDevices.enumerateDevices()
        .then(allDevices => {
          setDevices(allDevices.filter(d => d.kind === 'audioinput'))
        })
        .catch((e) => console.error(e))
    }).catch(e => {
      // マイクの使用が制限されているか、見つかりませんでした。
      // useContextでエラーダイアログ出す
      console.error(e)
    })
  }

  useEffect(() => {
    requestMicPermission()
  }, [])

  return { devices, requestMicPermission }
}