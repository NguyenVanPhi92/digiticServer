import asyncHandler from 'express-async-handler'
import fs from 'fs'
import BlogModel from '../models/blogModel.js'
import { cloudinaryUploadImg } from '../utils/cloudinary.js'
import validateMongoDbId from '../utils/validateMongodbId.js'

export const createBlog = asyncHandler(async (req, res) => {
    try {
        const newBlog = await BlogModel.create(req.body)
        res.json(newBlog)
    } catch (error) {
        throw new Error(error)
    }
})

export const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const updateBlog = await BlogModel.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json(updateBlog)
    } catch (error) {
        throw new Error(error)
    }
})

export const getBlog = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const getBlog = await BlogModel.findById(id).populate('likes').populate('dislikes')
        const updateViews = await BlogModel.findByIdAndUpdate(
            id,
            {
                $inc: { numViews: 1 }
            },
            { new: true }
        )
        res.json(getBlog)
    } catch (error) {
        throw new Error(error)
    }
})
export const getAllBlogs = asyncHandler(async (req, res) => {
    try {
        const getBlogs = await BlogModel.find()
        res.json(getBlogs)
    } catch (error) {
        throw new Error(error)
    }
})

export const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const deletedBlog = await BlogModel.findByIdAndDelete(id)
        res.json({
            status: 'success',
            deletedBlog
        })
    } catch (error) {
        throw new Error(error)
    }
})

export const liketheBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body
    validateMongoDbId(blogId)
    // Find the blog which you want to be liked
    const blog = await BlogModel.findById(blogId)
    // find the login user
    const loginUserId = req?.user?._id
    // find if the user has liked the blog
    const isLiked = blog?.isLiked
    // find if the user has disliked the blog
    const alreadyDisliked = blog?.dislikes?.find(
        (userId) => userId?.toString() === loginUserId?.toString()
    )
    if (alreadyDisliked) {
        const blog = await BlogModel.findByIdAndUpdate(
            blogId,
            {
                $pull: { dislikes: loginUserId },
                isDisliked: false
            },
            { new: true }
        )
        res.json(blog)
    }

    // neu user likes...
    if (isLiked) {
        const blog = await BlogModel.findByIdAndUpdate(
            blogId,
            {
                $pull: { likes: loginUserId }, // xoa id cua user da like bai post
                isLiked: false
            },
            { new: true }
        )
        res.json(blog)
    } else {
        const blog = await BlogModel.findByIdAndUpdate(
            blogId,
            {
                $push: { likes: loginUserId }, // them id cua user da like bai post
                isLiked: true
            },
            { new: true }
        )
        res.json(blog)
    }
})

export const disliketheBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body
    validateMongoDbId(blogId)
    // Find the blog which you want to be liked
    const blog = await BlogModel.findById(blogId)
    // find the login user
    const loginUserId = req?.user?._id
    // find if the user has liked the blog
    const isDisLiked = blog?.isDisliked
    // find if the user has disliked the blog
    const alreadyLiked = blog?.likes?.find(
        (userId) => userId?.toString() === loginUserId?.toString()
    )
    if (alreadyLiked) {
        const blog = await BlogModel.findByIdAndUpdate(
            blogId,
            {
                $pull: { likes: loginUserId },
                isLiked: false
            },
            { new: true }
        )
        res.json(blog)
    }
    if (isDisLiked) {
        const blog = await BlogModel.findByIdAndUpdate(
            blogId,
            {
                $pull: { dislikes: loginUserId },
                isDisliked: false
            },
            { new: true }
        )
        res.json(blog)
    } else {
        const blog = await BlogModel.findByIdAndUpdate(
            blogId,
            {
                $push: { dislikes: loginUserId },
                isDisliked: true
            },
            { new: true }
        )
        res.json(blog)
    }
})

export const uploadImages = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const uploader = (path) => cloudinaryUploadImg(path, 'images')
        const urls = []
        const files = req.files
        for (const file of files) {
            const { path } = file
            const newpath = await uploader(path)
            console.log(newpath)
            urls.push(newpath)
            fs.unlinkSync(path)
        }
        const findBlog = await BlogModel.findByIdAndUpdate(
            id,
            {
                images: urls.map((file) => {
                    return file
                })
            },
            {
                new: true
            }
        )
        res.json(findBlog)
    } catch (error) {
        throw new Error(error)
    }
})
