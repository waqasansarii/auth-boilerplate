import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRES_IN = '1d';

export const jwtServices = {
  sign: payload => {
    try {
      const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      });
      return token;
    } catch (error) {
      logger.error('Error signing JWT: ', error);
      throw new Error('Error signing JWT');
    }
  },
  verify: token => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded;
    } catch (error) {
      logger.error('Error verifying JWT: ', error);
      throw new Error('Error verifying JWT');
    }
  },
};
