import ColorModel from '../models/colorModel.js'
import asyncHandler from 'express-async-handler'
import validateMongoDbId from '../utils/validateMongodbId.js'

export const createColor = asyncHandler(async (req, res) => {
    try {
        const newColor = await ColorModel.create(req.body)
        res.json(newColor)
    } catch (error) {
        throw new Error(error)
    }
})

export const updateColor = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const updatedColor = await ColorModel.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json(updatedColor)
    } catch (error) {
        throw new Error(error)
    }
})

export const deleteColor = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const deletedColor = await ColorModel.findByIdAndDelete(id)
        res.json(deletedColor)
    } catch (error) {
        throw new Error(error)
    }
})

export const getColor = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const getaColor = await ColorModel.findById(id)
        res.json(getaColor)
    } catch (error) {
        throw new Error(error)
    }
})

export const getallColor = asyncHandler(async (req, res) => {
    try {
        const getallColor = await ColorModel.find()
        res.json(getallColor)
    } catch (error) {
        throw new Error(error)
    }
})
