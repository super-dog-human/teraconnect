/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react'
import { css } from '@emotion/core'
import Select from '../../../form/select'
import useAudioInputDevices from '../../../../libs/hooks/useAudioInputDevices'

export default function VoiceRecorderTab({ setMicDeviceID, setSilenceThresholdSec, isShowVoiceSpectrum, silenceThresholdSec, setIsShowVoiceSpectrum }) {
  const { devices, requestMicPermission } = useAudioInputDevices()
  const [selectOptions, setSelectOptions] = useState([])

  function handleThresholdChange(e) {
    setSilenceThresholdSec(parseFloat(e.target.value))
  }

  function hanldeMicChange(e) {
    setMicDeviceID(e.target.value)
  }

  function handleSpectrumShowChange() {
    setIsShowVoiceSpectrum(v => !v)
  }

  useEffect(() => {
    if (devices.length === 0 || selectOptions.length > 0) return

    setSelectOptions(devices.map(d => (
      {
        value: d.deviceId,
        label: d.label,
      }
    )))
    setMicDeviceID(devices[0].deviceId)
  }, [devices])


  return (
    <>
      <input type="range" min="0.1" max="2.0" step="0.1" value={silenceThresholdSec} onChange={handleThresholdChange} />
      <div>無音検出：{silenceThresholdSec} 秒</div>

      使用マイク
      <Select options={selectOptions} onChange={hanldeMicChange} topLabel={null} />

      <button onClick={requestMicPermission}>マイクの使用を許可する</button>

      モニタリング表示
      <input type="checkbox" checked={isShowVoiceSpectrum} onChange={handleSpectrumShowChange} />
    </>
  )
}