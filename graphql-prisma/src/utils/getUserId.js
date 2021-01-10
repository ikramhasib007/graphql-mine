import jwt from 'jsonwebtoken';

export default ({request}) => {
  const header = request.headers.authorization;
  if(!header) throw new Error('Authorization required');
  const token = header.replace('Bearer ', '');
  const decoded = jwt.verify(token, 'thisismysecret'); // if fail, jwt send a error message. like invalid token
  return decoded.userId;
}