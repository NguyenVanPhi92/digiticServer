import express from 'express'
import {
    createBlog,
    updateBlog,
    getBlog,
    getAllBlogs,
    deleteBlog,
    liketheBlog,
    disliketheBlog,
    uploadImages
} from '../controller/blogCtrl.js'
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js'
import { blogImgResize, uploadPhoto } from '../middlewares/uploadImage.js'

const router = express.Router()

router.post('/', authMiddleware, isAdmin, createBlog)
router.put(
    '/upload/:id',
    authMiddleware,
    isAdmin,
    uploadPhoto.array('images', 2),
    blogImgResize,
    uploadImages
)
router.put('/likes', authMiddleware, liketheBlog)
router.put('/dislikes', authMiddleware, disliketheBlog)
router.put('/:id', authMiddleware, isAdmin, updateBlog)
router.get('/:id', getBlog)
router.get('/', getAllBlogs)
router.delete('/:id', authMiddleware, isAdmin, deleteBlog)

export default router
