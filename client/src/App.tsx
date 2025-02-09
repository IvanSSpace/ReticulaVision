import axios from "axios"
import { useState } from "react"

function App() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [imageUrl, setImageUrl] = useState("")

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile)
      setError("")
    } else {
      alert("Выберите допустимое изображение!")
      setFile(null)
    }
  }

  const handleSubmit = async (e) => {
    if (!file) {
      alert("Пожалуйста, выберите файл.")
      return
    }

    setLoading(true)
    setError("")

    // Шаг 1: Отправляем файл через REST API
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await axios.post("http://localhost:4000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      const { filename, mimetype, path } = response.data

      // Шаг 2: Вызываем GraphQL мутацию для обработки файла
      const gqlResponse = await axios.post("http://localhost:4000/graphql", {
        query: `mutation UploadImage($filename: String!, $mimetype: String!, $path: String!) {
          uploadImage(filename: $filename, mimetype: $mimetype, path: $path) {
            id
            url
          }
        }`,
        variables: { filename, mimetype, path },
      })

      if (gqlResponse.data.errors) {
        throw new Error(gqlResponse.data.errors[0].message)
      }

      const uploadedImageUrl = gqlResponse.data.data.uploadImage.url
      setImageUrl(uploadedImageUrl)
      alert(`Изображение успешно загружено! URL: ${uploadedImageUrl}`)
    } catch (err) {
      console.error("Ошибка загрузки:", err)
      setError(err.message || "Произошла ошибка при загрузке изображения.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Загрузка изображения</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={loading}
          style={{ padding: 8, width: "100%" }}
        />
        <button
          type="submit"
          disabled={!file || loading}
          style={{ marginTop: 10, padding: "8px 16px" }}
        >
          {loading ? "Загрузка..." : "Загрузить"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {imageUrl && (
        <div>
          <p>Обработанное изображение:</p>
          <img
            src={`http://localhost:4000${imageUrl}`}
            alt="Uploaded"
            style={{ maxWidth: "100%" }}
          />
        </div>
      )}
    </div>
  )
}

export default App
