import CategoryModel from '../models/blogCatModel.js'
import asyncHandler from 'express-async-handler'
import validateMongoDbId from '../utils/validateMongodbId.js'

export const createCategory = asyncHandler(async (req, res) => {
    try {
        const newCategory = await CategoryModel.create(req.body)
        res.json(newCategory)
    } catch (error) {
        throw new Error(error)
    }
})

export const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const updatedCategory = await CategoryModel.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json(updatedCategory)
    } catch (error) {
        throw new Error(error)
    }
})

export const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const deletedCategory = await CategoryModel.findByIdAndDelete(id)
        res.json(deletedCategory)
    } catch (error) {
        throw new Error(error)
    }
})

export const getCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const getaCategory = await CategoryModel.findById(id)
        res.json(getaCategory)
    } catch (error) {
        throw new Error(error)
    }
})

export const getallCategory = asyncHandler(async (req, res) => {
    try {
        const getallCategory = await CategoryModel.find()
        res.json(getallCategory)
    } catch (error) {
        throw new Error(error)
    }
})
