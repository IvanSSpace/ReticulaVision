
import styles from "./CheckBox.module.scss"

const CheckBox = ({ label }: { label: string }) => {
  return (
    <label className={styles.label}>
      <input type="checkbox" className={styles.input} />
      <span className={styles.customCheckbox}></span>
      <div className={styles.text}>{label}</div>
    </label>
  )
}

export default CheckBox
