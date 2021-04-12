import React, { useState } from 'react'
import HumanVoiceTab from './humanVoiceTab'
import SynthesisVoiceTab from './synthesisVoiceTab'

export default function VoiceTab({ config, setConfig }) {
  const [showHumanVoiceTab, setShowHumanVoiceTab] = useState(!config.isSynthesis)

  function switchVoiceTab() {
    setConfig(config => {
      config.isSynthesis = !config.isSynthesis
      return { ...config }
    })
    setShowHumanVoiceTab(show => !show)
  }

  return (
    <>
      {showHumanVoiceTab && <HumanVoiceTab config={config} setConfig={setConfig} switchTab={switchVoiceTab} />}
      {!showHumanVoiceTab && <SynthesisVoiceTab config={config} setConfig={setConfig} switchTab={switchVoiceTab} />}
    </>
  )
}