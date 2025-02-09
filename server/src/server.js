const express = require("express")
const { ApolloServer } = require("apollo-server-express")
const cors = require("cors")

// Схема GraphQL
const typeDefs = `
  type Query {
    greet(name: String): String
  }
`

// Резолверы для обработки запросов
const resolvers = {
  Query: {
    greet: (_, { name }) => {
      return `Hello ${name || "World"}`
    },
  },
}

// Создание сервера Apollo
const server = new ApolloServer({
  typeDefs,
  resolvers,
  cors: true, // Разрешаем CORS
})

// Инициализация Express приложения
const app = express()
app.use(cors()) // Разрешаем CORS

// Асинхронная функция для запуска сервера
async function startServer() {
  // Запускаем Apollo Server
  await server.start()

  // Применяем Apollo Server к Express
  server.applyMiddleware({ app })

  // Запуск сервера
  const PORT = process.env.PORT || 4000
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
  })
}

// Вызываем функцию запуска
startServer().catch((error) => {
  console.error("Ошибка при запуске сервера:", error)
})
