const OfficeLabels = {
    docs: "offices",
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
        getOfice:async(_, {}, {Office})=>{
            try {
                const offices = await Office.find({})
                return offices
            } catch (error) {
                return{
                    success:false,
                    message:"An error occured" + error.message
                }
            }
        },
        getOfficeWithPagination:async(_, {page, limit, keyword}, {Office})=>{
            try {
                const options = {
                    page: page || 1,
                    limit: limit || 10,
                    customLabels: OfficeLabels,
                    sort: {
                        createdAt: -1,
                    },
                    populate: "",
                };
                let query = {
                    
                };
                const offices = await Office.paginate(query, options);
                return offices;
            } catch (error) {
                return{
                    success:false,
                    message:"An error occured" + error.message
                }
            }
        }
    },
    Mutation:{
        createOffice:async(_,{newOffice}, {Office})=>{
            
            try {
                const offices =  await Office.findOne({officeName:newOffice.officeName})
                if(offices){
                    return {
                        success:false,
                        message:"ការិយាល័យមាននៅក្នុងប្រព័ន្ធរួចរាល់ហើយ"
                    }
                }
                const office =  new Office(newOffice)
                const isCreated = await office.save()
                if(!isCreated){
                    return {
                        success:false,
                        message:"ការបង្កើតការិយាល័យបានបរាជ័យ"
                    }
                }
                return{
                    success:true,
                    message:"ការបង្កើតការិយាល័យបានជោគជ័យ"
                }
            } catch (error) {
                return{
                    success:false,
                    message:"An error occured" + error.message
                }
            }
        },
        updateOffice:async(_, {officeId, newOffice}, {Office})=>{
            try {
                const officeIds =  await Office.findById(officeId)
                if(!officeIds){
                    return{
                        success:false,
                        message:"មិនមានការិយាល័យនៅក្នុងប្រព័ន្ធទេ" + error.message
                    }
                }
                const office  =  await Office.findByIdAndUpdate(officeId, newOffice)
                if(!office){
                    return{
                        success:false,
                        message:"ការធ្វើបច្ចុប្បន្នភាពការិយាល័យបានបរាជ័យ" + error.message
                    }
                }
                
                return{
                    success:true,
                     message:"ការធ្វើបច្ចុប្បន្នភាពការិយាល័យបានជោគជ័យ" 
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