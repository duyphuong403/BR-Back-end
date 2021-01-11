import { Router } from 'express'
import { apiResponse } from '../utils'

const router = Router()

router.get('/', async (request, response, next) => {
    apiResponse(response, 200, request.protocol + '://' + request.get('host'))
})

export default router