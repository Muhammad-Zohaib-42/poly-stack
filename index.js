import { connectDB } from "./src/config/database.js";
import {app} from "./src/app.js"
import { config } from "./src/config/config.js";

const PORT = config.PORT

connectDB()
.then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`)
  })
})
.catch(error => {
  console.log(`DB connection failed! error: ${error}`)
  process.exit(1)
})