import express from 'express'
import { 
    uploadImage as uploadImageController, 
    fetchImage as fetchImageController,
    deleteImage as deleteImageController
} from '#controllers/image-controller.js'
import authMiddleWare from '#middleware/auth-middleware.js'
import adminMiddleware from '#middleware/admin-middleware.js'
import uploadMiddleware from '#middleware/upload-middleware.js'

const router = express.Router()

router.post(
    '/upload', 
    authMiddleWare, 
    adminMiddleware, 
    // 用 Multer 接收前端字段名为 image 的单文件上传，并把文件放入 req.file 供下一个函数使用。
    uploadMiddleware.single('image'), 
    uploadImageController
)

router.get(
    '/fetch',
    authMiddleWare,
    fetchImageController
)

router.delete(
    '/delete/:id',
    authMiddleWare,
    deleteImageController
)

export default router