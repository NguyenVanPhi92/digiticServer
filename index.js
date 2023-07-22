import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import {} from 'dotenv/config.js'
import express from 'express'
import morgan from 'morgan'
import * as path from 'path'
import { fileURLToPath } from 'url'
import dbConnect from './src/config/dbConnect.js'
import { errorHandler, notFound } from './src/middlewares/errorHandler.js'

// use __dirname in ES6 module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
const PORT = 5000 || process.env.PORT

// Import cac Router
import authRouter from './src/routes/authRoute.js'
import blogcategoryRouter from './src/routes/blogCatRoute.js'
import blogRouter from './src/routes/blogRoute.js'
import brandRouter from './src/routes/brandRoute.js'
import colorRouter from './src/routes/colorRoute.js'
import couponRouter from './src/routes/couponRoute.js'
import enqRouter from './src/routes/enqRoute.js'
import categoryRouter from './src/routes/prodcategoryRoute.js'
import productRouter from './src/routes/productRoute.js'
import uploadRouter from './src/routes/uploadRoute.js'

dbConnect()

app.use(morgan('dev')) // dung de login ra cac api khi goi
// dat qui tac cors
app.use(
    cors()
    // {
    //     origin: process.env.CLIENT_URL, // chi cho phep url nay truy cap
    //     methods: ['GET', 'POST', 'PUT', 'DELETE'] //chi chp phep truy cap cac phuong thuc nay
    // }
)
// app.use(express.urlencoded({ extended: true })) // cho phep ddocj cacs mang or obj ma client gui len
app.use(bodyParser.json()) // parser json web client send to server
app.use(bodyParser.urlencoded({ extended: false }))
// Cookie parser là một thằng trung gian hay gọi là middleware trong Expressjs được sử dụng để phân tích cú pháp cookie và cũng là một phần mềm trung gian phổ biến khi những lập trình viên khởi tạo dự án sử dụng nodejs và expressjs.
app.use(cookieParser())

// PATH URL API
app.use('/api/user', authRouter)
app.use('/api/product', productRouter)
app.use('/api/blog', blogRouter)
app.use('/api/category', categoryRouter)
app.use('/api/blogcategory', blogcategoryRouter)
app.use('/api/brand', brandRouter)
app.use('/api/coupon', couponRouter)
app.use('/api/color', colorRouter)
app.use('/api/enquiry', enqRouter)
app.use('/api/upload', uploadRouter)

// public thư mục uploads
app.use(express.static(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/blogs', express.static(path.join(__dirname, 'blogs')))

// Middleware case error, not found
app.use(notFound)
app.use(errorHandler)

// Port API
app.listen(PORT, () => {
    console.log(`Server is running  at PORT ${PORT}`)
})
