import styles from "./BorderSettings.module.scss"

interface BorderSettingsProps {
  startResizing: () => void
  stopResizing: () => void
}

export const BorderSettings = ({ startResizing, stopResizing }: BorderSettingsProps) => {
  return (
    <div className={styles.settingsContainer}>
      <div className={styles.separator} onMouseDown={startResizing} onMouseUp={stopResizing} />
      <div className={styles.settingsZone}>
        <div>settings</div>
      </div>
    </div>
  )
}
