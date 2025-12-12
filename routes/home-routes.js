import express from 'express'
import authMiddleWare from '#middleware/auth-middleware.js'
// import routes from './auth-routes.js' 
const routes = express.Router()

routes.get('/welcome', authMiddleWare, (req, res) => {
  const { username, userId, role } = req.userInfo
  res.json({
    success: true,
    message: '欢迎来到主页',
    user: {
      _id: userId,
      username,
      role
    }
  })
})

export default routes