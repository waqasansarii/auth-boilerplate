import logger from '../config/logger.js';
import { authenticateUser, createUser } from '../services/auth.service.js';
import { cookieOptions } from '../utils/cookie.js';
import { formatValidationErrors } from '../utils/format.js';
import { jwtServices } from '../utils/jwt.js';
import { loginSchema, signupSchema } from '../validations/auth.validation.js';

export const signup = async (req, res, next) => {
  try {
    const validate = signupSchema.safeParse(req.body);
    if (!validate.success) {
      const formatErrors = formatValidationErrors(validate.error);
      return res
        .status(400)
        .json({ error: 'validation error', details: formatErrors });
    }
    // const { email, name, password, role } = validate.data;
    const user = await createUser(validate.data);
    const token = jwtServices.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    cookieOptions.set(res, 'token', token);

    return res
      .status(201)
      .json({ message: 'User created successfully', user, token });
  } catch (err) {
    logger.error('Error during sign-up', { error: err });
    if (err.message === 'User already exists') {
      return res.status(409).json({ error: 'User already exists' });
    }
    next(err);
  }
};

export const signin = async (req, res, next) => {
  try {
    const validate = loginSchema.safeParse(req.body);
    if (!validate.success) {
      const formatErrors = formatValidationErrors(validate.error);
      return res
        .status(400)
        .json({ error: 'validation error', details: formatErrors });
    }

    const user = await authenticateUser(
      validate.data.email,
      validate.data.password
    );
    const token = jwtServices.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    cookieOptions.set(res, 'token', token);

    return res
      .status(200)
      .json({ message: 'User signed in successfully', user, token });
  } catch (err) {
    logger.error('Error during sign-in', { error: err });
    if (err.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }
    next(err);
  }
};

export const signout = (req, res, next) => {
  try {
    cookieOptions.clear(res, 'token');
    return res.status(200).json({ message: 'User signed out successfully' });
  } catch (err) {
    logger.error('Error during sign-out', { error: err });
    next(err);
  }
};
