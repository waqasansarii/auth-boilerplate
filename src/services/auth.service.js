import bcrypt from 'bcrypt';
import logger from '../config/logger.js';
import { db } from '../config/database.js';
import { users } from '../models/user.model.js';
import { eq } from 'drizzle-orm';

export const hashPassword = async password => {
  const saltRound = 10;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRound);
    return hashedPassword;
  } catch (error) {
    logger.error('Error hashing password', { error });
    throw new Error('Error hashing password');
  }
};

export const comparePassword = async (password, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    logger.error('Error comparing password', { error });
    throw new Error('Error comparing password');
  }
};

export const authenticateUser = async (email, password) => {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (user.length < 1) {
      throw new Error('User not found');
    }
    const isPasswordValid = await comparePassword(password, user[0].password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }
    return user[0];
  } catch (error) {
    logger.error('Error authenticating user', { error });
    throw new Error('Error authenticating user');
  }
};

export const createUser = async user => {
  try {
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, user.email)).limit(1);
    //   console.log(existingUser)
    if (existingUser) {
      logger.warn('User already exists with email: ', user.email);
      throw new Error('User already exists');
    }
    user.password = await hashPassword(user.password);
    // console.log(user)

    const [result] = await db.insert(users).values(user).returning({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      created_at: users.created_at,
      updated_at: users.updated_at,
    });
    // console.log(result)
    logger.info('User created successfully', { userId: result.id });
    return result;
  } catch (error) {
    logger.error('Error creating user', { error });
    throw new Error('Error creating user');
  }
};
