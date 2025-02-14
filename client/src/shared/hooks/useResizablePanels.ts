export const useResizablePanels = (
  leftBlockRef: React.RefObject<HTMLDivElement>,
  rightBlockRef: React.RefObject<HTMLDivElement>
) => {
  const handleMouseMove = (e: MouseEvent) => {
    if (leftBlockRef.current && rightBlockRef.current) {
      document.body.style.cursor = "col-resize"

      // Вычисляем процент от ширины окна
      const percentage = (e.clientX / window.innerWidth) * 100

      // Ограничиваем значения
      const minWidth = 30 // минимальная ширина 20%
      const maxWidth = 75 // максимальная ширина 80%
      const clampedPercentage = Math.min(Math.max(percentage, minWidth), maxWidth)

      leftBlockRef.current.style.width = `${clampedPercentage}%`
      rightBlockRef.current.style.width = `${100 - clampedPercentage}%`
    }
  }

  const startResizing = () => {
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", stopResizing)
  }

  const stopResizing = () => {
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", stopResizing)
    document.body.style.cursor = "auto"
  }

  return { startResizing, stopResizing }
}
