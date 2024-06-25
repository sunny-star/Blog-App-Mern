const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const app = express()
const cookieparser = require('cookie-parser')
const authRoute = require('./routes/auth')
const userRoute = require('./routes/users')
const postRoute = require('./routes/posts')
const commentRoute = require('./routes/comments')
const cors = require('cors');
const multer = require('multer')
const path = require('path')
import path from 'path';
import { fileURLPath } from 'url';



//database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("database is connected successfully!")

    }
    catch (err) {
        console.log(err)
    }
}
//esModule
const __filename = fileURLPath(import.meta.url);
const __dirname = path.dirname(__filename);




//middlewares
dotenv.config()
app.use(express.json())
app.use("/images", express.static(path.join(__dirname, "/images")))
app.use(cookieparser())
app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/posts', postRoute)
app.use('/api/comments', commentRoute)

app.use(express.static(path.join(__dirname, './client/build')))



//image upload
const storage = multer.diskStorage({
    destination: (req, file, fn) => {
        fn(null, "images")
    },
    filename: (req, file, fn) => {
        fn(null, req.body.img)
        //fn(null, "image1.jpg")
    }
})

const upload = multer({ storage: storage })
app.post("/api/upload", upload.single("file"), (req, res) => {
    console.log(req.body)
    res.status(200).json("Image has been uploaded successfully!")
})

//deploy
app.use("*", function (req, res) {
    res.sendFile(path.join(__dirname, '/client/build/index.html'))

})


app.listen(process.env.PORT, () => {
    connectDB()
    console.log("app is running on port " + process.env.PORT)
})