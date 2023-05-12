import { gql } from "apollo-server-express";

export default gql`
  scalar Date
   extend type Query{
    getUser:[User]
   }

   extend type Mutation{
    registerUser(newUser: UserInput!): UserResponse!
    loginUser(email: String!, password: String!):Loggineduser
    refreshToken(refreshToken:String):String,
   }
   type User{
    firstName:String,
    lastName:String,
    userName:String,
    email:String,
    password:String
   }
   input UserInput{
    firstName:String,
    lastName:String,
    userName:String,
    email:String,
    password:String
   }
   type Loggineduser{
    token:String
    refreshToken:String
    user:User
    }
   type UserResponse{
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
   
`

