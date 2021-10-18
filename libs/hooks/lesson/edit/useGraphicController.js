import { useRef } from 'react'
import useFetch from '../../useFetch'
import { putFile } from '../../../fetch'
import { useRouter } from 'next/router'
import { filterObject } from '../../../utils'
import { filterAvailableImages, isAvailableFileSize, requestNewGraphicsBody } from '../../../graphicUtils'

export default function useGraphicController({ showDialog, showError, setGraphics, setGraphicURLs }) {
  const { fetchWithAuth, post  } = useFetch()
  const router = useRouter()
  const inputFileRef = useRef()
  const targetGraphicID = useRef()
  const lessonIDRef = useRef(parseInt(router.query.id))

  function selectLocalImage(currentGraphicID) {
    targetGraphicID.current = currentGraphicID
    inputFileRef.current.click()
  }

  function confirmSwappingGraphic(e) {
    if (e.target.files.length === 0) return // 画像を選択せずに閉じた場合は何もしない

    const file = e.target.files[0]

    if (isAvailableFileSize(file)) {
      showDialog({
        title: '画像の差し替え',
        message: '現在の画像を削除し、新しい画像と差し替えますか？',
        canDismiss: true,
        dismissName: 'キャンセル',
        callbackName: '差し替える',
        callback: async () => {
          await swapGraphic(targetGraphicID.current, file)
          inputFileRef.current.value = ''
        },
        dismissCallback: () => {
          inputFileRef.current.value = ''
        },
      })
    } else {
      showDialog({
        title: 'エラー',
        message: 'ファイルサイズが大きすぎます。10MB以内のファイルを選択してください。',
        canDismiss: true,
        callbackName: '閉じる',
      })
    }
  }

  function confirmRemovingGraphic(currentGraphicID) {
    showDialog({
      title: '画像の削除',
      message: '画像を削除し、授業から取り除きますか？',
      canDismiss: true,
      dismissName: 'キャンセル',
      callbackName: '削除',
      callback: async () => await removeGraphic(currentGraphicID),
    })
  }

  async function removeGraphic(graphicID) {
    return deleteGraphic(graphicID).then(() => {
      setGraphics(graphics => graphics.filter(g => g.graphicID !== parseInt(graphicID)))
      setGraphicURLs(urls => filterObject(urls, Object.keys(urls).filter(id => id !== graphicID)))
    }).catch(e => {
      showError(e.dialog)
    })
  }

  async function swapGraphic(currentGraphicID, newFile) {
    return uploadAndDeleteGraphic(currentGraphicID, newFile).then(({ id, url }) => {
      setGraphicURLs(urls => {
        const newURLs = {}
        Object.keys(urls).forEach(graphicID => {
          if (graphicID === currentGraphicID) {
            newURLs[id] = { url }
          } else {
            newURLs[graphicID] = urls[graphicID] // サムネイルの順番を保つため、入れ替え対象以外も格納しなおす
          }
        })
        return newURLs
      })

      setGraphics(graphics => {
        graphics.forEach(graphic => {
          if (graphic.graphicID !== parseInt(currentGraphicID)) return
          graphic.graphicID = id
        })
        return [...graphics]
      })
    }).catch(e => {
      if (e.dialog) {
        showError(e.dialog)
      } else {
        throw e
      }
    })
  }

  async function uploadAndDeleteGraphic(currentGraphicID, newFile) {
    const newGraphic = (await createNewGraphic(newFile)).signedURLs[0]
    await uploadNewGraphic(newGraphic.signedURL, newFile)
    const url = (await fetchNewGraphic(newGraphic.fileID)).url
    await deleteGraphic(currentGraphicID)

    return { id: parseInt(newGraphic.fileID), url }
  }

  async function deleteGraphic(graphicID) {
    return post(`/graphics/${graphicID}`, null, 'DELETE').catch(e => {
      const err = new Error()
      err.dialog = {
        message: '現在の画像の削除に失敗しました。',
        original: e,
        canDismiss: true,
        dismissName: '閉じる',
      }
      throw err
    })
  }

  async function createNewGraphic(file) {
    const body = requestNewGraphicsBody(lessonIDRef.current, filterAvailableImages([file]))
    return post('/graphics', body).catch(e => {
      const err = new Error()
      err.dialog = {
        message: '新しい画像の作成に失敗しました。',
        original: e,
        canDismiss: true,
        dismissName: '閉じる',
      }
      throw err
    })
  }

  async function uploadNewGraphic(url, file) {
    return putFile(url, file, file.type).catch(e => {
      const err = new Error()
      err.dialog = {
        message: '新しい画像のアップロードに失敗しました。',
        original: e,
        canDismiss: true,
        dismissName: '閉じる',
      }
      throw err
    })
  }

  async function fetchNewGraphic(id) {
    return fetchWithAuth(`/graphics/${id}`).catch(e => {
      const err = new Error()
      err.dialog = {
        message: '作成した画像の取得に失敗しました。',
        original: e,
        canDismiss: true,
        dismissName: '閉じる',
      }
      throw err
    })
  }

  return { inputFileRef, selectLocalImage, confirmSwappingGraphic, confirmRemovingGraphic }
}