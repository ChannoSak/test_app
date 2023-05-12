import { gql } from "apollo-server-express";

export default gql`
     scalar Date
   extend type Query{
    getMeetingRoom:[MeetingRoom!]!
    getMeetingRoomByID(meetingRoomId:ID):MeetingRoom
    getMeetingRoomWithPagination(page:Int, limit:Int, keyword:String):userPaginator!

    getMeetingTimeByDay(dayOfWeek:String):[getTimeByDay]
   }

   extend type Mutation{
    createMeetingRoom(newMeetingRoom:roomInput):RoomMeetingResponse
    updateMeetingRoom(newMeetingRoom:roomInput, roomId:ID):RoomMeetingResponse

    addMeetingTimeToRoom(roomId:ID, newTime:meetingTimeInput):RoomMeetingResponse
    updateMeetingTimeToRoom(roomId:ID, meetingTimeId:ID, newTime:meetingTimeInput):RoomMeetingResponse
    deleteMeetingTimeFromRoom(roomId:ID, meetingTimeId:ID):RoomMeetingResponse
   }
   type MeetingRoom{
    _id:ID
     roomName:String
     topic:String
     meetingTime:[MeetingTime]
     officeId:Office
     members:Int
     note:String
   }
   input roomInput{
     roomName:String
     topic:String
     meetingTime:[meetingTimeInput]
     officeId:ID
     members:Int
     note:String
   }
   type getTimeByDay{
    startTime:Date
    duration:Int
    endTime:Date
    dayOfWeek:String
   }
   type MeetingTime{
      _id:ID
     startTime:Date
     duration:Float
     endTime:Date
     dayOfWeek:String
   }

   input meetingTimeInput{
     startTime:Date
     duration:Float
     endTime:Date
     dayOfWeek:String
   }

   type RoomMeetingResponse{
     success:Boolean
     message:String
   }

   type Paginator {
    slNo: Int
    prev: Int
    next: Int
    perPage: Int
    totalPosts: Int
    totalPages: Int
    currentPage: Int
    hasPrevPage: Boolean
    hasNextPage: Boolean
    totalDocs:Int
   }

   type userPaginator{
    room:[MeetingRoom]
    paginate:Paginator
   }
`

