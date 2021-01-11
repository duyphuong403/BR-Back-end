const { body } = require('express-validator')

const validateRegisterUser = () => {
  return [
    body('FirstName', 'Invalid FirstName').trim().notEmpty(),
    body('FirstName', 'FirstName cannot more than 255 characters').isLength({ max: 255 }),
    body('LastName', 'Invalid LastName').trim().notEmpty(),
    body('LastName', 'LastName cannot more than 255 characters').isLength({ max: 255 }),
    body('Email', 'Invalid Email').trim().notEmpty().isEmail(),
    body('Password', 'Invalid Password').trim().notEmpty(),
    body('Password', 'Password must be at least 1 number, 1 uppercase, 1 lowercase and more than 8 characters').matches(/(^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$)/),
    body('Dob', 'Invalid birthday (must in format yyyy-mm-dd)').trim().isISO8601('yyyy-mm-dd'),
    body('Gender', 'Gender cannot empty').trim().notEmpty(),
    body('Gender', 'Gender cannot more than 10 characters').isLength({ max: 10 }),
    body('Address', 'Address cannot empty').trim().notEmpty(),
    body('Address', 'Address cannot more than 255 characters').isLength({ max: 255 }),
  ]
}

export {
  validateRegisterUser
}