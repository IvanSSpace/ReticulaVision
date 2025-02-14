import cn from "classnames"
import { useState } from "react"
import CheckBox from "../../shared/ui/Checkbox/Checkbox"
import styles from "./BorderSettings.module.scss"

interface BorderSettingsProps {
  startResizing: () => void
  stopResizing: () => void
}

const settingTabs = ["CF", "RV", "SD", "R2"]

export const BorderSettings = ({ startResizing, stopResizing }: BorderSettingsProps) => {
  const [activeTab, setActiveTab] = useState<string>("CF")

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.separator} onMouseDown={startResizing} onMouseUp={stopResizing} />
      <div className={styles.settingsZone}>
        <div className={styles.tabs}>
          {settingTabs.map((tab, index) => (
            <button
              key={index} // установить cn для применения состояния активного таба
              onClick={() => setActiveTab(tab)}
              className={cn(styles.button, { [styles.active]: tab === activeTab })}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* по сути если у нас будет просто большой json то мы можем просто наделать много методов которые будут менять их и состоять это будет из компонентов */}
        <div className={styles.settings}>
          {activeTab === "CF" && (
            <>
              <div>Цветовые фильтры</div>

              <CheckBox label="Черно-белый" />
              <CheckBox label="Негатив" />
            </>
          )}
          {activeTab === "RV" && <div>RV ACTIVE</div>}
          {activeTab === "SD" && <div>SD ACTIVE</div>}
          {activeTab === "R2" && <div>R2 ACTIVE</div>}
        </div>
      </div>
    </div>
  )
}
