const bodyParser = require('body-parser')
const express = require('express')
const dbConnect = require('./config/dbConnect')
const { notFound, errorHandler } = require('./middlewares/errorHandler')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
const dotenv = require('dotenv').config()
const PORT = 5000 || process.env.PORT

//Import cac Router
const authRouter = require('./routes/authRoute')
const productRouter = require('./routes/productRoute')
const blogRouter = require('./routes/blogRoute')
const categoryRouter = require('./routes/prodcategoryRoute')
const blogcategoryRouter = require('./routes/blogCatRoute')
const brandRouter = require('./routes/brandRoute')
const colorRouter = require('./routes/colorRoute')
const enqRouter = require('./routes/enqRoute')
const couponRouter = require('./routes/couponRoute')
const uploadRouter = require('./routes/uploadRoute')

dbConnect()

app.use(morgan('dev'))
app.use(cors())
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

// Middleware case error, not found
app.use(notFound)
app.use(errorHandler)

// Port API
app.listen(PORT, () => {
    console.log(`Server is running  at PORT ${PORT}`)
})
