const isUnprocessableEntity = (response, error) => {
  return response.status(422).json({ errors: error })
}

const isBadRequest = (response, error) => {
  return response.status(400).json({ error: error })
}

const isUnauthorized = (response, error) => {
  return response.status(401).json({ error: error })
}

export { 
  isUnprocessableEntity,
  isBadRequest,
  isUnauthorized
}