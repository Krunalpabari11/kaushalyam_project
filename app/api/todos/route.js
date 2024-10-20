// File: app/api/todos/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import clientPromise from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const client = await clientPromise
  const db = client.db()

  const todos = await db.collection('todos').find({ userId: new ObjectId(session.user.id) }).toArray()
  return NextResponse.json(todos)
}

export async function POST(request) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const client = await clientPromise
  const db = client.db()

  const { text, priority, dueDate } = await request.json()
  const newTodo = await db.collection('todos').insertOne({
    text,
    priority,
    dueDate,
    completed: false,
    userId: new ObjectId(session.user.id),
  })

  return NextResponse.json(newTodo)
}