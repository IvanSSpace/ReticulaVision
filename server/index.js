const express = require("express")
const multer = require("multer")
const cors = require("cors")
const { processImage } = require("./services/imageProcessor")

const app = express()
const PORT = 5006

// Настройка CORS для работы с React-фронтендом
app.use(cors())

// Настройка multer для загрузки файлов
const storage = multer.memoryStorage() // Хранение файла в памяти
const upload = multer({ storage })

// Обработка POST-запроса с изображением
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" })
    }

    // Обрабатываем изображение с помощью выделенного сервиса
    const settings = {
      brightness: 0.52,
      noisePixel: 6.0,
      blur: 1.0001,
    }

    const modifiedImageBuffer = await processImage(req.file.buffer, settings)

    // Отправляем обработанное изображение обратно клиенту
    res.set("Content-Type", "image/jpeg")
    res.send(modifiedImageBuffer)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" })
  }
})

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
