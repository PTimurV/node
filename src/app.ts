import express from "express";
import {getLibraryRouter} from "./routes/router-library";

export const app = express()

export const jsonBodyMiddleware = express.json()



app.use(jsonBodyMiddleware)

app.use("/library", getLibraryRouter())