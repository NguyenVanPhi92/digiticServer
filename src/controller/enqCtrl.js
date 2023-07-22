import EnquiryModel from '../models/enqModel.js'
import asyncHandler from 'express-async-handler'
import validateMongoDbId from '../utils/validateMongodbId.js'

export const createEnquiry = asyncHandler(async (req, res) => {
    try {
        const newEnquiry = await EnquiryModel.create(req.body)
        res.json(newEnquiry)
    } catch (error) {
        throw new Error(error)
    }
})

export const updateEnquiry = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const updatedEnquiry = await EnquiryModel.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json(updatedEnquiry)
    } catch (error) {
        throw new Error(error)
    }
})

export const deleteEnquiry = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const deletedEnquiry = await EnquiryModel.findByIdAndDelete(id)
        res.json(deletedEnquiry)
    } catch (error) {
        throw new Error(error)
    }
})

export const getEnquiry = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const getaEnquiry = await EnquiryModel.findById(id)
        res.json(getaEnquiry)
    } catch (error) {
        throw new Error(error)
    }
})

export const getallEnquiry = asyncHandler(async (req, res) => {
    try {
        const getallEnquiry = await EnquiryModel.find()
        res.json(getallEnquiry)
    } catch (error) {
        throw new Error(error)
    }
})
