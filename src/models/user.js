import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2'

const userSchema = new mongoose.Schema({
    firstName:String,
    lastName:String,
    userName:String,
    email:String,
    password:String
}, {timestamps:true})

userSchema.plugin(paginate);

const User = mongoose.model('User', userSchema);
export default User;