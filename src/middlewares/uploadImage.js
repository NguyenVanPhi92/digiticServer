import multer from 'multer'
import sharp from 'sharp'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// dùng multer đọc file từ form-data và tạo thư mục lưu trữ ảnh
export const storage = multer.diskStorage({
    // Tạo thư mục lưu ảnh
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/images'))
    },
    // Chuyển đổi tên ảnh
    filename: function (req, file, cb) {
        const uniquesuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, file.fieldname + '-' + uniquesuffix + '.jpeg')
    }
})

// kiểm tra định dạng file được upload
export const multerFilter = (req, file, cb) => {
    // kiểu tra thuộc tính chuỗi có phải là ảnh không
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb({ message: 'Unsupported file format' }, false)
    }
}

// upload ảnh
export const uploadPhoto = multer({
    storage: storage,
    fileFilter: multerFilter,
    limits: { fileSize: 3000000 } // giới hạn ảnh là 3mb
})

// tạo kích thước ảnh cho product khi upload
export const productImgResize = async (req, res, next) => {
    if (!req.files) return next()
    await Promise.all(
        req.files.map(async (file) => {
            await sharp(file.path)
                .resize(300, 300)
                .toFormat('jpeg')
                .jpeg({ quality: 90 }) // chât lượng ảnh là 90
                .toFile(`public/images/products/${file.filename}`) // lưu ảnh vào thư mục
            fs.unlinkSync(file.path) // xóa ảnh gốc
        })
    )
    next()
}

// tạo kích thước ảnh cho blog khi upload
export const blogImgResize = async (req, res, next) => {
    if (!req.files) return next()
    await Promise.all(
        req.files.map(async (file) => {
            await sharp(file.path)
                .resize(300, 300)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`public/images/blogs/${file.filename}`)
            fs.unlinkSync(file.path)
        })
    )
    next()
}
