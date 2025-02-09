import axios from "axios"
import { useState } from "react"
import "./styles.css"

function App() {
  const [file, setFile] = useState(null)
  const [resultImage, setResultImage] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!file) {
      alert("Please select an image first!")
      return
    }

    const formData = new FormData()
    formData.append("image", file)

    try {
      const response = await axios.post("http://localhost:5006/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        responseType: "arraybuffer", // Для получения бинарных данных
      })

      // Преобразуем полученные данные в Base64 для отображения в браузере
      const arrayBuffer = response.data
      const blob = new Blob([arrayBuffer], { type: "image/jpeg" })
      const url = URL.createObjectURL(blob)
      setResultImage(url)
    } catch (error) {
      console.error("Error uploading or processing image:", error)
      alert("An error occurred while processing the image.")
    }
  }

  // Функция для сохранения обработанного изображения
  const handleSaveImage = () => {
    if (resultImage) {
      // Создаем временную ссылку для скачивания
      const link = document.createElement("a")
      link.href = resultImage
      link.download = "processed-image.jpg"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="app-container">
      <h1>Image Processing App</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit">Upload and Process</button>
      </form>

      {resultImage && (
        <div className="result-container">
          <h2>Processed Image:</h2>
          <img src={resultImage} alt="Processed" className="processed-image" />
          <button onClick={handleSaveImage} className="save-button">
            Сохранить изображение
          </button>
        </div>
      )}
    </div>
  )
}

export default App
