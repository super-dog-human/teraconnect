import { useRef, useState, useEffect } from 'react'
import { useLessonEditorContext } from '../../../../contexts/lessonEditorContext'

export default function useAddingNewLine({ elapsedTime, setLineConfig }) {
  const addLineButtons = [
    { kind: 'speech',    label: '音声',      description: 'マイクで音声を録音したり、合成音声を作成します。' },
    { kind: 'graphic',   label: '画像',      description: 'アップロードした画像を表示・非表示します。' },
    { kind: 'drawing',   label: '板書',      description: '自由な線を描いたり消したりします。' },
    { kind: 'avatar',    label: 'アバター',   description: 'アバターの位置や大きさを変更します。' },
    { kind: 'embedding', label: '埋め込み',   description: 'YouTubeやGeoGebraを授業内で再生します。' },
    { kind: 'music',     label: 'BGM',       description: '音楽を再生・停止します。' },
  ]
  const newLineRef = useRef({})
  const [buttonDescription, setButtonDescription] = useState('')
  const { addAvatarLine, addDrawingLine, addEmbeddingLine, addGraphicLine, addMusicLine, addSpeechLine, avatars, drawings, embeddings, graphics, musics, speeches } = useLessonEditorContext()

  function handleMouseEnter(e) {
    setButtonDescription(addLineButtons[e.currentTarget.dataset.index].description)
  }

  function handleMouseLeave() {
    setButtonDescription('')
  }

  function handleButtonClick(e) {
    const kind = addLineButtons[e.currentTarget.dataset.index].kind
    const result = addLine(kind)

    newLineRef.current = {
      action: kind,
      line: result.newLine,
      index: result.index,
    }
  }

  function handleCancel() {
    setLineConfig({}) // パネルを閉じる
  }

  function addLine(kind) {
    switch(kind) {
    case 'avatar':
      return addAvatarLine(elapsedTime)
    case 'drawing':
      return addDrawingLine(elapsedTime)
    case 'embedding':
      return addEmbeddingLine(elapsedTime)
    case 'graphic':
      return addGraphicLine(elapsedTime)
    case 'music':
      return addMusicLine(elapsedTime)
    case 'speech':
      return addSpeechLine(elapsedTime)
    }
  }

  useEffect(() => {
    if (Object.keys(newLineRef.current).length === 0) return

    // 展開中の追加行パネルと入れ替わりに各行の設定パネルを開く
    setLineConfig({
      ...newLineRef.current,
      isPending: true,
    })

    newLineRef.current = {}
  }, [avatars, drawings, embeddings, graphics, musics, speeches])

  return { addLineButtons, buttonDescription, handleMouseEnter, handleMouseLeave, handleButtonClick, handleCancel }
}