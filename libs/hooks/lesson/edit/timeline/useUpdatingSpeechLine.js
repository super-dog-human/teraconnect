import { useState, useRef, useCallback, useEffect } from 'react'

export default function useUpdateSpeechLine({ timeline, updateLine }) {
  const [isLineProcessing, setIsLineProcessing] = useState(false)
  const [queues, setQueues] = useState([])
  const isProcessingRef = useRef(false)

  function updateSpeechLine({ lineIndex, kindIndex, speech }) {
    setQueues([...queues, { lineIndex, kindIndex, speech }])
  }

  const updateSpeechByLineIndex = useCallback(() => {
    const queue = queues[0]
    if (!queue) {
      isProcessingRef.current = false
      return
    }

    // 編集画面トップからの音声行編集は行が入れ替わることがないのでlineIndexから開始時間を取得できる
    const elapsedTime = parseFloat(Object.keys(timeline).sort((a, b) => a - b)[queue.lineIndex])
    const newValue = queue.speech
    newValue.elapsedTime = elapsedTime // 当初のelapsedTimeはキュー待ちの間に更新されている可能性があるので最新の値を格納
    updateLine({ kind: 'speech', index: queue.kindIndex, elapsedTime, newValue })

    isProcessingRef.current = false
    setQueues(queues.filter(q => q !== queue))
  }, [queues, timeline, updateLine])

  useEffect(() => {
    if (!isProcessingRef.current) {
      isProcessingRef.current = true
      updateSpeechByLineIndex()
    }
  }, [updateSpeechByLineIndex])

  useEffect(() => {
    setIsLineProcessing(queues.length > 0)
  }, [queues])

  return { isLineProcessing, setIsLineProcessing, updateSpeechLine }
}