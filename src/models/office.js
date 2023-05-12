import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2'

const officeSchema = new mongoose.Schema({
    officeName:String,
    note:String
}, {timestamps:true})

officeSchema.plugin(paginate);

const Office = mongoose.model('Office', officeSchema);
export default Office;