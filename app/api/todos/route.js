// File: app/api/todos/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken'; // Import jwt for verification
import clientPromise from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET; // Make sure your JWT secret is in the environment variables

// Function to verify the JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null; // Return null if token is invalid
  }
};

export async function GET(request) {
  // Get the token from the Authorization header
  const token = request.headers.get('Authorization')?.split(' ')[1];
  const decoded = verifyToken(token);

  // Check if the token is valid
  if (!decoded) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db();

  const todos = await db.collection('todos').find({ userId: new ObjectId(decoded.id) }).toArray();
  return NextResponse.json(todos);
}

export async function POST(request) {
  // Get the token from the Authorization header
  const token = request.headers.get('Authorization')?.split(' ')[1];
  const decoded = verifyToken(token);

  // Check if the token is valid
  if (!decoded) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db();

  const { text, priority, dueDate } = await request.json();
  const newTodo = await db.collection('todos').insertOne({
    text,
    priority,
    dueDate,
    completed: false,
    userId: new ObjectId(decoded.id),
  });
  const obj={
    text,
    priority,
    dueDate,
    completed: false,
    userId:new ObjectId(decoded.id),
    _id:newTodo.insertedId
  }
  return NextResponse.json(obj);
}
