import mongoose from 'mongoose'
import dotenv from 'dotenv'
import {error, success} from 'consola'

dotenv.config()


const connectDB = async()=>{
    try{
        //Live DB :
        // await mongoose.connect(process.env.DB_RUL,{useNewUrlParser: true, useUnifiedTopology: true}); 
        
        //Local DB :
        const conn =  await mongoose.connect(`mongodb://127.0.0.1:27017/room_meeting`,{useNewUrlParser: true, useUnifiedTopology: true}) 
        
        success({
            badge: true,
            message: `Successfully connected with the database`,
        });
    }catch(err){
        error({
            badge: true,
            message: err.message,
        });
    }
}

export default connectDB;
