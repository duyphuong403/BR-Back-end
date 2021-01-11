import express from 'express'
import mongoose from 'mongoose'
// import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import createHttpError from 'http-errors'

import { mongodb } from './config/datastore'
import indexRouter from './routes/index'
import userRouter from './routes/user'

/* Using dotenv */
dotenv.config()

const app = express()

app.all("/*", (request, response, next) => {
  // Allow cross-origin api requests
  response.header("Access-Control-Allow-Origin", "*")
  response.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With, X-Auth-Token")
  response.header("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS, DELETE")
  return next()
})

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true}))

// Parse JSON bodies (as sent by API clients)
app.use(express.json())


app.use(express.static('public'))

mongoose.set('useFindAndModify', false)
mongodb(mongoose)

/* Use Express Validator */
// app.use(expressValidator())

/* Routes */
app.use('/', indexRouter)
app.use('/user', userRouter)

/* Catch 404 and forward to error handler */
app.use(function(req, res, next) {
  next(createHttpError(404));
});

/* Errors */
app.use((error, request, response, next) => {
  return (typeof error.toJson == 'function') ? response.status(error.status).json(error.toJson()) : response.status(500).json({
    'error_message': error.message
  })
})

app.listen(process.env.API_PORT, () => {
  console.log('\n\n>> ✅ BR API listening on port: ' + process.env.API_PORT)
})