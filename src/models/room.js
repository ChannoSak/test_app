import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2'

const roomSchema = new mongoose.Schema({
    roomName:String,
    topic:String,
    meetingTime:[{
      startTime:Date,
      duration:Number,
      endTime:Date,
      dayOfWeek:String
    }],
    officeId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Office"
    },
    members:Number,
    note:String
}, {timestamps:true})

roomSchema.plugin(paginate);

const RoomMeeting = mongoose.model('RoomMeeting', roomSchema);
export default RoomMeeting;