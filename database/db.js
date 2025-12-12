import mongoose from "mongoose";

const connectToDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log('mongoDB连接成功');
        
    }catch(err){
        console.error('mongoDB 连接失败')
        process.exit(1)
    }
}

export { 
    connectToDB
}

