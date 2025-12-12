import jwt from 'jsonwebtoken'

const authMiddleWare = (req, res, next) => {
  const accessToken = req.headers['authorization']
  const token = accessToken && accessToken.split(' ')[1]

  if (!token) { return res.status(401).json({message: '请先登录', success: false})}
  try{
    
    const userInfo = jwt.verify(token, process.env.JWT_SECRET_KEY)
    req.userInfo = userInfo
    // console.log(req.userInfo);
    
    next()
  }catch(err) {
    console.error(err);
    return res.status(500).json({
      message: '请重新登录',
      success: false
    })
  }

}

export default authMiddleWare