// import Image from '../models/Image.js'
import Image from '#models/Image.js'
import uploadToCloudinary from '#helpers/cloudinaryHelper.js';
import cloudinary from '#config/cloudinary.js';
import fs from 'fs'

const uploadImage = async (req,res) => {
    try{
        if (!req.file) {return res.status(404).json({success:false,message: '文件缺失！'})}

        const {publicId, url} = await uploadToCloudinary(req.file.path)
        const newlyUploadedImage = await Image.create({
            url,
            publicId,
            uploadedBy: req.userInfo.userId,
        })

        if (!newlyUploadedImage) { return res.status(500).json({success: false, message: '文件存储失败'}) }

        // 上传成功后删除本地文件
        try {
            fs.unlinkSync(req.file.path)
        } catch (err) {
            console.error('删除本地文件失败:', err)
        }

        res.status(201).json({
            success: true,
            message: '图片上传成功！',
            data: newlyUploadedImage
        })

    }catch(err){
        console.log(err);

        res.status(500).json({
            success: false,
            message: '上传文件失败！'
        })

    }
}

const fetchImage = async (req, res) => {
    try{
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 5
        const skip = (page - 1) * limit
        const sortBy = req.query.sortBy || 'createdAt'
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1
        const totalImages = await Image.countDocuments()
        const totalPages = Math.ceil(totalImages / limit)
        const sortObj = { [sortBy] : sortOrder }

        const images = await Image.find()
        .sort(sortObj)
        .skip(skip)
        .limit(limit)


        res.status(200).json({
            success: true,
            message: '获取图片成功！',
            currentPage: page,
            totalPages,
            totalImages,
            limit,
            data: images
        })
    }catch(err){
        console.error(err);
        res.status(500).json({message: '获取图片失败', success: false})
    }
}

const deleteImage = async (req, res) => {
    try{
        const targetId = req.params.id
        
        // 在数据库中搜索图片
        const foundImage = await Image.findById(targetId)
        if (!foundImage) {
            return res.status(400).json({
                message: '未找到目标图片！',
                success: false
            })
        }

        // 是否是上传者？
        // console.log(foundImage.uploadedBy, req.userInfo.userId);
        
        if (foundImage.uploadedBy.toString() !== req.userInfo.userId){
            return res.status(400).json({
                message: '非上传者，无法删除！',
                success: false
            })
        }

        // 进行两端的删除操作
        await cloudinary.uploader.destroy(foundImage.publicId)
        const deletedImage = await Image.findByIdAndDelete(targetId)

        if (!deletedImage){
            return res.status(400).json({
                message: '数据库删除图片失败！',
                success: false
            })
        }

        res.status(200).json({
            message: '删除图片成功！',
            success: true,
            data: deletedImage
        })
        
    }catch(err){

        console.error(err); 
        res.status(500).json({
            success: false, message: '删除失败！'
        })
    }
}

export {
  uploadImage,
  fetchImage,
  deleteImage
} 