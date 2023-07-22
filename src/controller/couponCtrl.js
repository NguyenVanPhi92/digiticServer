import CouponModel from '../models/couponModel.js'
import validateMongoDbId from '../utils/validateMongodbId.js'
import asynHandler from 'express-async-handler'

// Tạo mã giảm giá
export const createCoupon = asynHandler(async (req, res) => {
    try {
        const newCoupon = await CouponModel.create(req.body)
        res.json(newCoupon)
    } catch (error) {
        throw new Error(error)
    }
})

// Lấy ra tất cả mã giảm
export const getAllCoupons = asynHandler(async (req, res) => {
    try {
        const coupons = await CouponModel.find()
        res.json(coupons)
    } catch (error) {
        throw new Error(error)
    }
})

// Update mã giảm
export const updateCoupon = asynHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const updatecoupon = await CouponModel.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json(updatecoupon)
    } catch (error) {
        throw new Error(error)
    }
})

// Xóa mã giảm
export const deleteCoupon = asynHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const deletecoupon = await CouponModel.findByIdAndDelete(id)
        res.json(deletecoupon)
    } catch (error) {
        throw new Error(error)
    }
})

// Lấy ra mã giảm
export const getCoupon = asynHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const getAcoupon = await CouponModel.findById(id)
        res.json(getAcoupon)
    } catch (error) {
        throw new Error(error)
    }
})
