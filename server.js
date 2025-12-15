import app from "./src/app.js"
const port = 3000

// RUN SERVER
app.listen(port, () => {
  console.log(`Server running http://localhost:${port}`)
})
