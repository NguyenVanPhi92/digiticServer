import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import UserModel from '../models/userModel.js'

//  Xac thuc xem User da login chua
export const authMiddleware = asyncHandler(async (req, res, next) => {
    let token
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.ACCESS_TOKEN)
                const user = await UserModel.findById(decoded?.id)
                // gan user login vao request header
                req.user = user
                next()
            }
        } catch (error) {
            throw new Error('Token không tồn tại, hãy đăng nhập.')
        }
    } else {
        throw new Error('Không có token trong header')
    }
})

// Xac thuc xem User co Admin khong
export const isAdmin = asyncHandler(async (req, res, next) => {
    const { email } = req.user
    const adminUser = await UserModel.findOne({ email })
    if (adminUser.role !== 'admin') {
        throw new Error('Bạn không có quyền truy cập')
    } else {
        next()
    }
})
