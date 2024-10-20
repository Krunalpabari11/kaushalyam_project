import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import clientPromise from '@/app/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  const { email, password } = await req.json();

  const client = await clientPromise;
  const usersCollection = client.db().collection('users');

  // Find the user by email
  const user = await usersCollection.findOne({ email });
  if (!user) {
    return new Response(JSON.stringify({ message: 'Invalid email or password!' }), { status: 401 });
  }

  // Validate password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return new Response(JSON.stringify({ message: 'Invalid email or password!' }), { status: 401 });
  }

  // Create a JWT token
  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

  return new Response(JSON.stringify({ token }), { status: 200 });
}
