import Mongoose from 'mongoose'
import { initDBPlayers } from '../sockets/playerUtil';

export const initDB = () =>{
    Mongoose.connect("mongodb://mongodb:27017/test")
    Mongoose.connection.on("error", error => {
    console.log("Database connection error:", error);
    });
    // If connected to MongoDB send a success message
    Mongoose.connection.once("open", () => {
    console.log("Connected to Database!");
    });
    initDBPlayers();
}