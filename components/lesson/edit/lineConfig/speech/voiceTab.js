import React, { useState, useEffect, useRef } from 'react'
import HumanVoiceTab from './humanVoiceTab'
import SynthesisVoiceTab from './synthesisVoiceTab'

export default function VoiceTab({ config, setConfig }) {
  const [showHumanVoiceTab, setShowHumanVoiceTab] = useState(!config.isSynthesis)
  const humanVoiceURLRef = useRef('')

  function switchVoiceTab() {
    setConfig(config => {
      config.isSynthesis = !config.isSynthesis

      if (config.isSynthesis) {
        config.url = humanVoiceURLRef.current
      }

      return { ...config }
    })

    setShowHumanVoiceTab(show => !show)
  }

  useEffect(() => {
    if (config.isSynthesis) return
    humanVoiceURLRef.current = config.url
  }, [])

  return (
    <>
      {showHumanVoiceTab && <HumanVoiceTab config={config} setConfig={setConfig} switchTab={switchVoiceTab} />}
      {!showHumanVoiceTab && <SynthesisVoiceTab config={config} setConfig={setConfig} switchTab={switchVoiceTab} />}
    </>
  )
}