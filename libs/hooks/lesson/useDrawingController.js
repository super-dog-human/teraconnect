export default function useDrawingController({ setIsDrawingHide, setEnablePen, undoDrawing, clearDrawing }) {
  function handleDrawingHide() {
    setIsDrawingHide(state => !state)
  }

  function handlePen() {
    setEnablePen(state => !state)
  }

  function handleDrawingUndo() {
    undoDrawing()
  }

  function handleDrawingClear() {
    clearDrawing()
  }

  return { handleDrawingHide, handlePen, handleDrawingUndo, handleDrawingClear }
}