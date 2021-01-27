/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react'
import Select from '../../../form/select'
import useMicInputDevices from '../../../../libs/hooks/useMicInputDevices'

export default function VoiceRecorderTab({ setMicDeviceID, setSilenceThresholdSec }) {
  const { devices, requestMicPermission } = useMicInputDevices()
  const [selectOptions, setSelectOptions] = useState([])

  function handleThresholdChange(e) {
    setSilenceThresholdSec(e.target.value)
  }

  function hanldeMicChange(e) {
    setMicDeviceID(e.target.value)
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
      <input type="text" value="1.0" onChange={handleThresholdChange} />

      使用マイク
      <Select options={selectOptions} onChange={hanldeMicChange} topLabel={null} />

      <button onClick={requestMicPermission}>マイクの使用を許可する</button>
    </>
  )
}