import jwt from 'jsonwebtoken';

export default (request, requireAuth = true) => {
  const header = request.request ? request.request.headers.authorization : request.connection.context.Authorization

  if(header) {
    const token = header.replace('Bearer ', '');
    const decoded = jwt.verify(token, 'thisismysecret'); // if fail, jwt send a error message. like invalid token
    return decoded.userId;
  }

  if(requireAuth) {
    throw new Error('Authorization required');
  }

  return null;
}