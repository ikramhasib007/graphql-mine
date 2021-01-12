import jwt from 'jsonwebtoken';

export default (userId) => {
  return jwt.sign({ userId }, 'thisismysecret', { expiresIn: '30 days' })
}
