const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

//  Xac thuc xem User da login chua
const authMiddleware = asyncHandler(async (req, res, next) => {
    let token
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET)
                const user = await User.findById(decoded?.id)
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
const isAdmin = asyncHandler(async (req, res, next) => {
    const { email } = req.user
    const adminUser = await User.findOne({ email })
    if (adminUser.role !== 'admin') {
        throw new Error('Bạn không có quyền truy cập')
    } else {
        next()
    }
})

module.exports = { authMiddleware, isAdmin }
