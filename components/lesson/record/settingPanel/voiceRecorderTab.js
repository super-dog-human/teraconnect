/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react'
import { css } from '@emotion/core'
import Select from '../../../form/select'
import useAudioInputDevices from '../../../../libs/hooks/useAudioInputDevices'

export default function VoiceRecorderTab({ setMicDeviceID, setSilenceThresholdSec, isShowVoiceSpectrum, silenceThresholdSec, setIsShowVoiceSpectrum }) {
  const { deviceOptions, requestMicPermission } = useAudioInputDevices()

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
    if (deviceOptions.length === 0) return

    setMicDeviceID(deviceOptions[0].value)
  }, [deviceOptions])

  return (
    <>
      <input type="range" min="0.1" max="2.0" step="0.1" value={silenceThresholdSec} onChange={handleThresholdChange} />
      <div>無音検出：{silenceThresholdSec} 秒</div>

      使用マイク
      <Select options={deviceOptions} onChange={hanldeMicChange} topLabel={null} />

      <button onClick={requestMicPermission}>マイクの使用を許可する</button>

      モニタリング表示
      <input type="checkbox" checked={isShowVoiceSpectrum} onChange={handleSpectrumShowChange} />
    </>
  )
}