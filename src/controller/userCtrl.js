import UserModel from '../models/userModel.js'
import OrderModel from '../models/orderModel.js'
import ProductModel from '../models/productModel.js'
import CartModel from '../models/cartModel.js'
import CouponModel from '../models/couponModel.js'
import uniqid from 'uniqid'
import asyncHandler from 'express-async-handler'
import validateMongoDbId from '../utils/validateMongodbId.js'
import jwt from 'jsonwebtoken'
import generateToken from '../config/jwtToken.js'
import generateRefreshToken from '../config/refreshtoken.js'
import crypto from 'crypto'
import sendEmail from './emailCtrl.js'

// Create a User ----------------------------------------------
export const createUser = asyncHandler(async (req, res) => {
    /**
     * TODO:Get the email from req.body send from web client
     */
    const email = req.body.email
    /**
     * TODO:With the help of email find the user exists or not
     */
    const findUser = await UserModel.findOne({ email: email })

    if (!findUser) {
        /**
         * TODO:if user not found user create a new user
         */
        const newUser = await UserModel.create(req.body)
        res.json(newUser)
    } else {
        /**
         * TODO:if user found then thow an error: User already exists
         */
        throw new Error('User Already Exists')
    }
})

// Login a user
export const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    // check if user exists or not
    const findUser = await UserModel.findOne({ email })
    if (findUser && (await findUser.isPasswordMatched(password))) {
        const refreshToken = await generateRefreshToken(findUser?._id)
        const updateuser = await UserModel.findByIdAndUpdate(
            findUser.id,
            {
                refreshToken: refreshToken
            },
            { new: true }
        )
        // gan refreshToken vao cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000
        })

        // send user when find in db
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id)
        })
    } else {
        throw new Error('Invalid Credentials')
    }
})

// admin login
export const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    // check if user exists or not
    const findAdmin = await UserModel.findOne({ email })
    if (findAdmin.role !== 'admin') throw new Error('Not Authorised')
    if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
        const refreshToken = await generateRefreshToken(findAdmin?._id)
        const updateuser = await UserModel.findByIdAndUpdate(
            findAdmin.id,
            {
                refreshToken: refreshToken
            },
            { new: true }
        )
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000
        })
        res.json({
            _id: findAdmin?._id,
            firstname: findAdmin?.firstname,
            lastname: findAdmin?.lastname,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            token: generateToken(findAdmin?._id)
        })
    } else {
        throw new Error('Invalid Credentials')
    }
})

// handle refresh token
export const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    if (!cookie?.refreshToken) throw new Error('No Refresh Token in Cookies')
    const refreshToken = cookie.refreshToken
    const user = await UserModel.findOne({ refreshToken })
    if (!user) throw new Error(' No Refresh token present in db or not matched')
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error('There is something wrong with refresh token')
        }
        const accessToken = generateToken(user?._id)
        res.json({ accessToken })
    })
})

// logout functionality
export const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    if (!cookie?.refreshToken) throw new Error('No Refresh Token in Cookies')
    const refreshToken = cookie.refreshToken
    const user = await UserModel.findOne({ refreshToken })
    if (!user) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true
        })
        return res.sendStatus(204) // forbidden
    }
    await UserModel.findOneAndUpdate(refreshToken, {
        refreshToken: ''
    })
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    })
    res.sendStatus(204) // forbidden
})

// Update a user
export const updatedUser = asyncHandler(async (req, res) => {
    const { _id } = req.user
    console.log('id user update ', req.user)
    validateMongoDbId(_id)

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            _id,
            {
                firstname: req?.body?.firstname,
                lastname: req?.body?.lastname,
                email: req?.body?.email,
                mobile: req?.body?.mobile
            },
            {
                new: true
            }
        )
        res.json(updatedUser)
    } catch (error) {
        throw new Error(error)
    }
})

// save user Address
export const saveAddress = asyncHandler(async (req, res, next) => {
    const { _id } = req.user
    validateMongoDbId(_id)

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            _id,
            {
                address: req?.body?.address
            },
            {
                new: true
            }
        )
        res.json(updatedUser)
    } catch (error) {
        throw new Error(error)
    }
})

