import axios from "axios"

const instance = axios.create({
  baseURL: "https://daily-alley-api.iubns.net",
  timeout: 60000,
  headers: { "X-Custom-Header": "foobar" },
})

export default instance
