const adminMiddleware = (req, res, next) => {
    if (req.userInfo.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: "需要管理员权限"
        })
    }
    next()
}

export default adminMiddleware