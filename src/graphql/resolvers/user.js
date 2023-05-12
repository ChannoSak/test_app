import { hash, compare } from "bcryptjs";
import { ApolloError } from "apollo-server-express";

import {serializeUser, issueAuthRefreshToken, issueAuthToken} from '../../helpers/Userfunctions'
import {UserRegisterationRules, UserAuthenticationRules} from '../../validations'

export default {
    Query:{

    },
    Mutation:{
        registerUser:async(_, {newUser}, {User})=>{
            try {
                let {email, firstName, lastName} = newUser
                await UserRegisterationRules.validate(newUser, {abortEarly:false});
                const checkEmail = await User.findOne({email})
                if(checkEmail){
                    return{
                        success: false,
                        message:"សារអេឡិចត្រូនិចនេះមានម្ដងហើយ"
                    }
                }
                const checkfirstNameAndlastName = await User.findOne({ $and: [{ firstName: firstName }, { lastName: lastName }] })
                if(checkfirstNameAndlastName){
                    return {
                        success:false,
                        message:"ឈ្មោះនេះធ្លាប់បានប្រើម្ដងហើយ"
                    }
                }
                let user = new User(newUser)

                user.password =  await hash(user.password, 10)
                let result = await user.save();
                result = await serializeUser(result)
                let token = await issueAuthToken(result)
                if(result){
                    return {
                        success: true,
                        message: "ការបង្កើតអ្នកប្រើប្រាស់បានជោគជ័យ!",
                      };
                }
            } catch (error) {
                return{
                    success:false,
                    message:"An error occured" + error.message
                }
            }
        },
        loginUser: async (_, { email, password }, { User, RefreshToken }) => {
          try {
            await UserAuthenticationRules.validate({ email, password },{ abortEarly: false });
              let user = await User.findOne({
                email,
              });
              if (!user) {
                throw new ApolloError("មិនមានអ្នកប្រើប្រាស់នៅក្នុងប្រព័ន្ធ");
              }
              let isMatch = await compare(password, user.password);
              if (!isMatch) {
                throw new ApolloError("ពាក្យសម្ងាត់មិនត្រឹមត្រូវ");
              }
              user = serializeUser(user);
              let token = await issueAuthToken(user);
              let refreshToken = await issueAuthRefreshToken(user);
              let deleteToken = await RefreshToken.findOne({ user: user.id });
              let refresh_token = new RefreshToken({
                refreshToken: refreshToken.refreshToken,
                user: user.id,
              });
              let savedRefresh_token = await refresh_token.save();
              if (!savedRefresh_token) {
                throw new ApolloError("មានបញ្ហាបច្ចេកទេស RFT_ សូមទាក់ទងខាង IT");
              }
              const us = await User.findById(user.id);
              return {
                token: token,
                refreshToken: refreshToken,
                user: us,
              };
          } catch (error) {
            return{
                success:false,
                message:"An error occured" + error.message
            }
          }
        },
    }
}