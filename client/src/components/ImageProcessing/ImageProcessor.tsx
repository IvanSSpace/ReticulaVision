import axios from "axios"
import { useEffect, useState } from "react"
import UploadFile from "../../shared/ui/UploadFile/UploadFile"

import Spinner from "../../shared/ui/Spinner/Spinner"
import { useSettingsStore } from "../../stores/settingsStore"
import styles from "./ImageProecessor.module.scss"

export const ImageProcessor = () => {
  const [file, setFile] = useState<File | null>(null)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { settings } = useSettingsStore()

  const processImage = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append("image", file)

    try {
      setIsLoading(true)
      const response = await axios.post("http://localhost:5006/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        responseType: "arraybuffer",
      })

      const arrayBuffer = response.data
      const blob = new Blob([arrayBuffer], { type: "image/jpeg" })
      const url = URL.createObjectURL(blob)
      setResultImage(url)
    } catch (error) {
      console.error("Ошибка при загрузке или обработке изображения:", error)
      alert("Произошла ошибка при обработке изображения.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    processImage()
  }

  useEffect(() => {
    if (file) {
      processImage()
    }
  }, [settings, file])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleSaveImage = () => {
    if (resultImage) {
      const link = document.createElement("a")
      link.href = resultImage
      link.download = "processed-image.jpg"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <>
      <h1>Reticula Vision</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <UploadFile onFileChange={handleFileChange} />
        <button type="submit" className={styles.submitButton}>
          process the image
        </button>
      </form>
      {resultImage && (
        <div className={styles.resultContainer}>
          <h2>Обработанное изображение:</h2>
          <div className={styles.imageWrapper}>
            <img src={resultImage} alt="Обработанное" className={styles.processedImage} />
            {isLoading && (
              <div className={styles.spinnerWrapper}>
                <Spinner />
              </div>
            )}
          </div>
          <button onClick={handleSaveImage} className={styles.saveButton}>
            Сохранить изображение
          </button>
        </div>
      )}
    </>
  )
}
