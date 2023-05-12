const RoomLabels = {
    docs: "room",
    limit: "perPage",
    nextPage: "next",
    prevPage: "prev",
    meta: "paginator",
    page: "currentPage",
    pagingCounter: "slNo",
    totalDocs: "totalDocs",
    totalPages: "totalPages",
};

export default {
    Query: {
        getMeetingRoom:async(_, {}, {RoomMeeting})=>{
            try {
                const rooms = await RoomMeeting.find({}).populate("officeId")
                return rooms
            } catch (error) {
                return{
                    success:false,
                    message:"An error occured" + error.message
                }
            }
        },
        getMeetingRoomByID:async(_, {meetingRoomId}, {RoomMeeting})=>{
            try {
                const roomId = await RoomMeeting.findById(meetingRoomId)
                if(!roomId){
                    return{
                        success:false,
                        message:"មិនមានបន្ទប់ប្រជុំនៅក្នុងប្រព័ន្ធទេ!"
                    }
                }
                return{
                    success:true,
                    message:"ការបង្កើតបន្ទប់ប្រជុំទទួលបានជោគជ័យ"
                }
            } catch (error) {
                return{
                    success:false,
                    message:"An error occured" + error.message
                }
            }
        },
        getMeetingRoomWithPagination:async(_, {page, limit, keyword}, {RoomMeeting})=>{
            try {
                const options = {
                    page: page || 1,
                    limit: limit || 10,
                    customLabels: RoomLabels,
                    sort: {
                        createdAt: -1,
                    },
                    populate: "officeId",
                };
                let query = {
                    
                };
                const roomMeeting = await RoomMeeting.paginate(query, options);
                return roomMeeting;
            } catch (error) {
                return{
                    success:false,
                    message:"An error occured" + error.message
                }
            }
        },
        getMeetingTimeByDay:async(_, {dayOfWeek}, {RoomMeeting})=>{
            try {
                let query = [
                    
                    {
                        $unwind:"$meetingTime"
                    },
                    {
                        $project:{
                            _id:1,
                            startTime:"$meetingTime.startTime",
                            duration:"$meetingTime.duration",
                            endTime:"$meetingTime.endTime",
                            dayOfWeek:"$meetingTime.dayOfWeek",
                        }
                    },
                    { $match : { dayOfWeek : dayOfWeek } } ,
                    
                ]
                let day = await RoomMeeting.aggregate(query);
                return day
            } catch (error) {
                return{
                    success:false,
                    message:"An error occured" + error.message
                }
            }
        }
    },
    Mutation:{
        createMeetingRoom:async(_, {newMeetingRoom}, {RoomMeeting})=>{
            try {
                const rooms = await RoomMeeting.findOne({roomName:newMeetingRoom.roomName})
                if(rooms){
                    return{
                        success:false,
                        message:"បន្ទប់ប្រជុំនេះមានរួចហើយ!"
                    }
                }
                const room = new RoomMeeting(newMeetingRoom);
                const isCreated = await room.save()
                if(!isCreated){
                    return{
                        success:false,
                        message:"ការបង្កើតបន្ទប់ប្រជុំបានបរាជ័យ!"
                    }
                }
                return {
                    success:true,
                    message:"ការបង្កើតបន្ទប់ប្រជុំទទួលបានជោគជ័យ"
                }
            } catch (error) {
                return{
                    success:false,
                    message:"An error occured" + error.message
                }
            }
        },
        updateMeetingRoom:async(_, {roomId,newMeetingRoom}, {RoomMeeting})=>{
            try {
                const room = await RoomMeeting.findById(roomId)
                if(!room){
                    return{
                        success:false,
                        message:"បន្ទប់ប្រជុំមិនមាននៅក្នុងប្រព័ន្ធនេះទេ"
                    }
                }
                const updated = await RoomMeeting.findByIdAndUpdate(roomId,newMeetingRoom)
                if(!updated){
                    return{
                        success:false,
                        message:"ការធ្វើបច្ចុប្បន្នភាពបន្ទប់ប្រជុំបានបរាជ័យ!"
                    }
                }
                return{
                    success:true,
                    message:"ការធ្វើបច្ចុប្បន្នភាពបន្ទប់ប្រជុំបានជោគជ័យ"
                }
            } catch (error) {
                return{
                    success:false,
                    message:"An error occured" + error.message
                }
            }
        },
        addMeetingTimeToRoom:async(_, {roomId, newTime}, {RoomMeeting})=>{
            try {

                const { startTime, endTime, dayOfWeek } = newTime;
                const exist = await RoomMeeting.findById(roomId);
                const newArr = exist.meetingTime.map((time) => {
                  return {
                    startTime: time.startTime,
                    endTime: time.endTime,
                    dayOfWeek: time.dayOfWeek,
                  };
                });
        
                // time overlaping
                const isOverlaping = newArr.some((time) => {
                  return (
                    ((startTime >= time.startTime && startTime <= time.endTime) ||
                    (endTime >= time.startTime && endTime <= time.endTime) ||
                    (startTime <= time.startTime && endTime >= time.endTime)) && dayOfWeek < time.dayOfWeek
                  );
                });
        
                if (isOverlaping) {
                  return {
                    success: false,
                    message: "កំពុងមានការប្រជុំនៅម៉ោងនេះ",
                  };
                }
               const addTime =  await RoomMeeting.updateOne({roomId}, {
                $push:{
                    meetingTime:newTime
                }
               })
               if(!addTime){
                    return{
                        success:false,
                        message:"ការបង្កើតម៉ោប្រជុំបានបរាជ័យ"
                    }
               }
               return{
                success:true,
                message:"ការបង្កើតម៉ោងប្រជុំបានជោគជ័យ"
               }
            } catch (error) {
                return{
                    success:false,
                    message:"An error occured" + error.message
                }
            }
        },
        updateMeetingTimeToRoom:async(_, {roomId, meetingTimeId, newTime}, {RoomMeeting})=>{
            try {
                const rooms = await RoomMeeting.findById(roomId)
                if(!rooms){
                    return {
                        success:false,
                        message:"មិនមានបន្ទប់ប្រជុំនៅក្នុងប្រព័ន្ធ!"
                    }
                }
                const update =  await RoomMeeting.updateOne(
                    {_id:roomId, meetingTimeId},
                    {
                        $set:{
                            meetingTime:newTime
                        }
                    }
                )
                if(!update){
                    return{
                        success:false,
                        message:"ការធ្វើបច្ចុប្បន្នភាពម៉ោងប្រជុំបានបរាជ័យ"
                    }
                }
                return{
                    success:true,
                    message:"ការធ្វើបច្ចុប្បន្នភាពម៉ោងប្រជុំបានជោគជ័យ"
                   }
            } catch (error) {
                return{
                    success:false,
                    message:"An error occured" + error.message
                }
            }
        },
        deleteMeetingTimeFromRoom:async(_, {roomId, meetingTimeId}, {RoomMeeting})=>{
            try {
                const rooms = await RoomMeeting.findById(roomId)
                if(!rooms){
                    return {
                        success:false,
                        message:"មិនមានបន្ទប់ប្រជុំនៅក្នុងប្រព័ន្ធ!"
                    }
                }
                const deletedTime =  await RoomMeeting.updateOne(
                    {_id:roomId},
                    {
                        $pull:{meetingTime:meetingTimeId}
                    }
                )
                if(!deletedTime){
                    return{
                        success:false,
                        message:"ការលុបម៉ោងប្រជុំបានបរាជ័យ"
                    }
                }
                return{
                    success:true,
                    message:"ការលុបម៉ោងប្រជុំបានជោគជ័យ"
                   }
            } catch (error) {
                return{
                    success:false,
                    message:"An error occured" + error.message
                }
            }
        }
    }
}