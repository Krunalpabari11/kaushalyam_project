import { NextResponse } from 'next/server'
import clientPromise from '@/app/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function PUT(request, { params }) {
  const client = await clientPromise
  const db = client.db()

  const { id } = params

  const { text, completed, priority, dueDate } = await request.json()


  const updatedTodo = await db.collection('todos').findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { text, completed, priority, dueDate } },
    { returnDocument: 'after' }
  )
  
  if (!updatedTodo) {
    return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
  }

  return NextResponse.json(updatedTodo)
 }

export async function DELETE(request, { params }) {
  const client = await clientPromise
  const db = client.db()

  const { id } = params

  const result = await db.collection('todos').deleteOne({
    _id: new ObjectId(id)
  })

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
  }

  return NextResponse.json({ message: 'Todo deleted successfully' })
}
