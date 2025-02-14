import cn from "classnames"
import styles from "./SettingItemWrapper.module.scss"

const SettingItemWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={cn(styles.settingItemWrapper, className)}>{children}</div>
}

export default SettingItemWrapper
