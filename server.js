import app from "./src/routes/index.js"
const port = 3000;


app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
