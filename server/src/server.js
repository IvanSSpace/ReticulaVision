const express = require("express")
const { ApolloServer } = require("apollo-server-express")
const cors = require("cors")
const fileUpload = require("express-fileupload")

// Массив для хранения информации о загруженных изображениях
let images = []

// Схема GraphQL
const typeDefs = `
  type Image {
    id: ID!
    url: String!
  }

  type Query {
    images: [Image!]!
  }

  type Mutation {
    uploadImage(filename: String!, mimetype: String!, path: String!): Image!
  }
`

// Резолверы для обработки запросов
const resolvers = {
  Query: {
    images: () => images,
  },
  Mutation: {
    uploadImage: async (_, { filename, mimetype, path }) => {
      // Проверка типа файла (только изображения)
      if (!mimetype.startsWith("image/")) {
        throw new Error("Недопустимый тип файла. Разрешены только изображения.")
      }

      // Генерация уникального имени файла
      const uniqueFilename = `${Date.now()}-${filename}`
      const inputPath = path
      const outputPath = `uploads/processed-${uniqueFilename}`

      // Обработка изображения с помощью Sharp
      try {
        await require("sharp")(inputPath)
          .resize(800, 600) // Пример: изменение размера
          .toFile(outputPath)

        // Возвращаем информацию о файле
        const newImage = { id: uniqueFilename, url: `/images/${uniqueFilename}` }
        images.push(newImage)

        return newImage
      } catch (err) {
        console.error("Ошибка при обработке изображения:", err)
        throw new Error("Не удалось обработать изображение.")
      }
    },
  },
}

// Создание сервера Apollo
const startApolloServer = async (typeDefs, resolvers) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })

  // Инициализация Express приложения
  const app = express()

  // Поддержка загрузки файлов через REST API
  app.use(fileUpload({ limits: { fileSize: 10 * 1024 * 1024 }, abortOnLimit: true }))

  // Настройка CORS
  app.use(cors())

  // REST API для загрузки файлов
  app.post("/upload", (req, res) => {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: "Файл не был предоставлен." })
    }

    const file = req.files.file

    // Сохранение оригинального файла
    const uniqueFilename = `${Date.now()}-${file.name}`
    const filePath = `uploads/${uniqueFilename}`

    file.mv(filePath, (err) => {
      if (err) {
        console.error("Ошибка при сохранении файла:", err)
        return res.status(500).json({ error: "Не удалось сохранить файл." })
      }

      // Отправляем данные файла в GraphQL мутацию
      res.json({
        filename: file.name,
        mimetype: file.mimetype,
        path: filePath,
      })
    })
  })

  // Настройка статического маршрута для доступа к обработанным изображениям
  app.use("/images", express.static("uploads"))

  // Запуск Apollo Server
  await server.start()

  // Применяем Apollo Server к Express
  server.applyMiddleware({ app })

  // Запуск сервера
  const PORT = process.env.PORT || 4000
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
  })
}

// Запуск сервера
startApolloServer(typeDefs, resolvers)