// Get all users
export const getallUser = asyncHandler(async (req, res) => {
    try {
        const getUsers = await UserModel.find().populate('wishlist')
        res.json(getUsers)
    } catch (error) {
        throw new Error(error)
    }
})

// Get a single user
export const getaUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)

    try {
        const getaUser = await UserModel.findById(id)
        res.json({
            getaUser
        })
    } catch (error) {
        throw new Error(error)
    }
})

// Delete a single user
export const deleteaUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)

    try {
        const deleteaUser = await UserModel.findByIdAndDelete(id)
        res.json({
            deleteaUser
        })
    } catch (error) {
        throw new Error(error)
    }
})

// khóa user
export const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params // lay ra id tren url params
    validateMongoDbId(id)

    try {
        // Tim User vas Update trang thai truong du lieu isBlocked
        const blockusr = await UserModel.findByIdAndUpdate(
            id,
            {
                isBlocked: true
            },
            {
                new: true
            }
        )
        res.json(blockusr)
    } catch (error) {
        throw new Error(error)
    }
})

// bỏ khóa user
export const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)

    try {
        const unblock = await UserModel.findByIdAndUpdate(
            id,
            {
                isBlocked: false
            },
            {
                new: true
            }
        )
        res.json({
            message: 'User UnBlocked'
        })
    } catch (error) {
        throw new Error(error)
    }
})

// user cập nhật lại mk
export const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { password } = req.body
    validateMongoDbId(_id)
    const user = await UserModel.findById(_id)
    if (password) {
        user.password = password
        const updatedPassword = await user.save()
        res.json(updatedPassword)
    } else {
        res.json(user)
    }
})

