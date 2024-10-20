// File: app/api/todos/[id]/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import clientPromise from '../../../../lib/mongodb'
import { ObjectId } from 'mongodb'

export async function PUT(request, { params }) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const client = await clientPromise
  const db = client.db()

  const { id } = params
  const { text, completed, priority, dueDate } = await request.json()

  const updatedTodo = await db.collection('todos').findOneAndUpdate(
    { _id: new ObjectId(id), userId: new ObjectId(session.user.id) },
    { $set: { text, completed, priority, dueDate } },
    { returnDocument: 'after' }
  )

  if (!updatedTodo.value) {
    return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
  }

  return NextResponse.json(updatedTodo.value)
}
export async function DELETE(request, { params }) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const client = await clientPromise
  const db = client.db()

  const { id } = params

  const result = await db.collection('todos').deleteOne({
    _id: new ObjectId(id),
    userId: new ObjectId(session.user.id)
  })

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
  }

  return NextResponse.json({ message: 'Todo deleted successfully' })
}