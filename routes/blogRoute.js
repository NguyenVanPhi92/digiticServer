const express = require('express')
const {
    createBlog,
    updateBlog,
    getBlog,
    getAllBlogs,
    deleteBlog,
    liketheBlog,
    disliketheBlog,
    uploadImages
} = require('../controller/blogCtrl')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')
const { blogImgResize, uploadPhoto } = require('../middlewares/uploadImage')
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
//updateBlog
router.put('/:id', authMiddleware, isAdmin, updateBlog)
// getBlog
router.get('/:id', getBlog)
// getAllBlogs
router.get('/', getAllBlogs)
// deleteBlog
router.delete('/:id', authMiddleware, isAdmin, deleteBlog)

module.exports = router
