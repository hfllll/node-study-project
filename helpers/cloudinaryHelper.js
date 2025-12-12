// import { v2 as cloudinary } from 'cloudinary'
import cloudinary from '#config/cloudinary.js'

const uploadToCloudinary = async (filePath) => {
    try{
        // 在使用时配置，确保环境变量已加载
        // cloudinary.config({
        //     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        //     api_key: process.env.CLOUDINARY_API_KEY,
        //     api_secret: process.env.CLOUDINARY_API_SECRET
        // })

        const result = await cloudinary.uploader.upload(filePath)

        return {
            url: result.secure_url,
            publicId: result.public_id
        }
    }catch(err) {
        console.error('文件上传cloudinary错误', err);
        throw new Error(err)
        
    }
}


export default uploadToCloudinary