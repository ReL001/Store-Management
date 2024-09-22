
import connectDB from "./db/DBconnect.js";
import {app} from "./app.js" 

dotenv.config({     // calling the config method of the dotenv object to load the environment variables from the .env file
    path:'./env'
})


connectDB() // calling the connectDB function to connect to the database
.then(() => {
    app.on("error", (error) => {
        console.error("Listener ERROR:", error)
    })
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on port: ${process.env.PORT}`)
    })    // .then promise to handle the success case
})
.catch((err) => {
    console.log("MONGODB connection failed !", err)
})    // .catch promise to handle the error case
