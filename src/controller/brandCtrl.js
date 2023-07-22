import BrandModel from '../models/brandModel.js'
import asyncHandler from 'express-async-handler'
import validateMongoDbId from '../utils/validateMongodbId.js'

export const createBrand = asyncHandler(async (req, res) => {
    try {
        const newBrand = await BrandModel.create(req.body)
        res.json(newBrand)
    } catch (error) {
        throw new Error(error)
    }
})

export const updateBrand = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const updatedBrand = await BrandModel.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json(updatedBrand)
    } catch (error) {
        throw new Error(error)
    }
})

export const deleteBrand = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const deletedBrand = await BrandModel.findByIdAndDelete(id)
        res.json(deletedBrand)
    } catch (error) {
        throw new Error(error)
    }
})

export const getBrand = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const getaBrand = await BrandModel.findById(id)
        res.json(getaBrand)
    } catch (error) {
        throw new Error(error)
    }
})

export const getallBrand = asyncHandler(async (req, res) => {
    try {
        const getallBrand = await BrandModel.find()
        res.json(getallBrand)
    } catch (error) {
        throw new Error(error)
    }
})
