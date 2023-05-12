import { gql } from "apollo-server-express";
export default gql`
  scalar Date
   extend type Query{
    getOfice:[Office]
    getOfficeWithPagination(page:Int, limit:Int, keyword:String):OfficePaginator
   }
   extend type Mutation{
    createOffice(newOffice:OfficeInput):OfficeResponse
    updateOffice(officeId:ID, newOffice:OfficeInput):OfficeResponse
    deleteOffice(officeId:ID):OfficeResponse
   }
   type Office{
    _id:ID
    officeName:String
    note:String
   }
   input OfficeInput{
    officeName:String
    note:String
   }
   type OfficeResponse{
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
  type OfficePaginator{
    offices:[Office]
    paginate:Paginator
  }
   `