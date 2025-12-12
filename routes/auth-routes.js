import express from 'express'
import authMiddleware from '#middleware/auth-middleware.js'
import { registerUser, loginUser, changePassword as changePasswordController } from '#controllers/auth-controller.js'


const routes = express.Router()

routes.post('/register', registerUser)
routes.post('/login', loginUser)
routes.post('/changepassword', authMiddleware, changePasswordController)

export default routes