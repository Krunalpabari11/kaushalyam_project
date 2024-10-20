// File: lib/auth.js
import jwt from 'jsonwebtoken';
import { hash, compare } from 'bcryptjs';

export const hashPassword = async (password) => {
  return await hash(password, 12);
};

export const verifyPassword = async (password, hashedPassword) => {
  return await compare(password, hashedPassword);
};

export const createToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};