// user quên mật khẩu
export const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body
    const user = await UserModel.findOne({ email })
    if (!user) throw new Error('User not found with this email')
    try {
        const token = await user.createPasswordResetToken()
        await user.save()
        const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</>`
        const data = {
            to: email,
            text: 'Hey User',
            subject: 'Forgot Password Link',
            htm: resetURL
        }
        sendEmail(data)
        res.json(token)
    } catch (error) {
        throw new Error(error)
    }
})

// user đặt lại mật khẩu
export const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body
    const { token } = req.params
    // ma hoa bang scrypto
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await UserModel.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    })
    if (!user) throw new Error(' Token Expired, Please try again later')
    user.password = password
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()
    res.json(user)
})

// user get all wishlist
export const getWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user
    try {
        const findUser = await UserModel.findById(_id).populate('wishlist')
        res.json(findUser)
    } catch (error) {
        throw new Error(error)
    }
})

// user thêm sp vào giỏ hàng
export const userCart = asyncHandler(async (req, res) => {
    const { cart } = req.body
    const { _id } = req.user
    validateMongoDbId(_id)
    try {
        let products = []
        const user = await UserModel.findById(_id)
        // check if user already have product in cart
        const alreadyExistCart = await CartModel.findOne({ orderby: user._id })
        if (alreadyExistCart) {
            alreadyExistCart.remove()
        }
        // thêm sp vào cảrt
        for (let i = 0; i < cart.length; i++) {
            let object = {}
            object.product = cart[i]._id
            object.count = cart[i].count
            object.color = cart[i].color
            let getPrice = await ProductModel.findById(cart[i]._id).select('price').exec()
            object.price = getPrice.price
            products.push(object)
        }

        // tính tổng giá tiền
        let cartTotal = 0
        for (let i = 0; i < products.length; i++) {
            cartTotal = cartTotal + products[i].price * products[i].count
        }

        // add sp vào cart db
        let newCart = await new CartModel({
            products,
            cartTotal,
            orderby: user?._id
        }).save()
        res.json(newCart)
    } catch (error) {
        throw new Error(error)
    }
})

// lấy ra tất cả sp trong giỏ hàng của user
export const getUserCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    validateMongoDbId(_id)
    try {
        const cart = await CartModel.findOne({ orderby: _id }).populate('products.product')
        res.json(cart)
    } catch (error) {
        throw new Error(error)
    }
})

// user delete cart
export const emptyCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    validateMongoDbId(_id)
    try {
        const user = await UserModel.findOne({ _id })
        const cart = await CartModel.findOneAndRemove({ orderby: user._id })
        res.json({ msg: 'delete cart success' })
    } catch (error) {
        throw new Error({ msg: 'fail', error })
    }
})

// user áp dụng mã giảm giá
export const applyCoupon = asyncHandler(async (req, res) => {
    const { coupon } = req.body
    const { _id } = req.user
    validateMongoDbId(_id)
    const validCoupon = await CouponModel.findOne({ name: coupon })
    //  check validate coupon
    if (validCoupon === null) {
        throw new Error('Invalid Coupon')
    }
    const user = await UserModel.findOne({ _id })
    let { cartTotal } = await Cart.findOne({
        orderby: user._id
    }).populate('products.product')

    // Tính toán giá của giỏ hàng sau khi sd mã giảm
    // Đang Saiiiiiii
    let totalAfterDiscount = cartTotal - validCoupon.discount
    await Cart.findOneAndUpdate({ orderby: user._id }, { totalAfterDiscount }, { new: true })
    res.json({
        msg: 'Mã hợp lệ',
        totalAfterDiscount: totalAfterDiscount
    })
})

// User thanh toan tien
export const createOrder = asyncHandler(async (req, res) => {
    const { COD, couponApplied } = req.body
    const { _id } = req.user
    validateMongoDbId(_id)
    try {
        if (!COD) throw new Error('Create cash order failed')
        const user = await UserModel.findById(_id)
        let userCart = await CartModel.findOne({ orderby: user._id })
        let finalAmout = 0
        if (couponApplied && userCart.totalAfterDiscount) {
            finalAmout = userCart.totalAfterDiscount
        } else {
            finalAmout = userCart.cartTotal
        }

        let newOrder = await new Order({
            products: userCart.products,
            paymentIntent: {
                id: uniqid(),
                method: 'COD',
                amount: finalAmout,
                status: 'Cash on Delivery',
                created: Date.now(),
                currency: 'usd'
            },
            orderby: user._id,
            orderStatus: 'Cash on Delivery'
        }).save()
        let update = userCart.products.map((item) => {
            return {
                updateOne: {
                    filter: { _id: item.product._id },
                    update: { $inc: { quantity: -item.count, sold: +item.count } }
                }
            }
        })
        const updated = await ProductModel.bulkWrite(update, {})
        res.json({ message: 'success' })
    } catch (error) {
        throw new Error(error)
    }
})

// User LAY RA ORDER CUA Minh
export const getOrders = asyncHandler(async (req, res) => {
    const { _id } = req.user
    validateMongoDbId(_id)
    try {
        const userorders = await OrderModel.findOne({ orderby: _id })
            .populate('products.product')
            .populate('orderby')
            .exec()
        res.json(userorders)
    } catch (error) {
        throw new Error(error)
    }
})

// Admin Lay ra cac order cua cac user
export const getAllOrders = asyncHandler(async (req, res) => {
    try {
        const alluserorders = await OrderModel.find()
            .populate('products.product')
            .populate('orderby')
            .exec()
        res.json(alluserorders)
    } catch (error) {
        throw new Error(error)
    }
})

// Admin get order by userID
export const getOrderByUserId = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const userorders = await OrderModel.findOne({ orderby: id })
            .populate('products.product')
            .populate('orderby')
            .exec()
        res.json(userorders)
    } catch (error) {
        throw new Error(error)
    }
})

// Admin update status order user
export const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body
    const { id } = req.params // Id cua don hang
    validateMongoDbId(id)
    try {
        const updateOrderStatus = await OrderModel.findByIdAndUpdate(
            id,
            {
                orderStatus: status,
                paymentIntent: {
                    status: status
                }
            },
            { new: true }
        )
        res.json(updateOrderStatus)
    } catch (error) {
        throw new Error(error)
    }
})

// // Export file model Users
// module.exports = {
//     createUser,
//     loginUserCtrl,
//     getallUser,
//     getaUser,
//     deleteaUser,
//     updatedUser,
//     blockUser,
//     unblockUser,
//     handleRefreshToken,
//     logout,
//     updatePassword,
//     forgotPasswordToken,
//     resetPassword,
//     loginAdmin,
//     getWishlist,
//     saveAddress,
//     userCart,
//     getUserCart,
//     emptyCart,
//     applyCoupon,
//     createOrder,
//     getOrders,
//     updateOrderStatus,
//     getAllOrders,
//     getOrderByUserId
// }
