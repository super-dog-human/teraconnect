import React, { useState, useRef } from 'react'
import HumanVoiceTab from './humanVoiceTab'
import SynthesisVoiceTab from './synthesisVoiceTab'

export default function VoiceTab({ config, dispatchConfig }) {
  const preVoiceRef = useRef({ url: '', voiceID: 0 })
  const [showHumanVoiceTab, setShowHumanVoiceTab] = useState(!config.isSynthesis)

  function switchHuman() {
    const currentVoice = { url: config.url, voiceID: config.voiceID }
    dispatchConfig({ type: 'switchToHuman', payload: preVoiceRef.current })
    setShowHumanVoiceTab(true)
    preVoiceRef.current = currentVoice
  }

  function switchSynthesis() {
    const currentVoice = { url: config.url, voiceID: config.voiceID }
    dispatchConfig({ type: 'switchToSynthesis', payload: preVoiceRef.current })
    setShowHumanVoiceTab(false)
    preVoiceRef.current = currentVoice
  }

  return (
    <>
      {showHumanVoiceTab && <HumanVoiceTab config={config} dispatchConfig={dispatchConfig} switchTab={switchSynthesis} />}
      {!showHumanVoiceTab && <SynthesisVoiceTab config={config} dispatchConfig={dispatchConfig} switchTab={switchHuman} />}
    </>
  )
}