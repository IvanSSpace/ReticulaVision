import { ApolloClient, InMemoryCache, gql } from "@apollo/client"
import { useState } from "react"

// Создание клиента Apollo
const client = new ApolloClient({
  uri: "http://localhost:4000/graphql", // URL вашего бэкенда
  cache: new InMemoryCache(),
})

function App() {
  const [name, setName] = useState("")
  const [result, setResult] = useState("")

  // ГрафQL запрос
  const GREET_QUERY = gql`
    query Greet($name: String) {
      greet(name: $name)
    }
  `

  // Обработка отправки имени
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const { data } = await client.query({
        query: GREET_QUERY,
        variables: { name },
      })

      setResult(data.greet) // Установка результата
    } catch (error) {
      console.error("Ошибка:", error)
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Приветствие</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Введите ваше имя"
          style={{ padding: 8, width: "100%" }}
        />
        <button type="submit" style={{ marginTop: 10, padding: "8px 16px" }}>
          Отправить
        </button>
      </form>
      {result && <p>{result}</p>}
    </div>
  )
}

export default App
