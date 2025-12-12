import dotenv from 'dotenv'
import express from 'express'
import { connectToDB } from '#database/db.js'

// 先加载环境变量
dotenv.config()

const PORT = process.env.PORT || 3000
const app = express()

// 使用动态导入，确保在 dotenv 之后加载
const startServer = async () => {
    // 动态导入路由，此时环境变量已加载
    const { default: authorRoutes } = await import('#routes/auth-routes.js')
    const { default: homeRoutes } = await import('#routes/home-routes.js')
    const { default: adminRoutes } = await import('#routes/admin-routes.js')
    const { default: uploadImageRoutes } = await import('#routes/image-routes.js')

    app.use(express.json())
    app.use('/api/auth', authorRoutes)
    app.use('/api/home', homeRoutes)
    app.use('/api/admin', adminRoutes)
    app.use('/api/image', uploadImageRoutes)

    connectToDB()

    app.listen(PORT, () => {
        console.log('端口运行在' + PORT)
    })
}

startServer().catch(err => {
    console.error('服务器启动失败:', err)
    process.exit(1)
})

// 无法完全配置环境变量的动态写法
// import authorRoutes from './routes/auth-routes.js'
// import homeRoutes from './routes/home-routes.js'
// import adminRoutes from './routes/admin-routes.js'
// import uploadImageRoutes from './routes/image-routes.js'

// connectToDB()

// const PORT = process.env.PORT || 3000

// const app = express()
// app.use(express.json())
// app.use('/api/auth', authorRoutes)
// app.use('/api/home', homeRoutes)
// app.use('/api/admin', adminRoutes)
// app.use('/api/image', uploadImageRoutes)

// app.listen(PORT, () => {
//     console.log('端口运行在' + PORT);
    
// })

