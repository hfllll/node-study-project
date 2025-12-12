import User from '#models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// 注册用户
const registerUser = async (req, res) => {
    try{
        const { username, email, role, password } = req.body
        // if (username){
        //     const findUser = await User.findOne({username})
        //     if (findUser) res.status(400).json({message: '该用户名已被注册'})
        // }
        // if (email){
        //     const findUser = await User.findOne({email})
        //     if (findUser) res.status(400).json({message: '该邮箱已被注册'})
        // }
        const findUser = await User.findOne({$or:[{username}, {email}]})
        if (findUser) {return res.status(400).json({message: '已有该用户', success:false})}
        // 如果都没有问题 就进行注册！
        // const salt = await bcrypt.getSalt(10)   
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({username, email, role, password: hashedPassword})
        if (!newUser) { return res.status(400).json({message: '注册失败 请重试'}) }
        
        res.status(201).json({
            success: true,
            message: '注册成功',
            user: newUser
        })
    }catch(err){
        console.error(err);
        res.status(500).json({
            success: false,
            message: '注册请求失败，请稍后重试'
        })
    }
}

// 登录用户
const loginUser = async (req, res) => {
    try{
        const {username, email, role, password } = req.body
        const findUser = await User.findOne({username, email})
        if (!findUser) { res.status(404).json({message: '用户不存在！', success: false}) }
        // if (findUser.password !== password) { res.status(404).json({message: '密码错误！', success: false}) }
        const isPasswordMatch = await bcrypt.compare(password, findUser.password)
        if (!isPasswordMatch) { return res.status(404).json({message: '密码错误，请重试！', success: false}) }
        if (findUser.role !== role) { return res.status(404).json({message: '用户暂无该身份！', success: false}) }

        const accessToken = jwt.sign({
            userId: findUser._id,
            username: findUser.username,
            role: findUser.role
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: '30m'
        })

        res.status(200).json({
            message: '登录成功！', 
            success: true, 
            accessToken
        })
    }catch(err){
        console.error(err);
        res.status(500).json({
            success: false,
            message: '登录请求失败，请稍后重试'
        })
    }
}

// 修改用户密码
const changePassword = async (req, res) => {
    try{
        const { verifiedPassword, newPassword } = req.body
        const { password: oldPassword} = await User.findById(req.userInfo.userId)
        if(!oldPassword) {
            return res.status(400).json({
                message: '未找到用户！', success: false
            })
        }

        if (!await bcrypt.compare(verifiedPassword, oldPassword)){
            return res.status(400).json({
                message: '密码错误！', success: false
            })
        }
        
        if (await bcrypt.compare(newPassword, oldPassword)) {
            return res.status(400).json({
                message: '新旧密码相同！', success: false
            })
        }

        // 加密新密码
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        const newUser = await User.findByIdAndUpdate(
            req.userInfo.userId,
            {
                $set: { password: hashedPassword }
            },
            { new: true }
        ).select('-password -_id')
        
        if (!newUser) {
            return res.status(500).json({
                message: '密码修改失败!',
                success: false
            })
        }
        
        res.status(200).json({
            message: '密码修改成功!',
            success: true,
            data: newUser
        })

    }catch(err) {
        console.error(err);
        res.status(500).json({
            message: '无法修改密码！',
            success: false
        })
        
    }
}

export {
    loginUser, 
    registerUser,
    changePassword
}