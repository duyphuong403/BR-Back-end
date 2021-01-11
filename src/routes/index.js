import { Router } from 'express'
import { apiResponse } from '../utils'

const router = Router()

router.get('/', async (request, response, next) => {
    apiResponse(response, 200, 'Welcome to BR API Server')
})

export default router