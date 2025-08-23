import axios from "axios"

const instance = axios.create({
  baseURL: "http://daily-alley-api.iubns.net",
  timeout: 1000,
  headers: { "X-Custom-Header": "foobar" },
})

export default instance
