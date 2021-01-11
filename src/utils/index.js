
const apiResponse = (response, status, data) => {
    return response.status(status).json({ status, data })
}

const isValidDob = (dob) => {
    const differentMillisecond = Date.now() - new Date(dob).getTime()
    const age = new Date(differentMillisecond) 
  
    return Math.abs(age.getUTCFullYear() - 1970) >= 16
}

export {
    apiResponse,
    isValidDob
}
