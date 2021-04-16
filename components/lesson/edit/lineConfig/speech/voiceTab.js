import React, { useState, useRef, useEffect } from 'react'
import HumanVoiceTab from './humanVoiceTab'
import SynthesisVoiceTab from './synthesisVoiceTab'

export default function VoiceTab({ config, setConfig }) {
  const [showHumanVoiceTab, setShowHumanVoiceTab] = useState(!config.isSynthesis)
  const initialHumanVoiceConfigRef = useRef({})

  function switchVoiceTab() {
    setConfig(config => {
      config.isSynthesis = !config.isSynthesis
      if (config.isSynthesis) {
        config.voiceID = ''
        config.url = ''
      } else {
        config = { ...config, ...initialHumanVoiceConfigRef.current }
      }
      return { ...config }
    })

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
      {showHumanVoiceTab && <HumanVoiceTab config={config} setConfig={setConfig} switchTab={switchVoiceTab} />}
      {!showHumanVoiceTab && <SynthesisVoiceTab config={config} setConfig={setConfig} switchTab={switchVoiceTab} />}
    </>
  )
}