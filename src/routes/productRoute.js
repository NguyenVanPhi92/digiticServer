import express from 'express'
import {
    addToWishlist,
    createProduct,
    deleteProduct,
    getAllProduct,
    getaProduct,
    rating,
    updateProduct,
    uploadImages
} from '../controller/productCtrl.js'
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js'
import { productImgResize, uploadPhoto } from '../middlewares/uploadImage.js'

const router = express.Router()

router.post('/', authMiddleware, isAdmin, createProduct)
router.get('/:id', getaProduct)
router.put('/wishlist', authMiddleware, addToWishlist)
router.put('/rating', authMiddleware, rating)
router.put(
    '/upload/:id',
    authMiddleware,
    isAdmin,
    uploadPhoto.array('images', 10),
    productImgResize,
    uploadImages
)
router.put('/:id', authMiddleware, isAdmin, updateProduct)
router.delete('/:id', authMiddleware, isAdmin, deleteProduct)
router.get('/', getAllProduct)

export default router
