import express from 'express'
import { deleteImages, uploadImages } from '../controller/uploadCtrl.js'
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js'
import { uploadPhoto } from '../middlewares/uploadImage.js'

const router = express.Router()

router.put(
    '/',
    authMiddleware,
    isAdmin,
    uploadPhoto.array('images', 10),
    // productImgResize,
    uploadImages
)
router.delete('/delete-img/:id', authMiddleware, isAdmin, deleteImages)

export default router
