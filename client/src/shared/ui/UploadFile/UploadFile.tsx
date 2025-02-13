import styles from "./UploadFile.module.scss"

interface UploadFileProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const UploadFile = ({ onFileChange }: UploadFileProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.folder}>
        <div className={styles.frontSide}>
          <div className={styles.tip}></div>
          <div className={styles.cover}></div>
        </div>
        <div className={styles.backSide}></div>
      </div>
      <label className={styles.customFileUpload}>
        <input className={styles.title} type="file" accept="image/*" onChange={onFileChange} />
        Choose a file
      </label>
    </div>
  )
}

export default UploadFile
