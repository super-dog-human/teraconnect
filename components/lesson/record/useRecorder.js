import { useState } from 'react'

export default function useRecorder(id, token, backgroungImage, avatarConfig) {

  const recorder = null
  const recorderConfig = null

  function setRecord(record) {
    console.log('new record: ', record)
  }


  return { recorder, recorderConfig, setRecord }
}