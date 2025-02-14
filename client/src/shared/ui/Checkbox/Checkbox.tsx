
import styles from "./CheckBox.module.scss"

interface CheckBoxProps {
  label: string
  checked: boolean
  onChange: () => void
}

const CheckBox = ({ label, checked, onChange }: CheckBoxProps) => {
  return (
    <label className={styles.label}>
      <input type="checkbox" className={styles.input} checked={checked} onChange={onChange} />
      <span className={styles.customCheckbox}></span>
      <div className={styles.text}>{label}</div>
    </label>
  )
}

export default CheckBox
