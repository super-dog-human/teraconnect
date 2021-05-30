import React, { useState, useRef, useEffect } from 'react'
import HumanVoiceTab from './humanVoiceTab'
import SynthesisVoiceTab from './synthesisVoiceTab'

export default function VoiceTab({ config, dispatchConfig }) {
  const [showHumanVoiceTab, setShowHumanVoiceTab] = useState(!config.isSynthesis)
  const initialHumanVoiceConfigRef = useRef({})

  function switchVoiceTab() {
    dispatchConfig({ type: 'switchIsSynthesis', payload: initialHumanVoiceConfigRef.current })
    setShowHumanVoiceTab(show => !show)
  }

  useEffect(() => {
    if (showHumanVoiceTab) {
      initialHumanVoiceConfigRef.current = { url: config.url, voiceID: config.voiceID }
    } else {
      initialHumanVoiceConfigRef.current = { url: '', voiceID: '' }
    }
  }, [])

  return (
    <>
      {showHumanVoiceTab && <HumanVoiceTab config={config} dispatchConfig={dispatchConfig} switchTab={switchVoiceTab} />}
      {!showHumanVoiceTab && <SynthesisVoiceTab config={config} dispatchConfig={dispatchConfig} switchTab={switchVoiceTab} />}
    </>
  )
}