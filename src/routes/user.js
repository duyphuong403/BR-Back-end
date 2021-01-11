import { Router } from 'express'

import * as UserController from '../api/User'
import { validateRegisterUser } from '../utils/validator'
import upload from '../middlewares/uploadImage'

const router = Router()

router.get('/lists', UserController.default.getUser)

router.post('/signup', validateRegisterUser(), UserController.default.createUser)

router.post('/upload-avatar', upload.single('file'), UserController.default.uploadImage)

export default router