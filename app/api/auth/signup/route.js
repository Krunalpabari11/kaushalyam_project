import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import clientPromise from '@/app/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  const { email, password } = await req.json();

  const client = await clientPromise;
  const usersCollection = client.db().collection('users');

  // Check if user already exists
  const existingUser = await usersCollection.findOne({ email });
  if (existingUser) {
    return new Response(JSON.stringify({ message: 'User already exists!' }), { status: 400 });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create a new user
  await usersCollection.insertOne({
    email,
    password: hashedPassword,
  });

  return new Response(JSON.stringify({ message: 'User created successfully!' }), { status: 201 });
}
