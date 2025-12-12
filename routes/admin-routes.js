import express from 'express'
import authMiddleWare from '#middleware/auth-middleware.js'
import adminMiddleware from '#middleware/admin-middleware.js'
const router = express.Router()

router.get('/welcome', authMiddleWare, adminMiddleware, (req, res) => {
    res.status(200).json({
        message:"欢迎来到管理页面"
    })
})

export default router