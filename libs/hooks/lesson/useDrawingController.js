export default function useDrawingController({ setIsRecording, setIsDrawingHide, setEnablePen }) {
  function handleDrawingStart() {
    setIsRecording(state => !state)
  }

  function handleDrawingHide() {
    setIsDrawingHide(state => !state)
  }

  function handlePen() {
    setEnablePen(state => !state)
  }

  return { handleDrawingStart, handleDrawingHide, handlePen }
}