import dotenv from "dotenv";
import "reflect-metadata";
import app from "./app";
import "./database"


/* Loading the environment variables from the .env file. */
dotenv.config()

/* Listening to the port 3333. */
app.listen(process.env.PORT || 3333, () => {
    console.log("Server is running")
})
