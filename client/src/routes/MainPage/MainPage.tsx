import { useRef } from "react"
import { BorderSettings } from "../../components/BorderSettings/BorderSettings"
import { ImageProcessor } from "../../components/ImageProcessing/ImageProcessor"
import { useResizablePanels } from "../../shared/hooks/useResizablePanels"
import styles from "./MainPage.module.scss"

const MainPage = () => {
  const photoContainerRef = useRef<HTMLDivElement>(null)
  const borderSettingsRef = useRef<HTMLDivElement>(null)

  const { startResizing, stopResizing } = useResizablePanels(
    photoContainerRef as React.RefObject<HTMLDivElement>,
    borderSettingsRef as React.RefObject<HTMLDivElement>
  )

  return (
    <div className={styles.mainPageContainer}>
      <div ref={photoContainerRef} className={styles.photoContainer}>
        <ImageProcessor />
      </div>
      <div ref={borderSettingsRef} className={styles.settingsWrapper}>
        <BorderSettings startResizing={startResizing} stopResizing={stopResizing} />
      </div>
    </div>
  )
}

export default MainPage
