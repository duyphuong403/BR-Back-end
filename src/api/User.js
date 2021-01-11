import { validationResult } from "express-validator"
import jwt from 'jsonwebtoken'

import { UserModel } from "../models/User"
import { apiResponse, isValidDob, unlinkAsync } from "../utils"
import { isUnprocessableEntity, isBadRequest, isUnauthorized } from "../exceptions"

export default {
  createUser: async (request, response, next) => {
    try {
      /* Validate request body */
      const errors = validationResult(request)

      if (!errors.isEmpty()) {
        return isUnprocessableEntity(response, errors.array())
      }

      const user = request.body

      const userModel = new UserModel()

      /* Check if age smaller than 16 years old */
      if (!isValidDob(user.Dob)) return isUnprocessableEntity(response, 'DOB cannot smaller than 16 years old')

      /* Call API to create document */
      return await userModel.saveUser([user]).then((result) => {
        const tokenSecret = process.env.TOKEN_SECRET || ''

        if (result && '_id' in result[0]) {
          const token = jwt.sign({
            _id: result[0]._id,
            _email: result[0].Email
          }, tokenSecret, {
            expiresIn: '1d'
          })

          apiResponse(response, 200, token)
        }
      }).catch(error => isBadRequest(response, error.message))

    } catch (error) {
      apiResponse(response, 500, 'Sign Up Failed')
      console.log(error.message)
    }
  },

  uploadImage: (request, response, next) => {
    try {
      /* Validate Uploaded file */
      if (request.fileValidationError) {
        return isBadRequest(response, request.fileValidationError);
      }

      if (request.error) {
        return isBadRequest(response, request.error);
      }

      if (!request.file) {
        return isBadRequest(response, 'Please select an image to upload');
      }

      /* Check token */
      if (!request.headers.authorization) {
        /* Remove the file */
        unlinkAsync(request.file.path)
        return isBadRequest(response, 'Invalid Token')
      }

      const userModel = new UserModel()

      /* Verify token */
      let tokenSecret = process.env.TOKEN_SECRET || ''

      jwt.verify(request.headers.authorization, tokenSecret = process.env.TOKEN_SECRET || ''
      , (error, verifiedJwt) => {
        if (error) {
          return isUnauthorized(response, 'Unauthorized')
        } else {
          const userId = verifiedJwt._id

          const url = request.protocol + '://' + request.get('host')
          
          const updateUser = {
            AvatarURL: `${url}/images/avatars/${request.file.filename}`
          }

          userModel.updateUser(userId, updateUser).then(() => {
            return apiResponse(response, 200, 'Success')
          }).catch(error => {
            apiResponse(response, 500, error)
          })
        }
      })
    } catch (error) {
      return apiResponse(response, 500, error.message)
    }
  },

  getUser: (request, response, next) => {
    try {
      const userModel = new UserModel()

      return userModel.getUsers().then((result) => {
        apiResponse(response, 200, result)
      }).catch(error => isBadRequest(response, error.message))
    } catch (error) {
      console.log(error)
      return apiResponse(response, 500, 'Cannot get user')
    }
  }
}