import express from 'express'
import {
    createEnquiry,
    updateEnquiry,
    deleteEnquiry,
    getEnquiry,
    getallEnquiry
} from '../controller/enqCtrl.js'
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/', createEnquiry)
router.put('/:id', authMiddleware, isAdmin, updateEnquiry)
router.delete('/:id', authMiddleware, isAdmin, deleteEnquiry)
router.get('/:id', getEnquiry)
router.get('/', getallEnquiry)

export default router
